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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-purple px-4 py-3">
        <h2
          id="term-heading"
          className="font-headline text-[28px] font-normal uppercase leading-none tracking-[1px] text-ink"
        >
          TERM OF THE DAY
        </h2>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
          {term.category}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <h3 className="m-0 font-headline text-[52px] font-normal leading-none text-ink">
          {term.term}
        </h3>
        <p className="m-0 text-[18px] font-semibold leading-[1.45] text-ink">{term.definition}</p>

        <div className="cartoon-inner bg-dose-yellow p-3">
          <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wide text-ink">Example</p>
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
