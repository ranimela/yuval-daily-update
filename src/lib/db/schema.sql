CREATE TABLE IF NOT EXISTS feed_items (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('history_events', 'news_update')),
  language TEXT NOT NULL CHECK (language IN ('en', 'he')),
  direction TEXT NOT NULL CHECK (direction IN ('ltr', 'rtl')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  external_url TEXT,
  year INTEGER,
  published_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL,
  edition_date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feed_items_category_edition
  ON feed_items (category, edition_date DESC, published_at DESC);

CREATE TABLE IF NOT EXISTS source_health (
  source_id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('history_events', 'news_update')),
  status TEXT NOT NULL CHECK (status IN ('ok', 'degraded', 'failed')),
  last_success_at TIMESTAMPTZ,
  last_error TEXT,
  lease_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ
);
