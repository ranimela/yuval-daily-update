import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import type { FeedItem } from "@/lib/contracts";
import { getJerusalemDateParts } from "@/lib/ingestion/history";
import { getWesternHistoryPriority } from "@/lib/ingestion/westernFilter";
import { createCorrelationId, logEvent } from "@/lib/logger";
import { sanitizeHttpUrl, sanitizePlainText, sha256Hex } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const correlationId = createCorrelationId();
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const typeParam = request.nextUrl.searchParams.get("type");
  if (typeParam !== "births" && typeParam !== "deaths") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const { editionDate, month, day } = getJerusalemDateParts();
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/${typeParam}/${month}/${day}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)",
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Wikimedia ${typeParam} HTTP ${res.status}`);
    }

    const data = (await res.json()) as Record<
      string,
      Array<{
        text?: unknown;
        year?: unknown;
        pages?: Array<{
          title?: unknown;
          content_urls?: { desktop?: { page?: unknown } };
        }>;
      }>
    >;

    const entries = Array.isArray(data?.[typeParam]) ? data[typeParam] : [];
    const scored: Array<{ item: FeedItem; priority: number }> = [];
    const nowIso = new Date().toISOString();

    for (const entry of entries) {
      const rawText = typeof entry.text === "string" ? entry.text : "";
      const summary = sanitizePlainText(rawText, 500);
      if (!summary) {
        continue;
      }
      const year = typeof entry.year === "number" && Number.isFinite(entry.year) ? entry.year : null;
      const priority = getWesternHistoryPriority(summary, year);
      if (priority === 0) {
        continue;
      }
      const firstPage = Array.isArray(entry.pages) ? entry.pages[0] : undefined;
      const pageTitle =
        typeof firstPage?.title === "string"
          ? sanitizePlainText(firstPage.title.replace(/_/g, " "), 240)
          : sanitizePlainText(summary, 120);
      const externalUrl = sanitizeHttpUrl(
        typeof firstPage?.content_urls?.desktop?.page === "string"
          ? firstPage.content_urls.desktop.page
          : null
      );

      const id = await sha256Hex(`wikimedia:${typeParam}:${editionDate}:${year ?? "na"}:${summary.slice(0, 60)}`);
      scored.push({
        priority,
        item: {
          id,
          sourceId: "wikimedia",
          sourceLabel: "Wikimedia",
          category: "history_events",
          language: "en",
          direction: "ltr",
          title: pageTitle,
          summary,
          externalUrl,
          year,
          publishedAt: nowIso,
          ingestedAt: nowIso,
          editionDate,
        },
      });
    }

    scored.sort((a, b) => b.priority - a.priority);
    return NextResponse.json({ items: scored.slice(0, 10).map((s) => s.item) });
  } catch (err) {
    logEvent(
      "warn",
      `Failed loading ${typeParam} history`,
      { correlationId, module: "api/history" },
      err
    );
    return NextResponse.json({ error: `Could not load ${typeParam}.` }, { status: 502 });
  }
}
