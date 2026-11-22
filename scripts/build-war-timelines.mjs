import fs from "node:fs";
import path from "node:path";

const MONTHS = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

const MONTH_RE =
  "(January|February|March|April|May|June|July|August|September|October|November|December)";

function stripHtmlLine(input) {
  return input
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#91;.*?&#93;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWikiHtml(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
    title
  )}&prop=text&format=json&redirects=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)" },
  });
  const json = await res.json();
  return json.parse?.text?.["*"] ?? "";
}

function extractEntries(html, defaultYear) {
  const out = {};
  const add = (mmdd, year, text) => {
    const clean = text.replace(/^[:–—\-\s]+/, "").trim();
    if (!clean || clean.length < 15) return;
    if (/massacre|holocaust|extermination|gas chamber|atrocity|executed|deported/i.test(clean)) {
      return;
    }
    if (!out[mmdd]) out[mmdd] = [];
    if (out[mmdd].length < 8 && !out[mmdd].some((e) => e.text === clean.slice(0, 220))) {
      out[mmdd].push({ year, text: clean.slice(0, 220) });
    }
  };

  const prepared = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\r?\n/g, " ")
    .replace(/<(h[234]|li|dd|tr|p)[^>]*>/gi, "\n<$1>")
    .replace(/<\/td>\s*<td[^>]*>/gi, " ")
    .replace(/<\/ul>/gi, "\n[END_DATE]\n");

  const lines = prepared.split(/\r?\n/);
  let curYear = defaultYear;
  let curMonth = null;
  let activeMmDd = null;

  for (const rawLine of lines) {
    if (rawLine.includes("[END_DATE]")) {
      activeMmDd = null;
      continue;
    }

    const isHeading = /^<h[234]>/i.test(rawLine);
    const line = stripHtmlLine(rawLine);
    if (!line) continue;

    if (isHeading) {
      activeMmDd = null;
      const ym = line.match(/\b(191[4-9]|1939|194[0-5])\b/);
      if (ym) curYear = Number(ym[1]);
      const hm = line.match(new RegExp(`\\b${MONTH_RE}\\b`, "i"));
      if (hm) curMonth = MONTHS[hm[1].toLowerCase()];
      continue;
    }

    // Match "November 22" or "1918 November 22" or "November 22, 1918: event..."
    const mdy = line.match(
      new RegExp(`^(?:(191[4-9]|1939|194[0-5])\\s+)?${MONTH_RE}\\s+(\\d{1,2})(?:,\\s*(191[4-9]|1939|194[0-5]))?\\b(.*)$`, "i")
    );
    if (mdy && (mdy[1] || mdy[4] || curYear)) {
      const year = Number(mdy[1] || mdy[4] || curYear);
      const mm = MONTHS[mdy[2].toLowerCase()];
      const dd = String(mdy[3]).padStart(2, "0");
      activeMmDd = `${mm}-${dd}`;
      if (mdy[5].trim()) add(activeMmDd, year, mdy[5]);
      continue;
    }

    // Match "22 November" or "1918 22 November"
    const dmy = line.match(
      new RegExp(`^(?:(191[4-9]|1939|194[0-5])\\s+)?(\\d{1,2})\\s+${MONTH_RE}(?:\\s+(191[4-9]|1939|194[0-5]))?\\b(.*)$`, "i")
    );
    if (dmy && (dmy[1] || dmy[4] || curYear)) {
      const year = Number(dmy[1] || dmy[4] || curYear);
      const mm = MONTHS[dmy[3].toLowerCase()];
      const dd = String(dmy[2]).padStart(2, "0");
      activeMmDd = `${mm}-${dd}`;
      if (dmy[5].trim()) add(activeMmDd, year, dmy[5]);
      continue;
    }

    // Match "22: event..." inside a month section
    const dayColon = line.match(/^(\d{1,2})\s*[:–—-]\s*(.+)$/);
    if (dayColon && curYear && curMonth) {
      const ddNum = Number(dayColon[1]);
      if (ddNum >= 1 && ddNum <= 31) {
        const dd = String(ddNum).padStart(2, "0");
        activeMmDd = `${curMonth}-${dd}`;
        add(activeMmDd, curYear, dayColon[2]);
        continue;
      }
    }

    // Nested <li> under an active date heading (e.g., <li>22 November<ul><li>...</li></ul></li>)
    if (activeMmDd && curYear && /^<li>/i.test(rawLine)) {
      add(activeMmDd, curYear, line);
    }
  }
  return out;
}

async function main() {
  const dataDir = path.join(process.cwd(), "src", "data");
  fs.mkdirSync(dataDir, { recursive: true });

  const ww1Html = await fetchWikiHtml("Timeline_of_World_War_I");
  const ww1 = extractEntries(ww1Html, 1914);
  fs.writeFileSync(path.join(dataDir, "ww1-by-date.json"), JSON.stringify(ww1, null, 2));

  const ww2 = {};
  for (const y of [1939, 1940, 1941, 1942, 1943, 1944, 1945]) {
    const html = await fetchWikiHtml(`Timeline_of_World_War_II_(${y})`);
    const parsed = extractEntries(html, y);
    for (const [k, list] of Object.entries(parsed)) {
      if (!ww2[k]) ww2[k] = [];
      ww2[k].push(...list);
    }
  }
  fs.writeFileSync(path.join(dataDir, "ww2-by-date.json"), JSON.stringify(ww2, null, 2));

  console.log("WW1 dates:", Object.keys(ww1).length, "Nov22:", JSON.stringify(ww1["11-22"] || []));
  console.log("WW2 dates:", Object.keys(ww2).length, "Nov22:", JSON.stringify(ww2["11-22"] || []));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
