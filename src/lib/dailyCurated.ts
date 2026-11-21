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

export interface DailyExcuse {
  category: string;
  text: string;
}

const TERMS: DailyTerm[] = [
  {
    category: "Stats",
    term: "Median",
    definition: "The middle number when you line up all the values from smallest to largest.",
    example: "Test scores: 3, 7, 9, 12, 100 — Median: 9 (Average: 26.2, dragged up by 100).",
    whyItMatters: "The median ignores extreme values, so reports on things like income use it.",
    detailUrl: "https://en.wikipedia.org/wiki/Median",
  },
  {
    category: "Tech",
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
    category: "Tech",
    term: "Algorithm",
    definition: "A clear step-by-step recipe a computer follows to solve a problem.",
    example: "Binary search finds a word in a dictionary by splitting it in half each step.",
    whyItMatters: "Smart algorithms turn hours of searching into milliseconds.",
    detailUrl: "https://en.wikipedia.org/wiki/Algorithm",
  },
  {
    category: "Stats",
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
      "Replace the planks of a ship one at a time until every plank is new. Is it still the same ship?",
    twoWays: [
      "Same ship: it kept its shape and its job.",
      "Different ship: none of the original parts are left.",
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
      "If a library held every possible combination of letters—every true fact AND every false rumor—would it be useful?",
    twoWays: [
      "Amazing: every answer in the universe is already written inside it.",
      "Useless: finding one true sentence among endless nonsense is impossible without a filter.",
    ],
    deeperLabel: "Stanford Encyclopedia of Philosophy",
    deeperUrl: "https://plato.stanford.edu/entries/epistemology/",
  },
];

const USELESS_FACTS: string[] = [
  "A group of flamingos is called a flamboyance.",
  "Octopuses have three hearts, and two of them stop beating when they swim.",
  "Bananas are berries, while strawberries are not.",
  "Honey never spoils—jars found in ancient Egyptian tombs are still edible.",
  "Wombat poop is cube-shaped so it doesn't roll away on rocks.",
];

const SILLY_EXCUSES: DailyExcuse[] = [
  {
    category: "Homework",
    text: "My homework was abducted by a very organized squirrel.",
  },
  {
    category: "Chores",
    text: "I tried to clean my room, but the gravity was unusually strong near my bed.",
  },
  {
    category: "School",
    text: "My backpack entered airplane mode and refused to unzip until noon.",
  },
  {
    category: "Bedtime",
    text: "I wasn't stalling—I was conducting a scientific study on ceiling shadows.",
  },
  {
    category: "Sports",
    text: "The soccer ball clearly curved on purpose to avoid my left shoe.",
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

export function getDailyUselessFact(editionDate: string): string {
  return USELESS_FACTS[getDaySeed(editionDate) % USELESS_FACTS.length];
}

export function getDailyExcuse(editionDate: string): DailyExcuse {
  return SILLY_EXCUSES[getDaySeed(editionDate) % SILLY_EXCUSES.length];
}
