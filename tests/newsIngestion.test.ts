import { afterEach, describe, expect, it, vi } from "vitest";
import type { SqlClient } from "@/lib/db/client";
import { ingestNewsUpdates, parseRssItems } from "@/lib/ingestion/news";

function createMockSql() {
  const queries: string[] = [];
  const fn = vi.fn(async (strings: TemplateStringsArray) => {
    queries.push(strings.join("?"));
    return [];
  });
  return { sql: fn as unknown as SqlClient, queries };
}

describe("news RSS parser & ingestion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses CDATA, strips HTML, decodes entities, and caps at 15 items", () => {
    const itemsXml = Array.from({ length: 18 }, (_, i) => `
      <item>
        <title><![CDATA[כותרת חדשות ${i} &quot;חשוב&quot;]]></title>
        <description><![CDATA[<img src="x.jpg"/><p>תקציר <b>כתבה</b> מספר ${i}</p>]]></description>
        <link>https://www.haaretz.co.il/news/${i}</link>
        <pubDate>Sat, 21 Nov 2026 06:00:00 GMT</pubDate>
      </item>
    `).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?><rss><channel>${itemsXml}</channel></rss>`;

    const parsed = parseRssItems(xml, 15);
    expect(parsed).toHaveLength(15);
    expect(parsed[0].title).toBe('כותרת חדשות 0 "חשוב"');
    expect(parsed[0].summary).toBe("תקציר כתבה מספר 0");
    expect(parsed[0].externalUrl).toBe("https://www.haaretz.co.il/news/0");
  });

  it("records failed status on 403 without deleting cached feed_items", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("Blocked", { status: 403 }));
    const { sql, queries } = createMockSql();

    const result = await ingestNewsUpdates(sql, { correlationId: "test-news-1" });
    expect(result.itemsWritten).toBe(0);
    expect(result.status).toBe("failed");
    expect(queries.some((q) => q.includes("DELETE FROM feed_items"))).toBe(false);
    expect(queries.some((q) => q.includes("INSERT INTO source_health"))).toBe(true);
  });
});
