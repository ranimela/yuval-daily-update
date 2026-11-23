import mathTerms from "@/data/terms-math.json";
import statsTerms from "@/data/terms-stats.json";
import techTerms from "@/data/terms-tech.json";

export interface DailyTerm {
  category: "Math" | "Stats" | "Tech";
  term: string;
  definition: string;
  example: string;
  whyItMatters: string;
  detailUrl: string;
}

export interface DailyThinkPrompt {
  title: string;
  question: string;
  twoWays: string[];
  deeperLabel: string;
  deeperUrl: string;
}

type RawTerm = Omit<DailyTerm, "category">;

function buildInterleavedTerms(): DailyTerm[] {
  const stats = statsTerms as RawTerm[];
  const tech = techTerms as RawTerm[];
  const math = mathTerms as RawTerm[];
  const maxLen = Math.max(stats.length, tech.length, math.length);
  const out: DailyTerm[] = [];

  for (let i = 0; i < maxLen; i += 1) {
    if (i < stats.length) out.push({ category: "Stats", ...stats[i] });
    if (i < tech.length) out.push({ category: "Tech", ...tech[i] });
    if (i < math.length) out.push({ category: "Math", ...math[i] });
  }
  return out;
}

const TERMS: DailyTerm[] = buildInterleavedTerms();

const THINK_PROMPTS: DailyThinkPrompt[] = [
  {
    title: "The Ship of Theseus",
    question:
      "Replace the planks of a ship one at a time until every plank is new. Is it still the same ship?",
    twoWays: [
      "Same ship: it kept its shape and its job.",
      "Different ship: none of the original parts are left.",
    ],
    deeperLabel: "Wikipedia: Ship of Theseus",
    deeperUrl: "https://en.wikipedia.org/wiki/Ship_of_Theseus",
  },
  {
    title: "The Ring of Gyges",
    question:
      "If you had a ring that made you completely invisible with zero chance of getting caught, would you still follow the rules?",
    twoWays: [
      "Yes: doing the right thing matters even when nobody watches.",
      "Harder than it looks: rules often rely on people knowing they might be caught.",
    ],
    deeperLabel: "Wikipedia: Ring of Gyges",
    deeperUrl: "https://en.wikipedia.org/wiki/Ring_of_Gyges",
  },
  {
    title: "The Library of Babel",
    question:
      "If a library held every possible combination of letters—every true fact AND every false rumor—would it be useful?",
    twoWays: [
      "Amazing: every answer in the universe is already written inside it.",
      "Useless: finding one true sentence among endless nonsense is impossible without a filter.",
    ],
    deeperLabel: "Wikipedia: The Library of Babel",
    deeperUrl: "https://en.wikipedia.org/wiki/The_Library_of_Babel",
  },
  {
    title: "The Prisoner's Dilemma",
    question:
      "Two teammates can either cooperate for a good score or betray each other for a chance at the best score. Should you cooperate?",
    twoWays: [
      "Cooperate: if both trust each other, both do well.",
      "Play safe: if you worry the other person might betray you, you might betray first.",
    ],
    deeperLabel: "Wikipedia: Prisoner's Dilemma",
    deeperUrl: "https://en.wikipedia.org/wiki/Prisoner%27s_dilemma",
  },
  {
    title: "Mary's Room",
    question:
      "A scientist knows every physics fact about color, but has lived in a black-and-white room forever. Does she learn something new when she sees red?",
    twoWays: [
      "Yes: experiencing a color is different from reading facts about light waves.",
      "No: if she truly knew every physical fact, she already knew what red does to the brain.",
    ],
    deeperLabel: "Wikipedia: Knowledge Argument",
    deeperUrl: "https://en.wikipedia.org/wiki/Knowledge_argument",
  },
  {
    title: "Zeno's Paradox",
    question:
      "To cross a room, you must first walk half the distance, then half of what's left, forever. How do you ever reach the wall?",
    twoWays: [
      "Math trick: infinitely many shrinking steps can still add up to a finite distance and time.",
      "Real world: space and motion are continuous, not broken into infinite pauses.",
    ],
    deeperLabel: "Wikipedia: Zeno's Paradoxes",
    deeperUrl: "https://en.wikipedia.org/wiki/Zeno%27s_paradoxes",
  },
  {
    title: "The Chinese Room",
    question:
      "If someone follows a giant rulebook to answer Chinese questions perfectly without understanding a word of Chinese, do they 'understand'?",
    twoWays: [
      "No: following symbols by rules is not real understanding.",
      "Yes: the whole system (person + rulebook) understands just like a brain's neurons.",
    ],
    deeperLabel: "Wikipedia: Chinese Room",
    deeperUrl: "https://en.wikipedia.org/wiki/Chinese_room",
  },
  {
    title: "Occam's Razor",
    question:
      "You wake up and the backyard is wet. Was it rain, or did a secret helicopter spray your lawn?",
    twoWays: [
      "Simple wins: when two explanations fit, pick the one with fewer wild guesses.",
      "Stay curious: sometimes the surprising explanation is true—you just need real evidence for it.",
    ],
    deeperLabel: "Wikipedia: Occam's Razor",
    deeperUrl: "https://en.wikipedia.org/wiki/Occam%27s_razor",
  },
];

const USELESS_FACTS: string[] = [
  "A group of flamingos is called a flamboyance.",
  "Octopuses have three hearts, and two of them stop beating when they swim.",
  "Bananas are berries, while strawberries are not.",
  "Honey never spoils—jars found in ancient Egyptian tombs are still edible.",
  "Wombat poop is cube-shaped so it doesn't roll away on rocks.",
  "Sea otters hold hands while sleeping so they don't drift apart.",
  "A day on Venus is longer than a year on Venus.",
  "Sharks existed before trees appeared on Earth.",
  "The Eiffel Tower grows up to 15 centimeters taller in summer heat.",
  "Dolphins give each other unique signature whistles, almost like names.",
];

/**
 * Monotonic UTC day index from YYYY-MM-DD so sequential days never repeat until the full list cycles.
 */
export function getDayIndex(editionDate: string): number {
  const ms = Date.parse(`${editionDate}T00:00:00Z`);
  if (!Number.isFinite(ms)) {
    return 0;
  }
  return Math.floor(ms / 86_400_000);
}

export function getDailyTerm(editionDate: string): DailyTerm {
  return TERMS[getDayIndex(editionDate) % TERMS.length];
}

export function getDailyThinkPrompt(editionDate: string): DailyThinkPrompt {
  return THINK_PROMPTS[getDayIndex(editionDate) % THINK_PROMPTS.length];
}

export function getDailyUselessFact(editionDate: string): string {
  return USELESS_FACTS[getDayIndex(editionDate) % USELESS_FACTS.length];
}
