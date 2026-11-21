import { NextResponse, type NextRequest } from "next/server";
import { verifyCronAuthorization } from "@/lib/auth";
import { getDbClient } from "@/lib/db/client";
import { ingestHistoryEvents } from "@/lib/ingestion/history";
import { createCorrelationId, logEvent } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const correlationId = createCorrelationId();
  if (!verifyCronAuthorization(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDbClient();
    const result = await ingestHistoryEvents(sql, {
      correlationId,
      timeoutMs: 8000,
      limit: 10,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    logEvent("error", "History cron failed", { correlationId, module: "cron/history" }, err);
    return NextResponse.json({ error: "History cron failed" }, { status: 500 });
  }
}
