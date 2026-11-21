import { describe, expect, it } from "vitest";
import { decodeHtmlEntities, sanitizeHttpUrl, sanitizePlainText } from "@/lib/sanitize";

describe("sanitize utilities", () => {
  it("strips HTML tags and scripts and decodes entities", () => {
    const raw =
      '<p>Hello &quot;World&quot; &#39;Test&#39; &nbsp;<b>Bold</b><script>alert(1)</script></p>';
    expect(sanitizePlainText(raw, 200)).toBe('Hello "World" \'Test\' Bold');
  });

  it("decodes numeric decimal and hex HTML entities", () => {
    expect(decodeHtmlEntities("&#8220;Quote&#8221; &#x2014; Dash")).toBe(
      "\u201CQuote\u201D \u2014 Dash"
    );
  });

  it("truncates long strings with ellipsis", () => {
    expect(sanitizePlainText("abcdefghij", 6)).toBe("abcde…");
  });

  it("allows only http and https URLs", () => {
    expect(sanitizeHttpUrl("https://en.wikipedia.org/wiki/Israel")).toBe(
      "https://en.wikipedia.org/wiki/Israel"
    );
    expect(sanitizeHttpUrl("http://example.com/a")).toBe("http://example.com/a");
    expect(sanitizeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeHttpUrl("data:text/html,<script>1</script>")).toBeNull();
    expect(sanitizeHttpUrl("not a url")).toBeNull();
  });
});
