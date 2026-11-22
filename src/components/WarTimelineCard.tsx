import { ClockIcon, CompassIcon } from "@/components/SectionIcons";
import type { WarTimelineEntry } from "@/lib/warTimelines";

interface WarTimelineCardProps {
  variant: "ww1" | "ww2";
  entries: WarTimelineEntry[];
  editionDate: string;
}

export const WarTimelineCard = ({ variant, entries, editionDate }: WarTimelineCardProps) => {
  if (entries.length === 0) {
    return null;
  }

  const shortDate = new Date(`${editionDate}T00:00:00Z`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .toUpperCase();

  const isWw1 = variant === "ww1";
  const id = isWw1 ? "ww1" : "ww2";
  const headingId = isWw1 ? "ww1-heading" : "ww2-heading";
  const title = isWw1 ? "TODAY IN WWI" : "TODAY IN WWII";
  const headerBg = isWw1 ? "bg-dose-cream" : "bg-dose-mint";
  const yearShadow = isWw1 ? "shadow-year" : "shadow-ww2";
  const footnote = isWw1
    ? "Source: Wikipedia, Timeline of World War I (CC BY-SA). This card is hidden on days with no entry."
    : "Source: Wikipedia, Timeline of World War II, yearly pages 1939 to 1945 (CC BY-SA). This card is hidden on days with no entry.";

  return (
    <section id={id} dir="ltr" aria-labelledby={headingId} className="cartoon-card scroll-mt-4">
      <div
        className={`bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink p-3 ${headerBg}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
            {isWw1 ? <ClockIcon size={20} /> : <CompassIcon size={20} />}
          </span>
          <h2
            id={headingId}
            className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
          >
            {title}
          </h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-dose-yellow">
          {shortDate}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <ul className="flex flex-col gap-3.5">
          {entries.map((entry, idx) => (
            <li key={`${entry.year}-${idx}`} className="flex flex-col gap-3.5">
              {idx > 0 ? <hr className="h-0 border-0 border-t-[3px] border-dashed border-ink" /> : null}
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex min-w-[68px] shrink-0 -rotate-2 items-center justify-center rounded-[12px] bg-ink px-2.5 py-1 font-headline text-[22px] leading-none text-dose-yellow ${yearShadow}`}
                >
                  {entry.year}
                </span>
                <p className="m-0 min-w-0 flex-1 break-words text-[16px] font-semibold leading-[1.45] text-ink">
                  {entry.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="m-0 border-t-2 border-ink/15 pt-2 text-[13px] font-semibold text-ink/80">
          {footnote}
        </p>
      </div>
    </section>
  );
};
