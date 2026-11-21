"use client";

import { useState } from "react";
import type { FeedItem, SourceHealth } from "@/lib/contracts";

interface HistorySectionProps {
  items: FeedItem[];
  health?: SourceHealth;
  editionDate: string;
}

type HistoryTab = "Events" | "Births" | "Deaths";

export const HistorySection = ({ items, health, editionDate }: HistorySectionProps) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>("Events");
  const [tabCache, setTabCache] = useState<Partial<Record<"Births" | "Deaths", FeedItem[]>>>({});
  const [loadingTab, setLoadingTab] = useState<"Births" | "Deaths" | null>(null);
  const [tabError, setTabError] = useState<string | null>(null);

  const isUnavailable = health?.status === "failed" && items.length === 0;
  const isDegraded =
    health?.status === "degraded" || (health?.status === "failed" && items.length > 0);

  const shortDate = new Date(`${editionDate}T00:00:00Z`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .toUpperCase();

  const handleSelectTab = async (tab: HistoryTab) => {
    setActiveTab(tab);
    setTabError(null);
    if (tab === "Events" || tabCache[tab]) {
      return;
    }

    setLoadingTab(tab);
    try {
      const res = await fetch(`/api/history?type=${tab.toLowerCase()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as { items?: FeedItem[] };
      setTabCache((prev) => ({ ...prev, [tab]: data.items ?? [] }));
    } catch {
      setTabError(`Could not load today's ${tab.toLowerCase()}. Try again later.`);
    } finally {
      setLoadingTab(null);
    }
  };

  const displayedItems = activeTab === "Events" ? items : (tabCache[activeTab] ?? []);

  return (
    <section
      id="history"
      dir="ltr"
      aria-labelledby="history-heading"
      className="cartoon-card scroll-mt-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-orange px-4 py-3">
        <h2
          id="history-heading"
          className="font-headline text-[28px] font-normal uppercase leading-none tracking-[1px] text-ink"
        >
          TODAY IN HISTORY
        </h2>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-dose-yellow">
          {shortDate}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-wrap gap-2">
          {(["Events", "Births", "Deaths"] as HistoryTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => void handleSelectTab(tab)}
                className={`cartoon-tab-chip min-h-[44px] px-4 text-sm font-extrabold transition active:translate-x-[1px] active:translate-y-[1px] ${
                  isActive ? "bg-ink text-dose-yellow" : "bg-white text-ink hover:bg-dose-yellow/30"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {activeTab === "Events" && isDegraded ? (
          <div
            role="status"
            className="cartoon-inner bg-dose-yellow/50 px-3 py-2 text-sm font-bold text-ink"
          >
            One history source had an error. Showing available events.
          </div>
        ) : null}

        {loadingTab === activeTab ? (
          <div className="rounded-[14px] border-2 border-dashed border-ink/40 p-4 text-sm font-semibold text-ink">
            Loading today&apos;s {activeTab.toLowerCase()}...
          </div>
        ) : activeTab !== "Events" && tabError ? (
          <div className="rounded-[14px] border-2 border-dashed border-ink/40 p-4 text-sm font-semibold text-ink">
            {tabError}
          </div>
        ) : (activeTab === "Events" && isUnavailable) || displayedItems.length === 0 ? (
          <div className="rounded-[14px] border-2 border-dashed border-ink/40 p-4 text-sm text-ink">
            Could not load today&apos;s {activeTab.toLowerCase()}. Try again later.
          </div>
        ) : (
          <ul className="flex flex-col gap-3.5">
            {displayedItems.map((item, idx) => (
              <li key={item.id} className="flex flex-col gap-3.5">
                {idx > 0 ? <hr className="h-0 border-0 border-t-[3px] border-dashed border-ink" /> : null}
                <div className="flex items-start gap-3">
                  <span className="inline-flex shrink-0 items-center rounded-[12px] bg-ink px-2.5 py-1 font-headline text-[22px] leading-none text-dose-yellow">
                    {item.year ?? "—"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 break-words text-[16px] font-semibold leading-[1.45] text-ink">
                      {item.summary}
                    </p>
                    {item.externalUrl ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-[44px] items-center text-[13px] font-extrabold text-ink underline decoration-2 underline-offset-4 hover:text-[#333]"
                      >
                        Read on {item.sourceLabel} →
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
