import type { FeedResponse } from "@/lib/contracts";
import type { SqlClient } from "@/lib/db/client";
import {
  acquireRefreshLease,
  getAllSourceHealth,
  getHistoryEventsByEdition,
  getLatestNewsUpdates,
} from "@/lib/db/repository";
import { getJerusalemDateParts, ingestHistoryEvents } from "@/lib/ingestion/history";
import { ingestNewsUpdates } from "@/lib/ingestion/news";
import { logEvent } from "@/lib/logger";

/**
 * Load the daily feed from Neon Postgres with lease-guarded on-demand TTL refreshes.
 */
export async function loadDailyFeed(
  sql: SqlClient,
  correlationId: string
): Promise<FeedResponse> {
  const { editionDate } = getJerusalemDateParts();

  let [historyEvents, newsUpdates] = await Promise.all([
    getHistoryEventsByEdition(sql, editionDate, 10),
    getLatestNewsUpdates(sql, 15),
  ]);

  if (historyEvents.length === 0) {
    try {
      const leased = await acquireRefreshLease(sql, {
        sourceId: "history_combined",
        category: "history_events",
        ttlMinutes: 60,
        leaseSeconds: 20,
      });
      if (leased) {
        await ingestHistoryEvents(sql, { correlationId, timeoutMs: 4500, limit: 10 });
        historyEvents = await getHistoryEventsByEdition(sql, editionDate, 10);
      }
    } catch (err) {
      logEvent(
        "warn",
        "On-demand history fallback failed",
        { correlationId, module: "feedService" },
        err
      );
    }
  }

  try {
    const newsLeased = await acquireRefreshLease(sql, {
      sourceId: "haaretz",
      category: "news_update",
      ttlMinutes: 15,
      leaseSeconds: 20,
    });
    if (newsLeased) {
      await ingestNewsUpdates(sql, { correlationId, timeoutMs: 4500, limit: 15 });
      newsUpdates = await getLatestNewsUpdates(sql, 15);
    }
  } catch (err) {
    logEvent(
      "warn",
      "On-demand news TTL refresh failed; returning cached rows",
      { correlationId, module: "feedService" },
      err
    );
  }

  const health = await getAllSourceHealth(sql);

  return {
    editionDate,
    historyEvents,
    newsUpdates,
    health,
  };
}
