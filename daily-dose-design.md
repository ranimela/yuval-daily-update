# Daily Dose: mobile homepage design spec

A daily-update page for an 11-year-old. Mobile first, single column, flat-cartoon look (original style, no characters, logos or show names).

## Goals

- One scrolling page with four content sections: Today in History, News Feed, Term of the Day, Think About It.
- Designed for phones (390px wide). Container is fluid, max width 480px, centered on larger screens.
- Touch targets at least 44px.

## Visual style

| Token | Value | Use |
|---|---|---|
| Ink | `#111111` | Text, all outlines, hard shadows |
| Sky (tweakable) | `#9fd8f0` | Page background. Alternatives: `#ffe5a0`, `#c9f2c7`, `#ffc9de` |
| Yellow | `#ffd23f` | Logo badge, hero card, example boxes, source pills |
| Orange | `#ff8a3d` | History header, History nav chip |
| Red | `#ff595e` | News header, News nav chip |
| Purple | `#b79cf2` | Term header, Term nav chip |
| Teal | `#3ddbc0` | Think header, Think nav chip |
| Grass / roof / tree | `#4cc24e` / `#c1121f` / `#2a9d3f` | Hero skyline illustration |

- **Outlines:** 4px ink on cards, 3px on chips and inner cards.
- **Shadows:** hard offset, no blur. 6px on cards, 3 to 4px on chips and badges.
- **Radius:** 20px cards, 14px inner cards, 999px pills.
- **Headings:** Lilita One (Google Fonts), uppercase, 28px section titles, 76px hero date.
- **Body:** Nunito 600, 16px, line height 1.45. Bold labels use 800.
- **Decor:** simple flat skyline (two houses, a tree, grass strip) at the bottom of the hero card.
- **Contrast:** ink text on all colored fills. White text only on ink pills.

## Page structure (top to bottom)

Column padding 16px, gap 20px between blocks.

### 1. Header
- Left: yellow badge "DAILY DOSE" with "for [NAME]" underneath, rotated -2 degrees.
- Right: 48px circular menu button (three lines), label "Settings".

### 2. Section nav
Horizontal scrolling row of pill links, anchors to each section: History, News, Term of the day, Think about it. Each pill uses its section color.

### 3. Hero card (yellow)
- "SATURDAY" (22px), "NOV 21" (76px), greeting: "Good morning, [NAME]! Four things to get your brain going."
- Skyline SVG along the bottom edge (decorative).

### 4. Today in History (orange header, date badge)
- Tabs: Events (active), Births, Deaths.
- Entries: year badge (ink pill, yellow text) beside one sentence. Dashed divider between entries.
- Data source: Wikimedia "On this day" feed. Sample entries in the mockup: 1783 first untethered hot air balloon flight (Paris), 1877 Edison announces the phonograph.
- Footnote: sample entries, live version pulls from the feed.

### 5. News Feed (red header, "5 STORIES" badge)
- Filter chips: All (active), Israel, World, Science.
- Five story cards: source pill (yellow), time ago, headline (18px bold), "Read the story" link (44px tall).
- Note under the list: sources picked by a parent, kid-appropriate feeds only.
- Mockup content is placeholders: `[Source]`, `[time ago]`, `[Headline from RSS feed]`.

### 6. Term of the Day (purple header, category badge)
- Category badge rotates: Math, Statistics, Technology.
- Term (52px), plain definition, yellow "Example" box, "Why it matters" line.
- Sample: **Median**. Definition: the middle number when values are lined up smallest to largest. Example: scores 3, 7, 9, 12, 100 give median 9, average 26.2. Why it matters: the median ignores extreme values, so income reports use it.

### 7. Think About It (teal header, "PHILOSOPHY" badge)
- Concept title (36px), one-question framing, yellow "Two ways to see it" box, labelled text box "What is your take?".
- Sample: **The Ship of Theseus**. Replace every plank one at a time. Same ship (kept shape and job) or different ship (no original parts left)?

### 8. Footer
Attribution: Wikimedia On this day (CC BY-SA), news from the RSS sources shown.

## Content and data notes

- **History:** Wikimedia Feed API, `https://en.wikipedia.org/api/rest_v1/feed/onthisday/{events|births|deaths}/{MM}/{DD}`. Month and day must be zero-padded. Set a User-Agent with contact info. Cache daily.
- **News:** RSS feeds chosen by a parent. Filter to kid-appropriate sources and topics.
- **Term and concept:** a hand-curated or generated rotation. Keep a list and avoid repeats.
- **Placeholders in the mockup:** `[NAME]`, `[YEAR]`, `[Source]`, `[time ago]`, `[Headline from RSS feed]`, `[Event from the Wikimedia On this day feed]`.

## Accessibility

- Real links, labels and a labelled textarea. Decorative SVG hidden from assistive tech.
- All interactive items at least 44px tall.
- Text is ink on light or mid-tone fills, or light on ink.

## Open questions

- One scrolling page or separate tabs/screens per section?
- Desktop layout needed? Current design is phone only.
