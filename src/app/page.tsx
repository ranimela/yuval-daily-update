import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BonusRoundSection } from "@/components/BonusRoundSection";
import { DailyMissionCard } from "@/components/DailyMissionCard";
import { HistorySection } from "@/components/HistorySection";
import { LogoutButton } from "@/components/LogoutButton";
import { NewsSection } from "@/components/NewsSection";
import { TermSection } from "@/components/TermSection";
import { ThinkSection } from "@/components/ThinkSection";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  getDailyExcuse,
  getDailyTerm,
  getDailyThinkPrompt,
  getDailyUselessFact,
} from "@/lib/dailyCurated";
import { getDbClient } from "@/lib/db/client";
import { loadDailyFeed } from "@/lib/feedService";
import { createCorrelationId } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/login");
  }

  const correlationId = createCorrelationId();
  const sql = getDbClient();
  const feed = await loadDailyFeed(sql, correlationId);

  const historyHealth = feed.health.find((h) => h.category === "history_events");
  const newsHealth = feed.health.find((h) => h.category === "news_update");

  const editionDateObj = new Date(`${feed.editionDate}T12:00:00Z`);
  const weekdayLabel = editionDateObj
    .toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" })
    .toUpperCase();
  const monthDayLabel = editionDateObj
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
    .toUpperCase();

  const dailyTerm = getDailyTerm(feed.editionDate);
  const dailyThink = getDailyThinkPrompt(feed.editionDate);
  const dailyFact = getDailyUselessFact(feed.editionDate);
  const dailyExcuse = getDailyExcuse(feed.editionDate);

  return (
    <div className="bg-sky-dots min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-5 px-4 pb-0 pt-4">
        {/* 1. Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="cartoon-logo -rotate-2 bg-dose-yellow px-[14px] py-[6px]">
            <span className="block font-headline text-[30px] font-normal uppercase leading-none tracking-[1px] text-ink">
              DAILY DOSE
            </span>
            <span className="block text-[13px] font-extrabold leading-tight text-ink">
              for Yuval
            </span>
          </div>
          <LogoutButton />
        </header>

        {/* 2. Daily Mission card */}
        <DailyMissionCard
          editionDate={feed.editionDate}
          weekdayLabel={weekdayLabel}
          monthDayLabel={monthDayLabel}
        />

        {/* 3. Today in History */}
        <HistorySection
          items={feed.historyEvents}
          health={historyHealth}
          editionDate={feed.editionDate}
        />

        {/* 4. News Feed */}
        <NewsSection items={feed.newsUpdates} health={newsHealth} />

        {/* 5. Term of the Day */}
        <TermSection term={dailyTerm} />

        {/* 6. Think About It */}
        <ThinkSection prompt={dailyThink} editionDate={feed.editionDate} />

        {/* 7. Bonus Round */}
        <BonusRoundSection fact={dailyFact} excuse={dailyExcuse} />

        {/* 8. Footer and grass strip */}
        <footer className="px-2 pt-1 text-center text-[13px] font-semibold text-ink">
          History data: Wikimedia On this day (CC BY-SA). News: Haaretz RSS.
        </footer>

        <svg
          viewBox="0 0 360 30"
          className="-mx-4 mt-auto block h-auto w-[calc(100%+32px)]"
          aria-hidden="true"
        >
          <path
            d="M0 14Q15 2 30 14T60 14T90 14T120 14T150 14T180 14T210 14T240 14T270 14T300 14T330 14T360 14V30H0Z"
            fill="#4cc24e"
            stroke="#111"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  );
}
