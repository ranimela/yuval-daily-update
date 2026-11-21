export type FeedCategory = "history_events" | "news_update";
export type LanguageDirection = "ltr" | "rtl";
export type SourceStatus = "ok" | "degraded" | "failed";

export interface FeedItem {
  id: string;
  sourceId: string;
  sourceLabel: string;
  category: FeedCategory;
  language: "en" | "he";
  direction: LanguageDirection;
  title: string;
  summary: string;
  externalUrl: string | null;
  year: number | null;
  publishedAt: string;
  ingestedAt: string;
  editionDate: string;
}

export interface SourceHealth {
  sourceId: string;
  category: FeedCategory;
  status: SourceStatus;
  lastSuccessAt: string | null;
  lastError: string | null;
  updatedAt: string;
}

export interface FeedResponse {
  editionDate: string;
  historyEvents: FeedItem[];
  newsUpdates: FeedItem[];
  health: SourceHealth[];
}
