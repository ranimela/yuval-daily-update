import type { FeedItem } from "@/lib/contracts";
import type { SqlClient } from "@/lib/db/client";
import {
  pruneOldFeedItems,
  recordSourceHealth,
  upsertFeedItems,
} from "@/lib/db/repository";
import {
  getWesternHistoryPriority,
} from "@/lib/ingestion/westernFilter";
import { logEvent } from "@/lib/logger";
import { sanitizeHttpUrl, sanitizePlainText, sha256Hex } from "@/lib/sanitize";
import { isWarEvent } from "@/lib/warTimelines";

export interface JerusalemDateParts {
  editionDate: string;
  month: string;
  day: string;
  monthNum: number;
  dayNum: number;
}

interface RawHistoryCandidate {
  sourceId: "wikimedia" | "byabbe" | "zenquotes";
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
    events?: Array<{
      text?: unknown;
      year?: unknown;
      pages?: Array<{
        title?: unknown;
        content_urls?: { desktop?: { page?: unknown } };
      }>;
    }>;
    selected?: Array<{
      text?: unknown;
      year?: unknown;
      pages?: Array<{
        title?: unknown;
        content_urls?: { desktop?: { page?: unknown } };
      }>;
    }>;
  };
  const entries = Array.isArray(data?.events) ? data.events : data?.selected;
  if (!Array.isArray(entries)) {
    throw new Error("Wikimedia response missing events/selected array");
  }

  const out: RawHistoryCandidate[] = [];
  for (const entry of entries) {
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

function parseYearString(rawYear: unknown): number | null {
  if (typeof rawYear === "number" && Number.isFinite(rawYear)) {
    return rawYear;
  }
  if (typeof rawYear !== "string") {
    return null;
  }
  const trimmed = rawYear.trim();
  const bcMatch = trimmed.match(/^(\d+)\s*BC$/i);
  if (bcMatch) {
    return -Number.parseInt(bcMatch[1], 10);
  }
  const num = Number.parseInt(trimmed, 10);
  return Number.isFinite(num) ? num : null;
}

async function fetchByabbeCandidates(
  monthNum: number,
  dayNum: number,
  timeoutMs: number
): Promise<RawHistoryCandidate[]> {
  const url = `https://byabbe.se/on-this-day/${monthNum}/${dayNum}/events.json`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)",
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`byabbe HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    events?: Array<{
      year?: unknown;
      description?: unknown;
      wikipedia?: Array<{ title?: unknown; wikipedia?: unknown }>;
    }>;
  };
  if (!Array.isArray(data?.events)) {
    throw new Error("byabbe response missing events array");
  }

  const out: RawHistoryCandidate[] = [];
  for (const entry of data.events) {
    const rawDesc = typeof entry.description === "string" ? entry.description : "";
    const summary = sanitizePlainText(rawDesc, 500);
    if (!summary) {
      continue;
    }
    const year = parseYearString(entry.year);
    const firstWiki = Array.isArray(entry.wikipedia) ? entry.wikipedia[0] : undefined;
    const title =
      typeof firstWiki?.title === "string"
        ? sanitizePlainText(firstWiki.title, 240)
        : sanitizePlainText(summary, 120);
    const externalUrl = sanitizeHttpUrl(
      typeof firstWiki?.wikipedia === "string" ? firstWiki.wikipedia : null
    );
    out.push({
      sourceId: "byabbe",
      sourceLabel: "Wikipedia",
      canonicalKey: `${year ?? "na"}:${summary.slice(0, 80)}`,
      title,
      summary,
      externalUrl,
      year,
    });
  }
  return out;
}

/**
 * Ingest ~10 Western-history items for today's Asia/Jerusalem editionDate from Wikimedia, byabbe.se & ZenQuotes.
 */
export async function ingestHistoryEvents(
  sql: SqlClient,
  options: { correlationId: string; timeoutMs?: number; limit?: number; now?: Date }
): Promise<{ itemsWritten: number; status: "ok" | "degraded" | "failed" }> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const limit = options.limit ?? 10;
  const { editionDate, month, day, monthNum, dayNum } = getJerusalemDateParts(options.now);

  const [wikiResult, byabbeResult, zenResult] = await Promise.allSettled([
    fetchWikimediaCandidates(month, day, timeoutMs),
    fetchByabbeCandidates(monthNum, dayNum, timeoutMs),
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

  if (byabbeResult.status === "fulfilled") {
    candidates.push(...byabbeResult.value);
  } else {
    const msg = byabbeResult.reason instanceof Error ? byabbeResult.reason.message : String(byabbeResult.reason);
    errors.push(`byabbe: ${msg}`);
    logEvent(
      "warn",
      "byabbe.se history fetch failed",
      { correlationId: options.correlationId, module: "ingestion/history" },
      byabbeResult.reason
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

  if (
    wikiResult.status === "rejected" &&
    byabbeResult.status === "rejected" &&
    zenResult.status === "rejected"
  ) {
    await recordSourceHealth(sql, {
      sourceId: "history_combined",
      category: "history_events",
      status: "failed",
      lastError: errors.join("; ").slice(0, 240),
    });
    return { itemsWritten: 0, status: "failed" };
  }

  const seenKeys = new Set<string>();
  const scored: Array<{ candidate: RawHistoryCandidate; priority: number }> = [];
  for (const candidate of candidates) {
    if (
      isWarEvent({
        id: "",
        sourceId: candidate.sourceId,
        sourceLabel: candidate.sourceLabel,
        category: "history_events",
        language: "en",
        direction: "ltr",
        title: candidate.title,
        summary: candidate.summary,
        externalUrl: candidate.externalUrl,
        year: candidate.year,
        publishedAt: "",
        ingestedAt: "",
        editionDate,
      })
    ) {
      continue;
    }
    const priority = getWesternHistoryPriority(
      `${candidate.title} ${candidate.summary}`,
      candidate.year
    );
    if (priority === 0) {
      continue;
    }
    const dedupeKey = `${candidate.year ?? "na"}:${candidate.summary.slice(0, 48).toLowerCase()}`;
    if (seenKeys.has(dedupeKey)) {
      continue;
    }
    seenKeys.add(dedupeKey);
    scored.push({ candidate, priority });
  }

  scored.sort((a, b) => b.priority - a.priority);
  const filtered = scored.slice(0, limit).map((entry) => entry.candidate);

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
