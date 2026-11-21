import type { FeedItem } from "@/lib/contracts";
import type { SqlClient } from "@/lib/db/client";
import { recordSourceHealth, upsertFeedItems } from "@/lib/db/repository";
import { getJerusalemDateParts } from "@/lib/ingestion/history";
import { logEvent } from "@/lib/logger";
import { sanitizeHttpUrl, sanitizePlainText, sha256Hex } from "@/lib/sanitize";

const DEFAULT_HAARETZ_RSS_URLS = [
  "https://www.haaretz.co.il/srv/haaretz-latest-rss",
  "https://www.haaretz.co.il/cmlink/1.1617539",
];

function unwrapCdata(value: string): string {
  return value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, "$1").trim();
}

function extractTag(block: string, tagName: string): string {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? unwrapCdata(match[1].trim()) : "";
}

/**
 * Parse RSS <item> or Atom <entry> blocks into normalized Hebrew RTL news items.
 */
export function parseRssItems(xml: string, limit = 15): Array<{
  title: string;
  summary: string;
  externalUrl: string | null;
  publishedAt: string;
}> {
  const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const results: Array<{
    title: string;
    summary: string;
    externalUrl: string | null;
    publishedAt: string;
  }> = [];

  for (const block of itemMatches) {
    const title = sanitizePlainText(extractTag(block, "title"), 240);
    if (!title) {
      continue;
    }
    const rawDesc = extractTag(block, "description") || extractTag(block, "content:encoded");
    const summary = sanitizePlainText(rawDesc, 500) || title;
    const rawLink = extractTag(block, "link") || extractTag(block, "guid");
    const externalUrl = sanitizeHttpUrl(rawLink);
    const rawDate = extractTag(block, "pubDate") || extractTag(block, "dc:date");
    const parsedDate = rawDate ? new Date(rawDate) : new Date();
    const publishedAt = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();

    results.push({ title, summary, externalUrl, publishedAt });
    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

/**
 * Ingest up to 15 latest public headlines from haaretz.co.il RSS without paywall bypass.
 */
export async function ingestNewsUpdates(
  sql: SqlClient,
  options: { correlationId: string; timeoutMs?: number; limit?: number }
): Promise<{ itemsWritten: number; status: "ok" | "failed" }> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const limit = options.limit ?? 15;
  const configuredUrl = process.env.HAARETZ_RSS_URL?.trim();
  const candidateUrls = configuredUrl ? [configuredUrl] : DEFAULT_HAARETZ_RSS_URLS;

  let lastError = "No RSS feed URL succeeded";
  let parsedItems: ReturnType<typeof parseRssItems> = [];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (compatible; YuvalDailyUpdate/1.0; +https://yuval.melameds.net)",
        },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
      if (!res.ok) {
        lastError = `Haaretz RSS HTTP ${res.status}`;
        continue;
      }
      const xml = await res.text();
      const items = parseRssItems(xml, limit);
      if (items.length === 0) {
        lastError = "Haaretz RSS returned zero parseable items";
        continue;
      }
      parsedItems = items;
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  if (parsedItems.length === 0) {
    logEvent("warn", "Haaretz news ingestion failed; preserving cached items", {
      correlationId: options.correlationId,
      module: "ingestion/news",
      reason: lastError,
    });
    await recordSourceHealth(sql, {
      sourceId: "haaretz",
      category: "news_update",
      status: "failed",
      lastError: lastError.slice(0, 240),
    });
    return { itemsWritten: 0, status: "failed" };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const { editionDate } = getJerusalemDateParts(now);

  const items: FeedItem[] = await Promise.all(
    parsedItems.map(async (entry) => ({
      id: await sha256Hex(`haaretz:${entry.externalUrl ?? entry.title}`),
      sourceId: "haaretz",
      sourceLabel: "הארץ",
      category: "news_update",
      language: "he",
      direction: "rtl",
      title: entry.title,
      summary: entry.summary,
      externalUrl: entry.externalUrl,
      year: null,
      publishedAt: entry.publishedAt,
      ingestedAt: nowIso,
      editionDate,
    }))
  );

  await upsertFeedItems(sql, items);
  await recordSourceHealth(sql, {
    sourceId: "haaretz",
    category: "news_update",
    status: "ok",
    lastSuccessAt: nowIso,
    lastError: null,
  });

  logEvent("info", "News ingestion completed", {
    correlationId: options.correlationId,
    module: "ingestion/news",
    itemsWritten: items.length,
  });

  return { itemsWritten: items.length, status: "ok" };
}
