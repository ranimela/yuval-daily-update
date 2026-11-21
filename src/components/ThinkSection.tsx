"use client";

import { useEffect, useState } from "react";
import { SpeechBubbleIcon } from "@/components/SectionIcons";
import type { DailyThinkPrompt } from "@/lib/dailyCurated";

interface ThinkSectionProps {
  prompt: DailyThinkPrompt;
  editionDate: string;
}

export const ThinkSection = ({ prompt, editionDate }: ThinkSectionProps) => {
  const storageKey = `daily-dose-take:${editionDate}`;
  const [take, setTake] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setTake(saved);
      }
    } catch {
      // Ignore storage access errors in private browsing
    }
  }, [storageKey]);

  const handleChange = (value: string) => {
    setTake(value);
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Ignore storage quota errors
    }
  };

  return (
    <section
      id="think"
      dir="ltr"
      aria-labelledby="think-heading"
      className="cartoon-card scroll-mt-4"
    >
      <div className="bg-halftone flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-dose-teal p-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white">
            <SpeechBubbleIcon size={20} />
          </span>
          <h2
            id="think-heading"
            className="m-0 font-headline text-[25px] font-normal uppercase leading-none tracking-[1px] text-ink"
          >
            THINK ABOUT IT
          </h2>
        </div>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-0.5 text-[14px] font-extrabold uppercase text-white">
          PHILOSOPHY
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        <h3 className="m-0 font-headline text-[36px] font-normal leading-[1.05] text-ink">
          {prompt.title}
        </h3>

        <div className="relative mb-2 rounded-[20px] border-[3px] border-ink bg-dose-bubble-teal px-4 py-3.5">
          <p className="m-0 text-[18px] font-semibold leading-[1.45] text-ink">
            {prompt.question}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-[11px] left-[30px] h-[18px] w-[18px] rotate-45 border-b-[3px] border-r-[3px] border-ink bg-dose-bubble-teal"
          />
        </div>

        <div className="cartoon-inner bg-dose-yellow p-3">
          <p className="mb-1 text-[13px] font-extrabold uppercase tracking-wide text-ink">
            Two ways to see it
          </p>
          <ul className="space-y-1 text-[16px] font-bold text-ink">
            {prompt.twoWays.map((way) => (
              <li key={way}>• {way}</li>
            ))}
          </ul>
        </div>

        <div>
          <label htmlFor="take" className="block text-[15px] font-extrabold text-ink">
            What is your take?
          </label>
          <textarea
            id="take"
            rows={3}
            value={take}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write your answer here"
            className="mt-1.5 box-border w-full resize-none rounded-[14px] border-[3px] border-ink bg-white p-3 text-[16px] font-semibold text-ink placeholder:text-ink/45 focus:outline-none focus:ring-4 focus:ring-dose-teal/50"
          />
        </div>

        <a
          href={prompt.deeperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center text-sm font-extrabold text-ink underline decoration-2 underline-offset-4 hover:text-[#333]"
        >
          Go deeper ({prompt.deeperLabel}) →
        </a>
      </div>
    </section>
  );
};
