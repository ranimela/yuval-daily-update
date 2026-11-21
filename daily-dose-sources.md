# Daily Dose: data sources

All sources below come from web searches. None were fetched or tested, so verify each URL and its current behavior before wiring it in.

## Today in History

**Wikimedia Feed API (primary)**
- Free, no key.
- Endpoint: `https://en.wikipedia.org/api/rest_v1/feed/onthisday/{type}/{MM}/{DD}`
- Types: `events`, `births`, `deaths`, `selected`, `holidays`, `all`.
- Month and day must be zero-padded (`03/28`, not `3/28`). The unpadded form fails.
- Set a descriptive User-Agent with contact info.
- Content license: CC BY-SA. Attribution required (already in the page footer).
- Fetch once a day and cache.

**Fallbacks (Wikipedia re-wrappers, no added data)**
- byabbe.se: `https://byabbe.se/on-this-day/{month}/{day}/events.json`. Free, no key, English only, single maintainer.
- ZenQuotes: `https://today.zenquotes.io/api/[month]/[day]`. Limits not confirmed.

## Term of the Day (math, statistics, technology)

- No ready-made feed found.
- Approach: keep your own curated list of terms (plain definition, worked example, "why it matters"), rotating through the three categories.
- Optional detail link: Wikipedia REST API article summaries (free, no key, CC BY-SA).

## Think About It (philosophy)

- No daily kid-level feed found.
- Approach: curated list of simple concepts, same card format as the term section.
- "Go deeper" links only (scholarly, not kid-level):
  - Stanford Encyclopedia of Philosophy RSS: `https://plato.stanford.edu/rss/sep.xml` (announces new and revised entries).
  - Internet Encyclopedia of Philosophy RSS: `https://iep.utm.edu/feed/`.

## News Feed

- Source: your own (supplied by you, not covered here).

## Optional extras

| Source | Access | Notes |
|---|---|---|
| Merriam-Webster word of the day | RSS: `https://www.merriam-webster.com/wotd/feed/rss2` | General vocabulary, not math or tech |
| Wiktionary word of the day | RSS or Atom (URL not found) | General vocabulary |
| Wordnik API | Free key, rate-limited | Word-of-the-day endpoint, definitions, examples. Commercial use may need contacting Wordnik |
| Wikimedia featured content | `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/{YYYY}/{MM}/{DD}` | Featured article of the day, via the same feed family |

## Known risks

- Wikimedia has had endpoint outages and path changes before. Cache responses and handle failures.
- Wikipedia definitions are written for adults. Use them as detail, not as the card text.
- Attribution under CC BY-SA is required wherever Wikipedia-derived text appears.
