import type { FeedItem, SourceHealth } from "@/lib/contracts";

interface NewsSectionProps {
  items: FeedItem[];
  health?: SourceHealth;
}

export const NewsSection = ({ items, health }: NewsSectionProps) => {
  const isFailed = health?.status === "failed";

  return (
    <section
      dir="rtl"
      lang="he"
      aria-labelledby="news-heading"
      className="space-y-6 font-hebrew"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            עדכון שוטף · הארץ
          </span>
          <h2 id="news-heading" className="mt-2 font-headline text-3xl font-bold text-gray-900">
            News update · עדכוני חדשות
          </h2>
        </div>
        {health?.lastSuccessAt ? (
          <span dir="ltr" className="font-mono text-xs text-gray-500">
            Updated {new Date(health.lastSuccessAt).toLocaleTimeString("en-GB", {
              timeZone: "Asia/Jerusalem",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : null}
      </div>

      {isFailed ? (
        <div
          role="status"
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          עדכוני החדשות אינם זמינים זמנית (News temporarily unavailable).{" "}
          {items.length > 0 ? "מוצגות הכותרות השמורות האחרונות." : ""}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6 text-sm text-gray-600">
          אין כרגע עדכוני חדשות להצגה.
        </div>
      ) : (
        <ul className="glass-panel divide-y divide-gray-200 overflow-hidden rounded-2xl">
          {items.map((item) => (
            <li
              key={item.id}
              className="px-5 py-4 transition duration-150 hover:bg-surface-muted/80"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-secondary hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <span dir="ltr" className="font-mono text-xs text-gray-500">
                  {new Date(item.publishedAt).toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Jerusalem",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {item.summary && item.summary !== item.title ? (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{item.summary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
