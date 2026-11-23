import romanFacts from "@/data/roman-facts.json";
import scientistsByDate from "@/data/scientists.json";
import { getDailyUselessFact, getDayIndex } from "@/lib/dailyCurated";
import { sanitizeHttpUrl, sanitizePlainText } from "@/lib/sanitize";

export interface RomanFact {
  fact: string;
  wikipediaUrl: string;
}

export interface ChessPuzzle {
  title: string;
  url: string;
  fen: string;
  sideToMove: "WHITE" | "BLACK";
  hintMove: string | null;
}

export interface ScientistEntry {
  name: string;
  initials: string;
  field: string;
  year: number;
  country: string;
  blurb: string;
  wikipediaUrl: string;
}

const UNSAFE_FACT_WORDS = [
  "sex",
  "porn",
  "nude",
  "alcohol",
  "beer",
  "vodka",
  "drug",
  "cocaine",
  "murder",
  "suicide",
  "kill",
];

function isKidAppropriate(text: string): boolean {
  const lower = text.toLowerCase();
  return !UNSAFE_FACT_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(lower));
}

export function getDailyRomanFact(editionDate: string): RomanFact {
  const list = romanFacts as RomanFact[];
  return list[getDayIndex(editionDate) % list.length];
}

export function getScientistBornToday(editionDate: string): ScientistEntry | null {
  const mmdd = editionDate.slice(5, 10);
  const map = scientistsByDate as Record<string, ScientistEntry | undefined>;
  return map[mmdd] ?? null;
}

export async function fetchDailyUselessFact(editionDate: string): Promise<string> {
  try {
    const res = await fetch(
      `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en&edition=${editionDate}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) {
      return getDailyUselessFact(editionDate);
    }
    const data = (await res.json()) as { text?: unknown };
    const clean = typeof data.text === "string" ? sanitizePlainText(data.text, 280) : "";
    if (!clean || !isKidAppropriate(clean)) {
      return getDailyUselessFact(editionDate);
    }
    return clean;
  } catch {
    return getDailyUselessFact(editionDate);
  }
}

function extractFirstMoveFromPgn(pgn: string): string | null {
  const withoutHeaders = pgn.replace(/\[[^\]]*\]/g, " ");
  const match = withoutHeaders.match(/\b1\.\s*(?:\.\.\.\s*)?([A-Za-z0-9+#=-]+)/);
  return match ? match[1] : null;
}

export async function fetchDailyChessPuzzle(): Promise<ChessPuzzle> {
  const fallback: ChessPuzzle = {
    title: "Scholar's Mate Setup",
    url: "https://www.chess.com/daily-chess-puzzle",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    sideToMove: "WHITE",
    hintMove: "Qxf7#",
  };

  try {
    const res = await fetch("https://api.chess.com/pub/puzzle", {
      headers: {
        Accept: "application/json",
        "User-Agent": "YuvalDailyUpdate/1.0 (https://yuval.melameds.net)",
      },
      signal: AbortSignal.timeout(4500),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return fallback;
    }
    const data = (await res.json()) as {
      title?: unknown;
      url?: unknown;
      fen?: unknown;
      pgn?: unknown;
    };
    const fen = typeof data.fen === "string" ? data.fen.trim() : "";
    const url = sanitizeHttpUrl(typeof data.url === "string" ? data.url : null);
    const title = typeof data.title === "string" ? sanitizePlainText(data.title, 80) : "Daily Puzzle";
    if (!fen || !url) {
      return fallback;
    }
    const activeColor = fen.split(" ")[1] === "b" ? "BLACK" : "WHITE";
    const hintMove = typeof data.pgn === "string" ? extractFirstMoveFromPgn(data.pgn) : null;
    return { title, url, fen, sideToMove: activeColor, hintMove };
  } catch {
    return fallback;
  }
}
