import type { FeedItem, SourceHealth } from "@/lib/contracts";

interface HistorySectionProps {
  items: FeedItem[];
  health?: SourceHealth;
  editionDate: string;
}

export const HistorySection = ({ items, health, editionDate }: HistorySectionProps) => {
  const isUnavailable = health?.status === "failed" && items.length === 0;
  const isDegraded = health?.status === "degraded" || (health?.status === "failed" && items.length > 0);

  return (
    <section dir="ltr" aria-labelledby="history-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-tertiary px-3 py-1 font-mono text-xs font-medium text-gray-900">
            {editionDate} · 07:00
          </span>
          <h2 id="history-heading" className="mt-2 font-headline text-3xl font-bold text-gray-900">
            Today&apos;s events in history
          </h2>
        </div>
        <span className="rounded-full border border-gray-200 bg-surface-muted px-3 py-1 text-xs font-medium text-gray-700">
          Europe · US · Israel
        </span>
      </div>

      {isDegraded ? (
        <div
          role="status"
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          One history source had an error. Showing available cached/partial events.
        </div>
      ) : null}

      {isUnavailable || items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-sm text-gray-600">
          History events are temporarily unavailable for today. Please check back shortly.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className={`glass-panel rounded-2xl p-6 transition duration-150 hover:scale-[1.01] hover:shadow-card ${
                idx === 0 ? "md:col-span-2 border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {item.year !== null ? (
                  <span className="rounded bg-tertiary px-2.5 py-0.5 font-mono text-xs font-semibold text-gray-900">
                    {item.year}
                  </span>
                ) : (
                  <span className="rounded bg-surface-muted px-2.5 py-0.5 font-mono text-xs text-gray-700">
                    History
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500">{item.sourceLabel}</span>
              </div>

              <h3 className="mt-3 font-headline text-lg font-semibold leading-snug text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.summary}</p>

              {item.externalUrl ? (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-xs font-semibold text-secondary hover:underline"
                >
                  Read on {item.sourceLabel} →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
