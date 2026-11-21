import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HistorySection } from "@/components/HistorySection";
import { LogoutButton } from "@/components/LogoutButton";
import { NewsSection } from "@/components/NewsSection";
import { TermSection } from "@/components/TermSection";
import { ThinkSection } from "@/components/ThinkSection";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getDailyTerm, getDailyThinkPrompt } from "@/lib/dailyCurated";
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

  return (
    <div className="min-h-screen bg-sky">
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-5 px-4 pb-8 pt-4">
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

        {/* 2. Section nav */}
        <nav
          aria-label="Sections"
          className="flex flex-wrap gap-2.5 px-0.5 pb-2 pt-0.5"
        >
          <a
            href="#history"
            className="cartoon-nav-chip inline-flex min-h-[44px] flex-none items-center whitespace-nowrap bg-dose-orange px-[18px] text-[15px] font-extrabold text-ink no-underline hover:text-[#333]"
          >
            History
          </a>
          <a
            href="#news"
            className="cartoon-nav-chip inline-flex min-h-[44px] flex-none items-center whitespace-nowrap bg-dose-red px-[18px] text-[15px] font-extrabold text-ink no-underline hover:text-[#333]"
          >
            News
          </a>
          <a
            href="#term"
            className="cartoon-nav-chip inline-flex min-h-[44px] flex-none items-center whitespace-nowrap bg-dose-purple px-[18px] text-[15px] font-extrabold text-ink no-underline hover:text-[#333]"
          >
            Term of the day
          </a>
          <a
            href="#think"
            className="cartoon-nav-chip inline-flex min-h-[44px] flex-none items-center whitespace-nowrap bg-dose-teal px-[18px] text-[15px] font-extrabold text-ink no-underline hover:text-[#333]"
          >
            Think about it
          </a>
        </nav>

        {/* 3. Hero card */}
        <section className="cartoon-card !bg-dose-yellow">
          <div className="px-5 pb-2 pt-5">
            <p className="m-0 font-headline text-[22px] font-normal uppercase leading-none tracking-[2px] text-ink">
              {weekdayLabel}
            </p>
            <h1 className="m-0 mt-1 font-headline text-[76px] font-normal uppercase leading-[0.95] text-ink">
              {monthDayLabel}
            </h1>
            <p className="mb-0 mt-2.5 text-[18px] font-extrabold leading-[1.35] text-ink">
              Good morning, Yuval! Four things to get your brain going.
            </p>
          </div>

          <svg
            viewBox="0 0 358 70"
            className="block h-auto w-full"
            aria-hidden="true"
          >
            <rect x="0" y="52" width="358" height="18" fill="#4cc24e" stroke="#111" strokeWidth="3" />
            <rect x="30" y="26" width="46" height="26" fill="#fff" stroke="#111" strokeWidth="3" />
            <polygon
              points="24,26 53,6 82,26"
              fill="#c1121f"
              stroke="#111"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="48" y="36" width="10" height="16" fill="#ff8a3d" stroke="#111" strokeWidth="2" />
            <rect x="250" y="22" width="56" height="30" fill="#9fd8f0" stroke="#111" strokeWidth="3" />
            <polygon
              points="244,22 278,2 312,22"
              fill="#7b2cbf"
              stroke="#111"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="270" y="34" width="12" height="18" fill="#fff" stroke="#111" strokeWidth="2" />
            <rect x="150" y="30" width="8" height="22" fill="#8d5524" stroke="#111" strokeWidth="2" />
            <circle cx="154" cy="24" r="16" fill="#2a9d3f" stroke="#111" strokeWidth="3" />
          </svg>
        </section>

        {/* 4. Today in History */}
        <HistorySection
          items={feed.historyEvents}
          health={historyHealth}
          editionDate={feed.editionDate}
        />

        {/* 5. News Feed */}
        <NewsSection items={feed.newsUpdates} health={newsHealth} />

        {/* 6. Term of the Day */}
        <TermSection term={dailyTerm} />

        {/* 7. Think About It */}
        <ThinkSection prompt={dailyThink} editionDate={feed.editionDate} />

        {/* 8. Footer */}
        <footer className="px-2 py-1 text-center text-[13px] font-semibold text-ink">
          History data: Wikimedia On this day (CC BY-SA). News: Haaretz RSS.
        </footer>
      </div>
    </div>
  );
}
