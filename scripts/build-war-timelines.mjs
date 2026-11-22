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

function stripHtml(input) {
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
    const clean = stripHtml(text).replace(/^[:–—\-\s]+/, "").trim();
    if (!clean || clean.length < 15) return;
    if (/massacre|holocaust|extermination|gas chamber|atrocity|executed|deported/i.test(clean)) {
      return;
    }
    if (!out[mmdd]) out[mmdd] = [];
    if (out[mmdd].length < 8 && !out[mmdd].some((e) => e.text === clean.slice(0, 220))) {
      out[mmdd].push({ year, text: clean.slice(0, 220) });
    }
  };

  let curYear = defaultYear;
  let curMonth = null;
  const blocks = html.split(/(?=<h[234]|<li|<tr)/i);

  for (const b of blocks) {
    const ym = b.match(/<h[23][^>]*>[\s\S]*?\b(191[4-9]|1939|194[0-5])\b/i);
    if (ym) curYear = Number(ym[1]);

    const hm = b.match(new RegExp(`<h[234][^>]*>[\\s\\S]*?\\b${MONTH_RE}\\b`, "i"));
    if (hm) curMonth = MONTHS[hm[1].toLowerCase()];

    const mdy = b.match(new RegExp(`\\b${MONTH_RE}\\s+(\\d{1,2})\\b([\\s\\S]*)`, "i"));
    if (mdy && curYear) {
      const mm = MONTHS[mdy[1].toLowerCase()];
      const dd = String(mdy[2]).padStart(2, "0");
      const rest = mdy[3].split(/<\/li>|<\/p>|<\/tr>/i)[0];
      add(`${mm}-${dd}`, curYear, rest);
      continue;
    }

    const dmy = b.match(new RegExp(`\\b(\\d{1,2})\\s+${MONTH_RE}\\b([\\s\\S]*)`, "i"));
    if (dmy && curYear) {
      const mm = MONTHS[dmy[2].toLowerCase()];
      const dd = String(dmy[1]).padStart(2, "0");
      const rest = dmy[3].split(/<\/li>|<\/p>|<\/tr>/i)[0];
      add(`${mm}-${dd}`, curYear, rest);
      continue;
    }

    const dayOnly = b.match(/^<li[^>]*>\s*(?:<[^>]+>)*(\d{1,2})\s*[:–—-]\s*([\s\S]*)/i);
    if (dayOnly && curYear && curMonth) {
      const dd = String(dayOnly[1]).padStart(2, "0");
      const rest = dayOnly[2].split(/<\/li>/i)[0];
      add(`${curMonth}-${dd}`, curYear, rest);
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

  console.log("WW1 dates:", Object.keys(ww1).length, "Nov22:", (ww1["11-22"] || []).length);
  console.log("WW2 dates:", Object.keys(ww2).length, "Nov22:", (ww2["11-22"] || []).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
