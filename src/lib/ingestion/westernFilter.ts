const PRIORITY_TOPIC_KEYWORDS = [
  // WW1
  "world war i",
  "first world war",
  "great war",
  "ww1",
  "wwi",
  "somme",
  "verdun",
  "gallipoli",
  "armistice",
  "archduke franz ferdinand",
  "treaty of versailles",
  // WW2
  "world war ii",
  "second world war",
  "ww2",
  "wwii",
  "normandy",
  "d-day",
  "stalingrad",
  "dunkirk",
  "pearl harbor",
  "battle of britain",
  "midway",
  "el alamein",
  "hiroshima",
  "nagasaki",
  "holocaust",
  "auschwitz",
  "warsaw ghetto",
  "churchill",
  "eisenhower",
  "patton",
  "rommel",
  "blitzkrieg",
  "allied forces",
  "axis powers",
  // Roman Empire
  "roman empire",
  "roman republic",
  "ancient rome",
  "roman",
  "julius caesar",
  "augustus",
  "constantine",
  "hadrian",
  "trajan",
  "marcus aurelius",
  "nero",
  "pompeii",
  "colosseum",
  "rubicon",
  "punic war",
  "hannibal",
  "byzantine",
  // Napoleon
  "napoleon",
  "napoleonic",
  "bonaparte",
  "waterloo",
  "austerlitz",
  "trafalgar",
  "borodino",
  "marengo",
  "jena",
];

const WESTERN_HISTORY_KEYWORDS = [
  // Israel & Jewish history
  "israel",
  "israeli",
  "jerusalem",
  "tel aviv",
  "haifa",
  "judea",
  "galilee",
  "knesset",
  "zionist",
  "zionism",
  "ben-gurion",
  "herzl",
  "rabin",
  "begin",
  "meir",
  "six-day war",
  "yom kippur war",
  "entebbe",
  "balfour",
  // United States
  "united states",
  "u.s.",
  "usa",
  "america",
  "american",
  "washington",
  "new york",
  "boston",
  "philadelphia",
  "california",
  "texas",
  "virginia",
  "congress",
  "white house",
  "pentagon",
  "nasa",
  "apollo",
  "declaration of independence",
  "american revolution",
  "civil war",
  "lincoln",
  "roosevelt",
  "kennedy",
  "jefferson",
  "franklin",
  "truman",
  "moon landing",
  "gettysburg",
  // Europe & Western Civilization
  "europe",
  "european",
  "britain",
  "british",
  "united kingdom",
  "england",
  "english",
  "london",
  "scotland",
  "ireland",
  "wales",
  "france",
  "french",
  "paris",
  "versailles",
  "germany",
  "german",
  "berlin",
  "munich",
  "prussia",
  "italy",
  "italian",
  "rome",
  "venice",
  "florence",
  "vatican",
  "spain",
  "spanish",
  "madrid",
  "portugal",
  "portuguese",
  "greece",
  "greek",
  "athens",
  "sparta",
  "netherlands",
  "dutch",
  "amsterdam",
  "belgium",
  "brussels",
  "switzerland",
  "geneva",
  "austria",
  "vienna",
  "poland",
  "warsaw",
  "czech",
  "prague",
  "hungary",
  "budapest",
  "sweden",
  "norway",
  "denmark",
  "finland",
  "ukraine",
  "kyiv",
  "russia",
  "russian",
  "soviet",
  "moscow",
  "nato",
  "european union",
  "world war",
  "cold war",
  "magna carta",
  "renaissance",
  "reformation",
  "enlightenment",
  "industrial revolution",
  "shakespeare",
  "galileo",
  "newton",
  "einstein",
  "darwin",
  "curie",
  "gutenberg",
];

function compilePatterns(keywords: string[]): RegExp[] {
  return keywords.map((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i");
  });
}

const PRIORITY_PATTERNS = compilePatterns(PRIORITY_TOPIC_KEYWORDS);
const WESTERN_PATTERNS = compilePatterns(WESTERN_HISTORY_KEYWORDS);

/**
 * Score an event: 2 for WW1/WW2/Roman Empire/Napoleon, 1 for Europe/US/Israel, 0 otherwise.
 */
export function getWesternHistoryPriority(text: string, year?: number | null): number {
  if (!text) {
    return 0;
  }
  const isPriorityYear =
    year !== null &&
    year !== undefined &&
    ((year >= 1914 && year <= 1918) || (year >= 1939 && year <= 1945));
  if (PRIORITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return 2;
  }
  if (isPriorityYear && WESTERN_PATTERNS.some((pattern) => pattern.test(text))) {
    return 2;
  }
  if (WESTERN_PATTERNS.some((pattern) => pattern.test(text))) {
    return 1;
  }
  return 0;
}

/**
 * Return true when an event description matches Europe, US, or Israel history keywords.
 */
export function isWesternHistory(text: string, year?: number | null): boolean {
  return getWesternHistoryPriority(text, year) > 0;
}
