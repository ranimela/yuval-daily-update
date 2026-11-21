export interface DailyTerm {
  category: "Math" | "Statistics" | "Technology";
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

const TERMS: DailyTerm[] = [
  {
    category: "Statistics",
    term: "Median",
    definition: "The middle number when values are lined up smallest to largest.",
    example: "Scores 3, 7, 9, 12, 100 give median 9, average 26.2.",
    whyItMatters: "The median ignores extreme values, so income reports use it.",
    detailUrl: "https://en.wikipedia.org/wiki/Median",
  },
  {
    category: "Technology",
    term: "Latency",
    definition: "The delay between sending a request and getting the first response back.",
    example: "Pressing a game button and seeing your character jump 40ms later.",
    whyItMatters: "Low latency makes multiplayer games and video calls feel instant.",
    detailUrl: "https://en.wikipedia.org/wiki/Latency_(engineering)",
  },
  {
    category: "Math",
    term: "Exponent",
    definition: "A small number showing how many times to multiply a base number by itself.",
    example: "2⁴ means 2 × 2 × 2 × 2 = 16.",
    whyItMatters: "Exponents explain how populations, viral videos, and computer memory grow fast.",
    detailUrl: "https://en.wikipedia.org/wiki/Exponentiation",
  },
  {
    category: "Technology",
    term: "Algorithm",
    definition: "A clear step-by-step recipe a computer follows to solve a problem.",
    example: "Binary search finds a word in a dictionary by splitting it in half each step.",
    whyItMatters: "Smart algorithms turn hours of searching into milliseconds.",
    detailUrl: "https://en.wikipedia.org/wiki/Algorithm",
  },
  {
    category: "Statistics",
    term: "Outlier",
    definition: "A data point that sits far away from all the other numbers in a group.",
    example: "In heights 142, 145, 147, 148, and 210 cm, 210 cm is the outlier.",
    whyItMatters: "One outlier can skew an average or signal an important discovery.",
    detailUrl: "https://en.wikipedia.org/wiki/Outlier",
  },
];

const THINK_PROMPTS: DailyThinkPrompt[] = [
  {
    title: "The Ship of Theseus",
    question:
      "If you replace every wooden plank on a ship one at a time until none of the original planks remain, is it still the same ship?",
    twoWays: [
      "Same ship: it kept its continuous shape, name, and job.",
      "Different ship: zero original parts are left.",
    ],
    deeperLabel: "Stanford Encyclopedia of Philosophy",
    deeperUrl: "https://plato.stanford.edu/entries/identity-time/",
  },
  {
    title: "The Ring of Gyges",
    question:
      "If you had a ring that made you completely invisible with zero chance of getting caught, would you still follow the rules?",
    twoWays: [
      "Yes: doing the right thing matters even when nobody watches.",
      "Harder than it looks: rules often rely on people knowing they might be caught.",
    ],
    deeperLabel: "Internet Encyclopedia of Philosophy",
    deeperUrl: "https://iep.utm.edu/plato/",
  },
  {
    title: "The Library of Babel",
    question:
      "If a library held every possible combination of letters—meaning every true fact AND every false rumor—would that library be useful?",
    twoWays: [
      "Amazing: every answer in the universe is already written inside it.",
      "Useless: finding one true sentence among endless nonsense is impossible without a filter.",
    ],
    deeperLabel: "Stanford Encyclopedia of Philosophy",
    deeperUrl: "https://plato.stanford.edu/entries/epistemology/",
  },
];

function getDaySeed(editionDate: string): number {
  let sum = 0;
  for (let i = 0; i < editionDate.length; i += 1) {
    sum = (sum * 31 + editionDate.charCodeAt(i)) >>> 0;
  }
  return sum;
}

export function getDailyTerm(editionDate: string): DailyTerm {
  return TERMS[getDaySeed(editionDate) % TERMS.length];
}

export function getDailyThinkPrompt(editionDate: string): DailyThinkPrompt {
  return THINK_PROMPTS[getDaySeed(editionDate) % THINK_PROMPTS.length];
}
