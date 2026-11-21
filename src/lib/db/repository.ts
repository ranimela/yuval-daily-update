import type { FeedCategory, FeedItem, SourceHealth, SourceStatus } from "@/lib/contracts";
import type { SqlClient } from "@/lib/db/client";

interface FeedItemRow {
  id: string;
  source_id: string;
  source_label: string;
  category: FeedCategory;
  language: "en" | "he";
  direction: "ltr" | "rtl";
  title: string;
  summary: string;
  external_url: string | null;
  year: number | null;
  published_at: string | Date;
  ingested_at: string | Date;
  edition_date: string | Date;
}

interface SourceHealthRow {
  source_id: string;
  category: FeedCategory;
  status: SourceStatus;
  last_success_at: string | Date | null;
  last_error: string | null;
  updated_at: string | Date;
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toDateOnly(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function mapFeedRow(row: FeedItemRow): FeedItem {
  return {
    id: row.id,
    sourceId: row.source_id,
    sourceLabel: row.source_label,
    category: row.category,
    language: row.language,
    direction: row.direction,
    title: row.title,
    summary: row.summary,
    externalUrl: row.external_url,
    year: row.year,
    publishedAt: toIsoString(row.published_at),
    ingestedAt: toIsoString(row.ingested_at),
    editionDate: toDateOnly(row.edition_date),
  };
}

function mapHealthRow(row: SourceHealthRow): SourceHealth {
  return {
    sourceId: row.source_id,
    category: row.category,
    status: row.status,
    lastSuccessAt: row.last_success_at ? toIsoString(row.last_success_at) : null,
    lastError: row.last_error,
    updatedAt: toIsoString(row.updated_at),
  };
}

/**
 * Idempotently upsert normalized feed items into Neon Postgres.
 */
export async function upsertFeedItems(sql: SqlClient, items: FeedItem[]): Promise<void> {
  for (const item of items) {
    await sql`
      INSERT INTO feed_items (
        id, source_id, source_label, category, language, direction,
        title, summary, external_url, year, published_at, ingested_at, edition_date
      ) VALUES (
        ${item.id}, ${item.sourceId}, ${item.sourceLabel}, ${item.category},
        ${item.language}, ${item.direction}, ${item.title}, ${item.summary},
        ${item.externalUrl}, ${item.year}, ${item.publishedAt}, ${item.ingestedAt},
        ${item.editionDate}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        external_url = EXCLUDED.external_url,
        year = EXCLUDED.year,
        published_at = EXCLUDED.published_at,
        ingested_at = EXCLUDED.ingested_at,
        edition_date = EXCLUDED.edition_date
    `;
  }
}

/**
 * Fetch up to `limit` history events for the specified YYYY-MM-DD edition date.
 */
export async function getHistoryEventsByEdition(
  sql: SqlClient,
  editionDate: string,
  limit = 10
): Promise<FeedItem[]> {
  const rows = (await sql`
    SELECT *
    FROM feed_items
    WHERE category = 'history_events'
      AND edition_date = ${editionDate}::date
    ORDER BY year DESC NULLS LAST, published_at DESC
    LIMIT ${limit}
  `) as FeedItemRow[];
  return rows.map(mapFeedRow);
}

/**
 * Fetch the latest `limit` news update items across recent editions.
 */
export async function getLatestNewsUpdates(sql: SqlClient, limit = 15): Promise<FeedItem[]> {
  const rows = (await sql`
    SELECT *
    FROM feed_items
    WHERE category = 'news_update'
    ORDER BY published_at DESC, ingested_at DESC
    LIMIT ${limit}
  `) as FeedItemRow[];
  return rows.map(mapFeedRow);
}

/**
 * Fetch all tracked source health records.
 */
export async function getAllSourceHealth(sql: SqlClient): Promise<SourceHealth[]> {
  const rows = (await sql`
    SELECT source_id, category, status, last_success_at, last_error, updated_at
    FROM source_health
    ORDER BY category, source_id
  `) as SourceHealthRow[];
  return rows.map(mapHealthRow);
}

/**
 * Record source health status and clear any active refresh lease.
 */
export async function recordSourceHealth(
  sql: SqlClient,
  params: {
    sourceId: string;
    category: FeedCategory;
    status: SourceStatus;
    lastSuccessAt?: string | null;
    lastError?: string | null;
  }
): Promise<void> {
  const nowIso = new Date().toISOString();
  await sql`
    INSERT INTO source_health (
      source_id, category, status, last_success_at, last_error, lease_until, updated_at
    ) VALUES (
      ${params.sourceId},
      ${params.category},
      ${params.status},
      ${params.lastSuccessAt ?? null},
      ${params.lastError ?? null},
      NULL,
      ${nowIso}
    )
    ON CONFLICT (source_id) DO UPDATE SET
      status = EXCLUDED.status,
      last_success_at = COALESCE(EXCLUDED.last_success_at, source_health.last_success_at),
      last_error = EXCLUDED.last_error,
      lease_until = NULL,
      updated_at = EXCLUDED.updated_at
  `;
}

/**
 * Atomically acquire a short-lived refresh lease if stale beyond `ttlMinutes` and not currently leased.
 */
export async function acquireRefreshLease(
  sql: SqlClient,
  params: {
    sourceId: string;
    category: FeedCategory;
    ttlMinutes: number;
    leaseSeconds?: number;
  }
): Promise<boolean> {
  const leaseSeconds = params.leaseSeconds ?? 30;
  const rows = (await sql`
    INSERT INTO source_health (
      source_id, category, status, lease_until, updated_at
    ) VALUES (
      ${params.sourceId},
      ${params.category},
      'ok',
      NOW() + (${leaseSeconds} * INTERVAL '1 second'),
      NOW() - (${params.ttlMinutes + 1} * INTERVAL '1 minute')
    )
    ON CONFLICT (source_id) DO UPDATE SET
      lease_until = NOW() + (${leaseSeconds} * INTERVAL '1 second')
    WHERE (source_health.lease_until IS NULL OR source_health.lease_until < NOW())
      AND (
        source_health.last_success_at IS NULL
        OR source_health.updated_at < NOW() - (${params.ttlMinutes} * INTERVAL '1 minute')
      )
    RETURNING source_id
  `) as Array<{ source_id: string }>;
  return rows.length > 0;
}

/**
 * Prune feed_items older than `retentionDays` to stay well within Neon free-tier storage.
 */
export async function pruneOldFeedItems(sql: SqlClient, retentionDays = 7): Promise<void> {
  await sql`
    DELETE FROM feed_items
    WHERE edition_date < (CURRENT_DATE - (${retentionDays} * INTERVAL '1 day'))::date
  `;
}

export interface LoginRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Check if `ipKey` is locked out; returns whether login attempt is allowed.
 */
export async function getLoginLockStatus(
  sql: SqlClient,
  ipKey: string
): Promise<LoginRateLimitResult> {
  const rows = (await sql`
    SELECT attempts, window_start, locked_until
    FROM login_attempts
    WHERE ip_key = ${ipKey}
  `) as Array<{ attempts: number; window_start: string | Date; locked_until: string | Date | null }>;

  if (rows.length === 0) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const row = rows[0];
  if (row.locked_until) {
    const lockedUntilMs = new Date(row.locked_until).getTime();
    const remainingMs = lockedUntilMs - Date.now();
    if (remainingMs > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(remainingMs / 1000) };
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Record a failed login attempt and lock out for 15 minutes after `maxAttempts` failures.
 */
export async function recordLoginFailure(
  sql: SqlClient,
  ipKey: string,
  maxAttempts = 5,
  windowMinutes = 15
): Promise<LoginRateLimitResult> {
  const rows = (await sql`
    INSERT INTO login_attempts (ip_key, attempts, window_start, locked_until)
    VALUES (${ipKey}, 1, NOW(), NULL)
    ON CONFLICT (ip_key) DO UPDATE SET
      attempts = CASE
        WHEN login_attempts.window_start < NOW() - (${windowMinutes} * INTERVAL '1 minute') THEN 1
        ELSE login_attempts.attempts + 1
      END,
      window_start = CASE
        WHEN login_attempts.window_start < NOW() - (${windowMinutes} * INTERVAL '1 minute') THEN NOW()
        ELSE login_attempts.window_start
      END,
      locked_until = CASE
        WHEN (
          CASE
            WHEN login_attempts.window_start < NOW() - (${windowMinutes} * INTERVAL '1 minute') THEN 1
            ELSE login_attempts.attempts + 1
          END
        ) >= ${maxAttempts} THEN NOW() + (${windowMinutes} * INTERVAL '1 minute')
        ELSE NULL
      END
    RETURNING attempts, locked_until
  `) as Array<{ attempts: number; locked_until: string | Date | null }>;

  const row = rows[0];
  if (row?.locked_until) {
    const remainingMs = new Date(row.locked_until).getTime() - Date.now();
    if (remainingMs > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(remainingMs / 1000) };
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Reset failed login counter after a successful authentication.
 */
export async function clearLoginAttempts(sql: SqlClient, ipKey: string): Promise<void> {
  await sql`
    DELETE FROM login_attempts
    WHERE ip_key = ${ipKey}
  `;
}
