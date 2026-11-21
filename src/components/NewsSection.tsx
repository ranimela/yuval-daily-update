"use client";

import { useMemo, useState } from "react";
import type { FeedItem, SourceHealth } from "@/lib/contracts";

interface NewsSectionProps {
  items: FeedItem[];
  health?: SourceHealth;
}

type NewsFilter = "All" | "Israel" | "World" | "Science";

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 60_000) {
    return "Just now";
  }
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) {
    return `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function matchesNewsFilter(item: FeedItem, filter: NewsFilter): boolean {
  if (filter === "All") {
    return true;
  }
  const text = `${item.title} ${item.summary}`;
  if (filter === "Israel") {
    return /ישראל|צה"ל|ירושלים|תל אביב|ממשלה|כנסת|רמאללה|עזה|צפון|התנחלות/i.test(text);
  }
  if (filter === "Science") {
    return /מדע|טכנולוג|שבב|אנבידיה|חלל|מחקר|בינה|רפואה|אקלים|פיזיקה/i.test(text);
  }
  return !/ישראל|צה"ל|ירושלים|תל אביב|ממשלה|כנסת/i.test(text);
}

export const NewsSection = ({ items, health }: NewsSectionProps) => {
  const [filter, setFilter] = useState<NewsFilter>("All");
  const isFailed = health?.status === "failed";

  const visibleItems = useMemo(
    () => items.filter((item) => matchesNewsFilter(item, filter)).slice(0, 5),
    [items, filter]
  );

  return (
    <section id="news" aria-labelledby="news-heading" className="cartoon-card scroll-mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-red px-4 py-3">
        <h2
          id="news-heading"
          className="font-headline text-[28px] font-normal uppercase leading-none tracking-[1px] text-ink"
        >
          NEWS FEED
        </h2>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
          {visibleItems.length} {visibleItems.length === 1 ? "STORY" : "STORIES"}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-wrap gap-2">
          {(["All", "Israel", "World", "Science"] as NewsFilter[]).map((chip) => {
            const isActive = filter === chip;
            return (
              <button
                key={chip}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(chip)}
                className={`cartoon-tab-chip min-h-[44px] flex-none px-4 text-sm font-extrabold transition active:translate-x-[1px] active:translate-y-[1px] ${
                  isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-dose-red/20"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {isFailed ? (
          <div
            role="status"
            className="cartoon-inner bg-dose-yellow/60 px-3 py-2 text-sm font-bold text-ink"
          >
            Could not load latest news. {items.length > 0 ? "Showing cached stories." : ""}
          </div>
        ) : null}

        {visibleItems.length === 0 ? (
          <div className="rounded-[14px] border-2 border-dashed border-ink/40 p-4 text-sm font-semibold text-ink">
            No stories match this filter right now. Try <strong>All</strong>.
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className="cartoon-inner flex flex-col gap-1.5 bg-[#f7f7f7] p-3"
              >
                <div className="flex items-center justify-between gap-2 text-[13px] font-extrabold">
                  <span className="inline-flex items-center rounded-full border-2 border-ink bg-dose-yellow px-2.5 py-0 text-ink">
                    {item.sourceLabel}
                  </span>
                  <span className="text-ink/75">{formatTimeAgo(item.publishedAt)}</span>
                </div>

                <h3
                  dir={item.direction}
                  lang={item.language}
                  className="m-0 break-words font-hebrew text-[18px] font-extrabold leading-[1.25] text-ink"
                >
                  {item.title}
                </h3>

                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[15px] font-extrabold text-ink underline decoration-2 underline-offset-4 hover:text-[#333]"
                  >
                    Read the story
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}

        <p className="m-0 text-[13px] font-semibold text-ink/80">
          Sources are picked by a parent. Kid-appropriate feeds only.
        </p>
      </div>
    </section>
  );
};
