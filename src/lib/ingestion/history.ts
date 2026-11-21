import type { FeedItem } from "@/lib/contracts";
import type { SqlClient } from "@/lib/db/client";
import {
  pruneOldFeedItems,
  recordSourceHealth,
  upsertFeedItems,
} from "@/lib/db/repository";
import { isWesternHistory } from "@/lib/ingestion/westernFilter";
import { logEvent } from "@/lib/logger";
import { sanitizeHttpUrl, sanitizePlainText, sha256Hex } from "@/lib/sanitize";

export interface JerusalemDateParts {
  editionDate: string;
  month: string;
  day: string;
  monthNum: number;
  dayNum: number;
}

interface RawHistoryCandidate {
  sourceId: "wikimedia" | "zenquotes";
  sourceLabel: string;
  canonicalKey: string;
  title: string;
  summary: string;
  externalUrl: string | null;
  year: number | null;
}

/**
 * Compute current YYYY-MM-DD and MM/DD in Asia/Jerusalem timezone.
 */
export function getJerusalemDateParts(now = new Date()): JerusalemDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return {
    editionDate: `${year}-${month}-${day}`,
    month,
    day,
    monthNum: Number.parseInt(month, 10),
    dayNum: Number.parseInt(day, 10),
  };
}

async function fetchWikimediaCandidates(
  month: string,
  day: string,
  timeoutMs: number
): Promise<RawHistoryCandidate[]> {
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)",
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Wikimedia HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    selected?: Array<{
      text?: unknown;
      year?: unknown;
      pages?: Array<{
        title?: unknown;
        content_urls?: { desktop?: { page?: unknown } };
      }>;
    }>;
  };
  if (!Array.isArray(data?.selected)) {
    throw new Error("Wikimedia response missing selected array");
  }

  const out: RawHistoryCandidate[] = [];
  for (const entry of data.selected) {
    const rawText = typeof entry.text === "string" ? entry.text : "";
    const summary = sanitizePlainText(rawText, 500);
    if (!summary) {
      continue;
    }
    const year = typeof entry.year === "number" && Number.isFinite(entry.year) ? entry.year : null;
    const firstPage = Array.isArray(entry.pages) ? entry.pages[0] : undefined;
    const pageTitle =
      typeof firstPage?.title === "string"
        ? sanitizePlainText(firstPage.title.replace(/_/g, " "), 240)
        : "";
    const title = pageTitle || sanitizePlainText(summary, 120);
    const externalUrl = sanitizeHttpUrl(
      typeof firstPage?.content_urls?.desktop?.page === "string"
        ? firstPage.content_urls.desktop.page
        : null
    );
    out.push({
      sourceId: "wikimedia",
      sourceLabel: "Wikimedia",
      canonicalKey: `${year ?? "na"}:${summary.slice(0, 80)}`,
      title,
      summary,
      externalUrl,
      year,
    });
  }
  return out;
}

async function fetchZenQuotesCandidates(
  monthNum: number,
  dayNum: number,
  timeoutMs: number
): Promise<RawHistoryCandidate[]> {
  const url = `https://today.zenquotes.io/api/${monthNum}/${dayNum}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)",
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`ZenQuotes HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    data?: {
      Events?: Array<{
        text?: unknown;
        links?: Record<string, Record<string, unknown>>;
      }>;
    };
  };
  const events = data?.data?.Events;
  if (!Array.isArray(events)) {
    throw new Error("ZenQuotes response missing data.Events array");
  }

  const out: RawHistoryCandidate[] = [];
  for (const entry of events) {
    const rawText = typeof entry.text === "string" ? entry.text : "";
    const decoded = sanitizePlainText(rawText, 500);
    if (!decoded) {
      continue;
    }
    const yearMatch = decoded.match(/^(\d{3,4})\s*[–—-]\s*(.+)$/);
    const year = yearMatch ? Number.parseInt(yearMatch[1], 10) : null;
    const summary = yearMatch ? yearMatch[2].trim() : decoded;
    const firstLink =
      entry.links && typeof entry.links === "object"
        ? Object.values(entry.links)[0]?.["1"]
        : undefined;
    const externalUrl = sanitizeHttpUrl(typeof firstLink === "string" ? firstLink : null);

    out.push({
      sourceId: "zenquotes",
      sourceLabel: "ZenQuotes",
      canonicalKey: `${year ?? "na"}:${summary.slice(0, 80)}`,
      title: sanitizePlainText(summary, 120),
      summary,
      externalUrl,
      year,
    });
  }
  return out;
}

/**
 * Ingest ~10 Western-history items for today's Asia/Jerusalem editionDate from Wikimedia & ZenQuotes.
 */
export async function ingestHistoryEvents(
  sql: SqlClient,
  options: { correlationId: string; timeoutMs?: number; limit?: number; now?: Date }
): Promise<{ itemsWritten: number; status: "ok" | "degraded" | "failed" }> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const limit = options.limit ?? 10;
  const { editionDate, month, day, monthNum, dayNum } = getJerusalemDateParts(options.now);

  const [wikiResult, zenResult] = await Promise.allSettled([
    fetchWikimediaCandidates(month, day, timeoutMs),
    fetchZenQuotesCandidates(monthNum, dayNum, timeoutMs),
  ]);

  const candidates: RawHistoryCandidate[] = [];
  const errors: string[] = [];

  if (wikiResult.status === "fulfilled") {
    candidates.push(...wikiResult.value);
  } else {
    const msg = wikiResult.reason instanceof Error ? wikiResult.reason.message : String(wikiResult.reason);
    errors.push(`wikimedia: ${msg}`);
    logEvent(
      "warn",
      "Wikimedia history fetch failed",
      { correlationId: options.correlationId, module: "ingestion/history" },
      wikiResult.reason
    );
  }

  if (zenResult.status === "fulfilled") {
    candidates.push(...zenResult.value);
  } else {
    const msg = zenResult.reason instanceof Error ? zenResult.reason.message : String(zenResult.reason);
    errors.push(`zenquotes: ${msg}`);
    logEvent(
      "warn",
      "ZenQuotes history fetch failed",
      { correlationId: options.correlationId, module: "ingestion/history" },
      zenResult.reason
    );
  }

  if (wikiResult.status === "rejected" && zenResult.status === "rejected") {
    await recordSourceHealth(sql, {
      sourceId: "history_combined",
      category: "history_events",
      status: "failed",
      lastError: errors.join("; ").slice(0, 240),
    });
    return { itemsWritten: 0, status: "failed" };
  }

  const seenKeys = new Set<string>();
  const filtered: RawHistoryCandidate[] = [];
  for (const candidate of candidates) {
    if (!isWesternHistory(`${candidate.title} ${candidate.summary}`)) {
      continue;
    }
    const dedupeKey = `${candidate.year ?? "na"}:${candidate.summary.slice(0, 48).toLowerCase()}`;
    if (seenKeys.has(dedupeKey)) {
      continue;
    }
    seenKeys.add(dedupeKey);
    filtered.push(candidate);
    if (filtered.length >= limit) {
      break;
    }
  }

  const nowIso = new Date().toISOString();
  const items: FeedItem[] = await Promise.all(
    filtered.map(async (c) => ({
      id: await sha256Hex(`${c.sourceId}:${editionDate}:${c.canonicalKey}`),
      sourceId: c.sourceId,
      sourceLabel: c.sourceLabel,
      category: "history_events",
      language: "en",
      direction: "ltr",
      title: c.title,
      summary: c.summary,
      externalUrl: c.externalUrl,
      year: c.year,
      publishedAt: nowIso,
      ingestedAt: nowIso,
      editionDate,
    }))
  );

  if (items.length > 0) {
    await upsertFeedItems(sql, items);
  }
  await pruneOldFeedItems(sql, 7);

  const status = errors.length > 0 ? "degraded" : "ok";
  await recordSourceHealth(sql, {
    sourceId: "history_combined",
    category: "history_events",
    status,
    lastSuccessAt: nowIso,
    lastError: errors.length > 0 ? errors.join("; ").slice(0, 240) : null,
  });

  logEvent("info", "History ingestion completed", {
    correlationId: options.correlationId,
    module: "ingestion/history",
    itemsWritten: items.length,
    status,
  });

  return { itemsWritten: items.length, status };
}
