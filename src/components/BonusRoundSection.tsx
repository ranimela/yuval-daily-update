import { ChessPuzzleCard } from "@/components/ChessPuzzleCard";
import { FlaskIcon, StarIcon, TempleIcon } from "@/components/SectionIcons";
import type { ChessPuzzle, RomanFact, ScientistEntry } from "@/lib/bonusData";

interface BonusRoundSectionProps {
  fact: string;
  romanFact: RomanFact;
  chessPuzzle: ChessPuzzle;
  scientist: ScientistEntry | null;
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

export const BonusRoundSection = ({
  fact,
  romanFact,
  chessPuzzle,
  scientist,
}: BonusRoundSectionProps) => {
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

      {/* 1. Useless Fact */}
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

      {/* 2. Roman Empire Fact */}
      <section id="roman" dir="ltr" aria-labelledby="roman-heading" className="cartoon-card scroll-mt-4">
        <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-orange p-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
              <TempleIcon size={20} />
            </span>
            <h3
              id="roman-heading"
              className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
            >
              ROMAN EMPIRE FACT
            </h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
            ROME
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <span className="inline-flex self-start rounded-full bg-ink px-3 py-0.5 text-[13px] font-extrabold uppercase tracking-[1px] text-dose-orange">
            ROME FACT
          </span>
          <p className="m-0 text-[20px] font-extrabold leading-[1.3] text-ink">{romanFact.fact}</p>
          <a
            href={romanFact.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cartoon-tab-chip inline-flex min-h-[44px] self-start items-center bg-white px-4 text-sm font-extrabold text-ink no-underline hover:bg-dose-yellow/30"
          >
            Read more on Wikipedia →
          </a>
        </div>
      </section>

      {/* 3. Chess Puzzle */}
      <ChessPuzzleCard puzzle={chessPuzzle} />

      {/* 4. Scientist Born Today (conditional) */}
      {scientist ? (
        <section
          id="scientist"
          dir="ltr"
          aria-labelledby="scientist-heading"
          className="cartoon-card scroll-mt-4"
        >
          <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-teal p-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
                <FlaskIcon size={20} />
              </span>
              <h3
                id="scientist-heading"
                className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
              >
                BORN TODAY
              </h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
              SCIENTIST
            </span>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-dose-bubble-teal font-headline text-2xl text-ink"
              >
                {scientist.initials}
              </span>
              <div className="min-w-0">
                <h4 className="m-0 font-headline text-[22px] font-normal leading-tight text-ink">
                  {scientist.name}
                </h4>
                <p className="m-0 mt-0.5 text-[14px] font-extrabold text-ink/80">
                  {scientist.field} · born {scientist.year}, {scientist.country}
                </p>
              </div>
            </div>

            <p className="m-0 text-[16px] font-extrabold leading-[1.4] text-ink">
              {scientist.blurb}
            </p>

            <a
              href={scientist.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cartoon-tab-chip inline-flex min-h-[44px] self-start items-center bg-white px-4 text-sm font-extrabold text-ink no-underline hover:bg-dose-yellow/30"
            >
              Read more on Wikipedia →
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
};
