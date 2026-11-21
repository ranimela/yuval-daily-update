import { afterEach, describe, expect, it, vi } from "vitest";
import type { SqlClient } from "@/lib/db/client";
import { ingestHistoryEvents } from "@/lib/ingestion/history";
import { isWesternHistory } from "@/lib/ingestion/westernFilter";

function createMockSql() {
  const queries: string[] = [];
  const fn = vi.fn(async (strings: TemplateStringsArray) => {
    queries.push(strings.join("?"));
    return [];
  });
  return { sql: fn as unknown as SqlClient, queries };
}

describe("western history filter & ingestion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("matches Europe, US, and Israel events and excludes unrelated regions", () => {
    expect(isWesternHistory("The State of Israel declares independence in Tel Aviv.")).toBe(true);
    expect(isWesternHistory("United States Apollo 11 lands on the Moon.")).toBe(true);
    expect(isWesternHistory("Treaty signed in Paris, France.")).toBe(true);
    expect(isWesternHistory("Ming dynasty emperor ascends the throne in Beijing.")).toBe(false);
  });

  it("handles partial source failure via Promise.allSettled and caps at 10 items", async () => {
    const wikiEvents = Array.from({ length: 12 }, (_, idx) => ({
      year: 1900 + idx,
      text: `United States Congress passes historic act #${idx} in Washington.`,
      pages: [
        {
          title: `US_Act_${idx}`,
          content_urls: { desktop: { page: `https://en.wikipedia.org/wiki/US_Act_${idx}` } },
        },
      ],
    }));

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("wikipedia.org")) {
        return new Response(JSON.stringify({ selected: wikiEvents }), { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    });

    const { sql, queries } = createMockSql();
    const result = await ingestHistoryEvents(sql, {
      correlationId: "test-corr-1",
      limit: 10,
      now: new Date("2026-11-21T05:00:00Z"),
    });

    expect(result.itemsWritten).toBe(10);
    expect(result.status).toBe("degraded");
    expect(queries.some((q) => q.includes("DELETE FROM feed_items"))).toBe(true);
  });

  it("returns failed status when both history sources fail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Error", { status: 500 }));
    const { sql } = createMockSql();
    const result = await ingestHistoryEvents(sql, { correlationId: "test-corr-2" });
    expect(result.itemsWritten).toBe(0);
    expect(result.status).toBe("failed");
  });
});
