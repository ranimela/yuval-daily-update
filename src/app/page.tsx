import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HistorySection } from "@/components/HistorySection";
import { LogoutButton } from "@/components/LogoutButton";
import { NewsSection } from "@/components/NewsSection";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
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

  return (
    <div className="min-h-screen bg-surface-base">
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 sm:px-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/80">
              yuval.melameds.net
            </p>
            <h1 className="mt-1 font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
              Yuval&apos;s Daily Update
            </h1>
          </div>
          <div className="rounded-xl bg-white/95 p-1">
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <HistorySection
            items={feed.historyEvents}
            health={historyHealth}
            editionDate={feed.editionDate}
          />
        </div>
        <div className="lg:col-span-5">
          <NewsSection items={feed.newsUpdates} health={newsHealth} />
        </div>
      </main>
    </div>
  );
}
