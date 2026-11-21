"use client";

import { useEffect, useState } from "react";
import {
  HourglassIcon,
  LightbulbIcon,
  NewspaperIcon,
  SpeechBubbleIcon,
} from "@/components/SectionIcons";

interface DailyMissionCardProps {
  editionDate: string;
  weekdayLabel: string;
  monthDayLabel: string;
}

type QuestId = "history" | "news" | "term" | "think";

const QUESTS: Array<{
  id: QuestId;
  label: string;
  bgClass: string;
  href: string;
  icon: React.ReactNode;
}> = [
  {
    id: "history",
    label: "History",
    bgClass: "bg-dose-orange",
    href: "#history",
    icon: <HourglassIcon size={18} />,
  },
  {
    id: "news",
    label: "News",
    bgClass: "bg-dose-red",
    href: "#news",
    icon: <NewspaperIcon size={18} />,
  },
  {
    id: "term",
    label: "Term of the day",
    bgClass: "bg-dose-purple",
    href: "#term",
    icon: <LightbulbIcon size={18} />,
  },
  {
    id: "think",
    label: "Think about it",
    bgClass: "bg-dose-teal",
    href: "#think",
    icon: <SpeechBubbleIcon size={18} />,
  },
];

export const DailyMissionCard = ({
  editionDate,
  weekdayLabel,
  monthDayLabel,
}: DailyMissionCardProps) => {
  const storageKey = `daily-dose-mission:${editionDate}`;
  const [completed, setCompleted] = useState<Record<QuestId, boolean>>({
    history: false,
    news: false,
    term: false,
    think: false,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Record<QuestId, boolean>>;
        setCompleted({
          history: Boolean(parsed.history),
          news: Boolean(parsed.news),
          term: Boolean(parsed.term),
          think: Boolean(parsed.think),
        });
      }
    } catch {
      // Ignore storage read errors
    }
  }, [storageKey]);

  const markQuestDone = (id: QuestId, toggle = false) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: toggle ? !prev[id] : true };
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const streakDays = doneCount > 0 ? 1 : 0;

  return (
    <section className="cartoon-mission-card bg-mission-grid relative flex flex-col gap-3.5 px-4 pb-4 pt-[18px] text-white">
      {/* Decorative Sparkles */}
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        className="pointer-events-none absolute right-3 top-[62px]"
        aria-hidden="true"
      >
        <path d="M35 4L41 29L66 35L41 41L35 66L29 41L4 35L29 29Z" fill="#ffd23f" />
        <path
          d="M14 2L16 10L24 12L16 14L14 22L12 14L4 12L12 10Z"
          fill="#fff"
          transform="translate(0 -2)"
        />
        <path d="M58 50L60 56L66 58L60 60L58 66L56 60L50 58L56 56Z" fill="#3ddbc0" />
      </svg>

      {/* Top row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-dose-teal px-3 py-0.5 text-[13px] font-extrabold uppercase tracking-[2px] text-ink">
          DAILY MISSION
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-dose-yellow py-0.5 pl-2 pr-3 text-[13px] font-extrabold text-ink">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#ff8a3d"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinejoin="round"
          >
            <path d="M12 2c1 4-3 5-3 9a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 3-2 3 1-3 0-6-3-8z" />
          </svg>
          {streakDays}-day streak
        </span>
      </div>

      {/* Date block */}
      <div className="relative z-10">
        <p className="m-0 font-headline text-[22px] font-normal uppercase leading-none tracking-[3px] text-dose-teal">
          {weekdayLabel}
        </p>
        <h1 className="m-0 mt-1 font-headline text-[84px] font-normal uppercase leading-[0.95] text-dose-yellow [text-shadow:4px_4px_0_#ff595e]">
          {monthDayLabel}
        </h1>
      </div>

      {/* Greeting */}
      <p className="relative z-10 m-0 text-[18px] font-extrabold leading-[1.35] text-white">
        Good morning, Yuval! Four things to get your brain going.
      </p>

      {/* Quest tiles */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {QUESTS.map((quest) => {
          const isDone = completed[quest.id];
          return (
            <div
              key={quest.id}
              className={`relative flex min-h-[92px] flex-col justify-between gap-2 rounded-[14px] border-[3px] border-ink p-2.5 text-ink shadow-tile ${quest.bgClass}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-ink bg-white">
                  {quest.icon}
                </span>
                <button
                  type="button"
                  aria-pressed={isDone}
                  aria-label={`Mark ${quest.label} as ${isDone ? "not done" : "done"}`}
                  onClick={() => markQuestDone(quest.id, true)}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-ink transition ${
                    isDone ? "bg-ink text-dose-yellow" : "bg-white text-transparent"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>

              <a
                href={quest.href}
                onClick={() => markQuestDone(quest.id, false)}
                className="text-[16px] font-extrabold leading-[1.2] text-ink no-underline hover:underline"
              >
                {quest.label}
              </a>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <p className="m-0 text-[13px] font-extrabold text-white">{doneCount} of 4 done</p>
        <div className="flex gap-1.5" aria-hidden="true">
          {QUESTS.map((quest, idx) => (
            <span
              key={quest.id}
              className={`h-3 flex-1 rounded-[6px] border-2 border-white transition ${
                idx < doneCount ? "bg-dose-yellow" : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
