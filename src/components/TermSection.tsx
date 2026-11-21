import { LightbulbIcon } from "@/components/SectionIcons";
import type { DailyTerm } from "@/lib/dailyCurated";

interface TermSectionProps {
  term: DailyTerm;
}

export const TermSection = ({ term }: TermSectionProps) => {
  return (
    <section
      id="term"
      dir="ltr"
      aria-labelledby="term-heading"
      className="cartoon-card scroll-mt-4"
    >
      <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-purple p-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
            <LightbulbIcon size={20} />
          </span>
          <h2
            id="term-heading"
            className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
          >
            TERM OF THE DAY
          </h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
          {term.category}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <div className="cartoon-sticker -rotate-[1.5deg] self-start bg-dose-purple px-[18px] py-1">
          <h3 className="m-0 font-headline text-[48px] font-normal leading-[1.1] text-ink">
            {term.term}
          </h3>
        </div>

        <p className="m-0 text-[18px] font-semibold leading-[1.45] text-ink">{term.definition}</p>

        <div className="cartoon-inner bg-dose-yellow p-3">
          <span className="mb-2 inline-block rounded-full bg-ink px-3 py-0 text-[13px] font-extrabold uppercase tracking-[1px] text-dose-yellow">
            Example
          </span>
          <p className="m-0 text-[16px] font-bold leading-snug text-ink">{term.example}</p>
        </div>

        <p className="m-0 text-[16px] font-semibold text-ink">
          <strong className="font-extrabold">Why it matters:</strong> {term.whyItMatters}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <a
            href={term.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center text-sm font-extrabold text-ink underline decoration-2 underline-offset-4 hover:text-[#333]"
          >
            Learn more on Wikipedia →
          </a>
          <p className="m-0 text-[13px] font-semibold text-ink/80">
            The term rotates between Math, Statistics and Technology.
          </p>
        </div>
      </div>
    </section>
  );
};
