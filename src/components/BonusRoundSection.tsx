import { AlarmClockIcon, StarIcon } from "@/components/SectionIcons";
import type { DailyExcuse } from "@/lib/dailyCurated";

interface BonusRoundSectionProps {
  fact: string;
  excuse: DailyExcuse;
}

const FourPointStar = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#ffd23f"
    stroke="#111111"
    strokeWidth="2"
    strokeLinejoin="round"
  >
    <path d="M12 1L15 9L23 12L15 15L12 23L9 15L1 12L9 9Z" />
  </svg>
);

export const BonusRoundSection = ({ fact, excuse }: BonusRoundSectionProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Banner */}
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <FourPointStar />
          <h2 className="m-0 font-headline text-[30px] font-normal uppercase tracking-[2px] text-ink [text-shadow:3px_3px_0_#fff]">
            BONUS ROUND
          </h2>
          <FourPointStar />
        </div>
        <p className="m-0 text-[14px] font-extrabold text-ink">
          Just for fun. Not part of today&apos;s mission.
        </p>
      </div>

      {/* Useless Fact */}
      <section id="fact" dir="ltr" aria-labelledby="fact-heading" className="cartoon-card scroll-mt-4">
        <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-yellow p-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
              <StarIcon size={20} />
            </span>
            <h3
              id="fact-heading"
              className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
            >
              USELESS FACT
            </h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
            BONUS
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <span className="inline-flex self-start rounded-full bg-ink px-3 py-0.5 text-[13px] font-extrabold uppercase tracking-[1px] text-dose-yellow">
            DID YOU KNOW?
          </span>
          <p className="m-0 text-[20px] font-extrabold leading-[1.3] text-ink">{fact}</p>
        </div>
      </section>

      {/* Excuse of the Day */}
      <section
        id="excuse"
        dir="ltr"
        aria-labelledby="excuse-heading"
        className="cartoon-card scroll-mt-4"
      >
        <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-pink p-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
              <AlarmClockIcon size={20} />
            </span>
            <h3
              id="excuse-heading"
              className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
            >
              EXCUSE OF THE DAY
            </h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
            SILLY
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-ink px-3 py-0.5 text-[13px] font-extrabold uppercase tracking-[1px] text-dose-pink">
              EXCUSE
            </span>
            <span className="inline-flex rounded-full border-2 border-ink bg-white px-2.5 py-0 text-[13px] font-extrabold text-ink">
              {excuse.category}
            </span>
          </div>

          <div className="cartoon-inner bg-dose-pink-tint p-3">
            <p className="m-0 text-[18px] font-extrabold leading-[1.3] text-ink">{excuse.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
