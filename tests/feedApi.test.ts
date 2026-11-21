import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as getFeedRoute } from "@/app/api/feed/route";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import type { SqlClient } from "@/lib/db/client";
import { loadDailyFeed } from "@/lib/feedService";
import { middleware } from "@/middleware";

const ORIGINAL_ENV = { ...process.env };

describe("auth middleware & feed API", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret-padding-00000000";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  it("redirects unauthenticated / to /login and returns 401 for /api/feed", async () => {
    const pageReq = new NextRequest("http://localhost:3000/");
    const pageRes = await middleware(pageReq);
    expect(pageRes.status).toBe(307);
    expect(pageRes.headers.get("location")).toContain("/login");

    const apiReq = new NextRequest("http://localhost:3000/api/feed");
    const apiRes = await middleware(apiReq);
    expect(apiRes.status).toBe(401);

    const routeRes = await getFeedRoute(apiReq);
    expect(routeRes.status).toBe(401);
  });

  it("allows authenticated requests through middleware", async () => {
    const token = await createSessionToken(60);
    const req = new NextRequest("http://localhost:3000/api/feed", {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${token}` },
    });
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it("skips external fetches when DB refresh lease is not acquired", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const mockSql = vi.fn(async (strings: TemplateStringsArray) => {
      const q = strings.join("?");
      if (q.includes("FROM feed_items") && q.includes("history_events")) {
        return [
          {
            id: "h1",
            source_id: "wikimedia",
            source_label: "Wikimedia",
            category: "history_events",
            language: "en",
            direction: "ltr",
            title: "Apollo",
            summary: "US Apollo event",
            external_url: "https://en.wikipedia.org/wiki/Apollo",
            year: 1969,
            published_at: "2026-11-21T05:00:00Z",
            ingested_at: "2026-11-21T05:00:00Z",
            edition_date: "2026-11-21",
          },
        ];
      }
      if (q.includes("FROM feed_items")) {
        return [];
      }
      if (q.includes("INSERT INTO source_health")) {
        return []; // lease NOT acquired
      }
      return [];
    }) as unknown as SqlClient;

    const feed = await loadDailyFeed(mockSql, "test-corr");
    expect(feed.historyEvents).toHaveLength(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
