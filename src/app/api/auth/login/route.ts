import { NextResponse, type NextRequest } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { getDbClient } from "@/lib/db/client";
import {
  clearLoginAttempts,
  getLoginLockStatus,
  recordLoginFailure,
} from "@/lib/db/repository";
import { createCorrelationId, logEvent } from "@/lib/logger";

function getClientIpKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim().slice(0, 64) || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim().slice(0, 64) || "local";
}

export async function POST(request: NextRequest) {
  const correlationId = createCorrelationId();
  const ipKey = getClientIpKey(request);

  try {
    const sql = getDbClient();
    const lockStatus = await getLoginLockStatus(sql, ipKey);
    if (!lockStatus.allowed) {
      logEvent("warn", "Login blocked due to rate limit", { correlationId, module: "auth/login" });
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${Math.ceil(
            lockStatus.retryAfterSeconds / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
    const candidate = typeof body?.password === "string" ? body.password : "";

    if (!verifyPassword(candidate)) {
      const failure = await recordLoginFailure(sql, ipKey);
      logEvent("warn", "Failed login attempt", { correlationId, module: "auth/login" });
      return NextResponse.json(
        {
          error: failure.allowed
            ? "Invalid password."
            : `Too many failed attempts. Try again in ${Math.ceil(
                failure.retryAfterSeconds / 60
              )} minutes.`,
        },
        { status: failure.allowed ? 401 : 429 }
      );
    }

    await clearLoginAttempts(sql, ipKey);
    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    logEvent("info", "Successful login", { correlationId, module: "auth/login" });
    return response;
  } catch (err) {
    logEvent("error", "Login endpoint error", { correlationId, module: "auth/login" }, err);
    return NextResponse.json({ error: "Authentication service error." }, { status: 500 });
  }
}
