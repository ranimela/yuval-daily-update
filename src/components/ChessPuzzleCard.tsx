"use client";

import { useState } from "react";
import { ChessBoardSvg } from "@/components/ChessBoardSvg";
import { ChessPawnIcon } from "@/components/SectionIcons";
import type { ChessPuzzle } from "@/lib/bonusData";

export const ChessPuzzleCard = ({ puzzle }: { puzzle: ChessPuzzle }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <section
      id="chess"
      dir="ltr"
      aria-labelledby="chess-heading"
      className="cartoon-card scroll-mt-4"
    >
      <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-purple p-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
            <ChessPawnIcon size={20} />
          </span>
          <h3
            id="chess-heading"
            className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
          >
            CHESS PUZZLE
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
          DAILY
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-ink px-3 py-0.5 text-[13px] font-extrabold uppercase tracking-[1px] text-dose-purple">
            {puzzle.sideToMove} TO MOVE
          </span>
          <span className="inline-flex rounded-full border-2 border-ink bg-white px-2.5 py-0 text-[13px] font-extrabold text-ink">
            {puzzle.title}
          </span>
        </div>

        <ChessBoardSvg fen={puzzle.fen} title={puzzle.title} />

        {showHint ? (
          <div className="cartoon-inner bg-dose-yellow px-3 py-2 text-sm font-extrabold text-ink">
            {puzzle.hintMove
              ? `Try looking at ${puzzle.sideToMove.toLowerCase()} move: ${puzzle.hintMove}`
              : `Look for checks, captures, and forcing moves for ${puzzle.sideToMove.toLowerCase()}.`}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2.5">
          <a
            href={puzzle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cartoon-tab-chip inline-flex min-h-[44px] items-center bg-ink px-4 text-sm font-extrabold text-dose-yellow no-underline hover:opacity-90"
          >
            Solve on Chess.com →
          </a>
          <button
            type="button"
            aria-pressed={showHint}
            onClick={() => setShowHint((prev) => !prev)}
            className="cartoon-tab-chip inline-flex min-h-[44px] items-center bg-white px-4 text-sm font-extrabold text-ink hover:bg-dose-yellow/30"
          >
            {showHint ? "Hide Hint" : "Hint"}
          </button>
        </div>

        <p className="m-0 text-[13px] font-semibold text-ink/80">
          Puzzle source: Chess.com daily puzzle.
        </p>
      </div>
    </section>
  );
};
