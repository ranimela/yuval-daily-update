import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getDbClient } from "@/lib/db/client";
import { loadDailyFeed } from "@/lib/feedService";
import { createCorrelationId, logEvent } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const correlationId = createCorrelationId();
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDbClient();
    const feed = await loadDailyFeed(sql, correlationId);
    return NextResponse.json(feed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    logEvent("error", "Feed API error", { correlationId, module: "api/feed" }, err);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
