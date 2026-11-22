import ww1ByDate from "@/data/ww1-by-date.json";
import ww2ByDate from "@/data/ww2-by-date.json";
import type { FeedItem } from "@/lib/contracts";

export interface WarTimelineEntry {
  year: number;
  text: string;
}

export function getWarTimelineEntries(editionDate: string): {
  ww1: WarTimelineEntry[];
  ww2: WarTimelineEntry[];
} {
  const mmdd = editionDate.slice(5, 10);
  const ww1Map = ww1ByDate as Record<string, WarTimelineEntry[] | undefined>;
  const ww2Map = ww2ByDate as Record<string, WarTimelineEntry[] | undefined>;
  return {
    ww1: ww1Map[mmdd] ?? [],
    ww2: ww2Map[mmdd] ?? [],
  };
}

/**
 * Exclude WWI and WWII war events from the general Today in History feed so they are not shown twice.
 */
export function isWarEvent(item: FeedItem): boolean {
  const text = `${item.title} ${item.summary}`;
  if (/\b(world war (i|ii|1|2)|ww1|ww2|wwi|wwii)\b/i.test(text)) {
    return true;
  }
  if (item.year !== null && ((item.year >= 1914 && item.year <= 1918) || (item.year >= 1939 && item.year <= 1945))) {
    return /\b(war|army|troops|battle|front|navy|air force|allied|axis|german|british|soviet|invasion|siege|treaty)\b/i.test(
      text
    );
  }
  return false;
}
