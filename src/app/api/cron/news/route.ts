import { NextResponse, type NextRequest } from "next/server";
import { verifyCronAuthorization } from "@/lib/auth";
import { getDbClient } from "@/lib/db/client";
import { ingestNewsUpdates } from "@/lib/ingestion/news";
import { createCorrelationId, logEvent } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const correlationId = createCorrelationId();
  if (!verifyCronAuthorization(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDbClient();
    const result = await ingestNewsUpdates(sql, {
      correlationId,
      timeoutMs: 8000,
      limit: 15,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    logEvent("error", "News cron failed", { correlationId, module: "cron/news" }, err);
    return NextResponse.json({ error: "News cron failed" }, { status: 500 });
  }
}
