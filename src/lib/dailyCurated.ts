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
  {
    category: "Math",
    term: "Prime Number",
    definition: "A whole number greater than 1 that can only be divided evenly by 1 and itself.",
    example: "2, 3, 5, 7, 11, and 13 are primes; 12 is not because 3 × 4 = 12.",
    whyItMatters: "Huge prime numbers protect online passwords and banking encryption.",
    detailUrl: "https://en.wikipedia.org/wiki/Prime_number",
  },
  {
    category: "Tech",
    term: "Cache",
    definition: "A fast temporary storage spot that keeps copies of data you recently used.",
    example: "Your browser saves a site's logo so it loads instantly on your next visit.",
    whyItMatters: "Caching saves bandwidth and makes apps feel snappy.",
    detailUrl: "https://en.wikipedia.org/wiki/Cache_(computing)",
  },
  {
    category: "Stats",
    term: "Probability",
    definition: "A number between 0 and 1 (or 0% to 100%) measuring how likely an event is.",
    example: "Flipping a fair coin gives Heads with probability 0.5 (50%).",
    whyItMatters: "Weather forecasts, sports analytics, and games all run on probability.",
    detailUrl: "https://en.wikipedia.org/wiki/Probability",
  },
  {
    category: "Math",
    term: "Fibonacci",
    definition: "A sequence where each number is the sum of the two numbers right before it.",
    example: "1, 1, 2, 3, 5, 8, 13, 21, 34...",
    whyItMatters: "Fibonacci spirals show up in pinecones, sunflowers, and sea shells.",
    detailUrl: "https://en.wikipedia.org/wiki/Fibonacci_sequence",
  },
  {
    category: "Tech",
    term: "Encryption",
    definition: "Scrambling a message with a secret key so only authorized people can read it.",
    example: "Turning 'HELLO' into 'KHOOR' by shifting each letter 3 spots.",
    whyItMatters: "Encryption keeps your messages, passwords, and Wi-Fi private.",
    detailUrl: "https://en.wikipedia.org/wiki/Encryption",
  },
  {
    category: "Stats",
    term: "Correlation",
    definition: "When two things tend to move together—either up together or in opposite directions.",
    example: "Ice cream sales and sunscreen sales both rise in summer.",
    whyItMatters: "Two things moving together does not mean one caused the other!",
    detailUrl: "https://en.wikipedia.org/wiki/Correlation",
  },
  {
    category: "Math",
    term: "Factorial",
    definition: "Multiplying a whole number by every positive whole number smaller than it.",
    example: "4! = 4 × 3 × 2 × 1 = 24 ways to line up 4 books.",
    whyItMatters: "Factorials count how many ways cards, chess pieces, or passwords can be arranged.",
    detailUrl: "https://en.wikipedia.org/wiki/Factorial",
  },
  {
    category: "Tech",
    term: "Bandwidth",
    definition: "The maximum amount of data that can travel over a connection each second.",
    example: "A 100 Mbps connection can download a large game much faster than 10 Mbps.",
    whyItMatters: "High bandwidth lets multiple people stream video at the same time.",
    detailUrl: "https://en.wikipedia.org/wiki/Bandwidth_(computing)",
  },
  {
    category: "Stats",
    term: "Sample Size",
    definition: "How many items or people you actually measure out of a much bigger group.",
    example: "Asking 1,000 students instead of all 100,000 students in a city.",
    whyItMatters: "Too small a sample can give a misleading result by pure luck.",
    detailUrl: "https://en.wikipedia.org/wiki/Sample_size_determination",
  },
  {
    category: "Math",
    term: "Ratio",
    definition: "A comparison showing how much of one quantity there is compared to another.",
    example: "A 2:1 ratio of flour to water means 2 cups of flour for every 1 cup of water.",
    whyItMatters: "Cooking recipes, map scales, and screen resolutions all rely on ratios.",
    detailUrl: "https://en.wikipedia.org/wiki/Ratio",
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
