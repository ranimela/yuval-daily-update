# Daily Dose: frontend developer handoff (v4)

A mobile-first daily-update web page for an 11-year-old. One scrolling page, single column, flat-cartoon look (original style: no characters, logos or show names).

- **Design mockup (live):** https://claude.ai/artifact/1BwMrWyo2ibbTQrHbC82Mg
- **Mockup frame:** 390px wide, 4850px tall, static. Everything marked "Proposed" below is NOT in the mockup and needs a decision.

**Changelog**
- **v4:** added a "Bonus Round" before the footer with four cards: Useless Fact, Roman Empire Fact, Chess Puzzle (Chess.com daily puzzle, solved on Chess.com), and a conditional Scientist Born Today card. Excuse of the Day was dropped as not funny. A Math Riddle card was tried and replaced by the chess card. Page frame is now 4850px tall. Decision: no database; content is static JSON, API pulls are cached daily, streak and answers use `localStorage`.
- **v3:** removed the sticky section nav bar. Replaced the date banner (sunburst and skyline) with a dark game-style "Daily Mission" card: date, streak chip, four quest tiles, progress bar. Page frame was 3300px tall.
- **v2:** section icons, halftone header texture, dotted sky, numbered news cards, sticker term, speech-bubble question, grass footer strip.
- **v1:** initial layout.

---

## 1. Page sections

Order, top to bottom: Header, Daily Mission card, Today in History, News Feed, Term of the Day, Think About It, Bonus Round (banner, Useless Fact, Roman Empire Fact, Chess Puzzle, Scientist Born Today), Footer, grass strip.

There is no top nav bar. The four quest tiles in the Daily Mission card jump to the four main sections. The Bonus Round is not part of the mission: it has no tile and is not counted in "N of 4".

---

## 2. Design tokens

### Colors

| Token | Hex | Use |
|---|---|---|
| ink | `#111111` | All text on light fills, all borders, all hard shadows, Daily Mission card background |
| sky (tweakable) | `#9fd8f0` | Page background. Alternatives: `#ffe5a0`, `#c9f2c7`, `#ffc9de` |
| yellow | `#ffd23f` | Logo badge, hero date, hero card shadow, streak chip, sparkles, example boxes, source pills, active-chip text on ink, Useless Fact header, Bonus Round stars |
| orange | `#ff8a3d` | History header and quest tile, year-badge shadow, streak flame |
| red | `#ff595e` | News header and quest tile, hero date shadow |
| purple | `#b79cf2` | Term header, term sticker, Term quest tile |
| teal | `#3ddbc0` | Think header and quest tile, hero weekday, "DAILY MISSION" pill, sparkle |
| bubble teal | `#c8f5ec` | Speech bubble background, scientist portrait slot |
| white | `#ffffff` | Cards, inactive chips, menu button, icon circles, text on the dark hero |
| news card gray | `#f7f7f7` | News article cards |
| grass | `#4cc24e` | Footer grass strip |

Text is ink on colored fills and white or colored (teal, yellow) on the dark hero. White or yellow text also appears on ink pills and circles.

### Textures

- **Page background:** sky color plus dots: `background-image: radial-gradient(rgba(255,255,255,0.5) 2px, transparent 2px); background-size: 18px 18px;`
- **Section headers (History, News, Term, Think):** header color plus halftone: `background-image: radial-gradient(rgba(0,0,0,0.13) 1.5px, transparent 1.5px); background-size: 9px 9px;`
- **Daily Mission card:** ink background with a faint grid: `background-image: linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 20px 20px;`

### Typography

- Headings and display: **Lilita One** (Google Fonts), weight 400, uppercase.
- Body: **Nunito**, weights 600 (body) and 800 (labels, links, chips).
- Google Fonts link: `https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@600;800&display=swap`
- Base: Nunito 600, 16px, line-height 1.45, color ink.

| Role | Font | Size | Notes |
|---|---|---|---|
| Hero date | Lilita One | 84px | line-height 0.95, color yellow, `text-shadow: 4px 4px 0 #ff595e` |
| Hero weekday | Lilita One | 22px | letter-spacing 3px, color teal |
| Term name | Lilita One | 48px | line-height 1.1 |
| Concept title | Lilita One | 36px | line-height 1.05 |
| Logo | Lilita One | 30px | line-height 1, letter-spacing 1px |
| Section title | Lilita One | 25px | letter-spacing 1px |
| Year badge | Lilita One | 22px | |
| News number | Lilita One | 17px | |
| Intro / definition / greeting text | Nunito 600 / 800 | 18px | Greeting is weight 800 |
| Story headline | Nunito 800 | 18px | line-height 1.25 |
| Quest tile label | Nunito 800 | 16px | line-height 1.2 |
| Small text, notes, meta | Nunito 600 / 800 | 13px | |
| Section badge | Nunito 800 | 14px | |
| Hero pills, progress label | Nunito 800 | 13px | "DAILY MISSION" letter-spacing 2px |
| Example label | Nunito 800 | 13px | uppercase, letter-spacing 1px |

### Shape

| Element | Border | Radius | Shadow |
|---|---|---|---|
| Section cards | 4px ink | 20px | `6px 6px 0 #111` |
| Daily Mission card | 4px ink | 20px | `6px 6px 0 #ffd23f` |
| Logo badge | 4px ink | 16px | `4px 4px 0 #111` |
| Menu button | 4px ink | 50% (48x48) | `3px 3px 0 #111` |
| Quest tile | 3px ink | 14px | `3px 3px 0 #fff` |
| Tile icon circle | 3px ink | 50% (34x34) | none |
| Tile check circle | 3px ink | 50% (24x24) | none |
| Progress segment | 2px white | 6px (12px tall) | none |
| Tab and filter chips | 3px ink | 999px | none |
| Term sticker | 3px ink | 14px | `4px 4px 0 #111` |
| News cards | 3px ink | 14px | `4px 4px 0 #111` |
| Example box, answer box, textarea | 3px ink | 14px | none |
| Speech bubble | 3px ink | 20px | none |
| Section icon circle | 3px ink | 50% (38x38) | none |
| Section badges | none | 999px | none |
| Year badges | none | 12px | `3px 3px 0 #ff8a3d` |
| Source pills | 2px ink | 999px | none |
| Header bottom rule | 4px ink | | |

Shadows are hard offset, zero blur.

---

## 3. Layout

- Page background: sky color with dots.
- Container: `max-width: 480px; min-height: 4850px; margin: 0 auto; padding: 16px 16px 0;` flex column, `gap: 20px`, border-box. Bottom padding is 0 so the grass strip sits at the page bottom. The min-height is a mockup-frame artifact: in production let the page grow to its content, and keep the strip at the bottom.
- On screens wider than 480px the column stays centered and the sky color fills the rest. (Larger-screen layout is not designed.)
- All tap targets at least 44px tall.
- Page basics: `html { scroll-behavior: smooth }`, `section { scroll-margin-top: 16px }`.

### Header
Flex row, space-between, centered, gap 12.
- Left: logo badge. Yellow background, border 4px, radius 16, padding `6px 14px`, `transform: rotate(-2deg)`. Text "DAILY DOSE" (30px) and "for [NAME]" (13px, weight 800).
- Right: 48px circle menu button, white, three-line icon (22px SVG, stroke 3, round caps, ink). Accessible name: "Settings".

### Daily Mission card (replaces the old banner and nav)
Container: `position: relative; background-color: #111;` grid texture; border 4px ink; radius 20; shadow `6px 6px 0 #ffd23f`; `overflow: hidden`; `color: #fff`; padding `18px 16px 16px`; flex column, gap 14.

1. **Sparkles (decorative):** absolutely positioned SVG, 70x70, `right: 12px; top: 62px`, `aria-hidden`. Three four-point stars:

```html
<svg width="70" height="70" viewBox="0 0 70 70" style="position:absolute;right:12px;top:62px" aria-hidden="true">
  <path d="M35 4L41 29L66 35L41 41L35 66L29 41L4 35L29 29Z" fill="#ffd23f"/>
  <path d="M14 2L16 10L24 12L16 14L14 22L12 14L4 12L12 10Z" fill="#fff" transform="translate(0 -2)"/>
  <path d="M58 50L60 56L66 58L60 60L58 66L56 60L50 58L56 56Z" fill="#3ddbc0"/>
</svg>
```

2. **Top row:** flex, centered, space-between, wrap, gap 8.
   - Left pill "DAILY MISSION": background teal, ink text, radius 999, padding `2px 12px`, 13px weight 800, letter-spacing 2px.
   - Right streak chip: flex, centered, gap 6, background yellow, ink text, radius 999, padding `2px 12px 2px 8px`, 13px weight 800. A 16px flame icon (`fill="#ff8a3d" stroke="#111" stroke-width="2.5" stroke-linejoin="round"`, path `M12 2c1 4-3 5-3 9a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 3-2 3 1-3 0-6-3-8z`, 24x24 viewBox), then text "[N]-day streak". The number is a placeholder.
3. **Date block:** "SATURDAY" (Lilita One 22px, letter-spacing 3px, teal) above "NOV 21" (Lilita One 84px, line-height 0.95, yellow, `text-shadow: 4px 4px 0 #ff595e`).
4. **Greeting:** paragraph, margin 0, 18px, weight 800, white: "Good morning, [NAME]! Four things to get your brain going."
5. **Quest tiles:** grid, `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px`. Four links, each: `display:flex; flex-direction:column; gap:8px; min-height:92px; padding:10px; box-sizing:border-box;` section color background, border 3px ink, radius 14, shadow `3px 3px 0 #fff`, no underline, ink text. Contents: a top row (flex, space-between) with a 34px white icon circle (18px icon, same icons as the section headers) on the left and a 24px empty white check circle (`aria-hidden`) on the right; below it the label (16px, weight 800, line-height 1.2).

| Tile label | Color | Icon | Anchor |
|---|---|---|---|
| History | orange | hourglass | `#history` |
| News | red | newspaper | `#news` |
| Term of the day | purple | lightbulb | `#term` |
| Think about it | teal | speech bubble | `#think` |

6. **Progress:** flex column, gap 6. Label "0 of 4 done" (13px, weight 800, white). Below it a row of four segments (`aria-hidden`): flex, gap 6; each `flex:1; height:12px; border:2px solid #fff; border-radius:6px; background: rgba(255,255,255,0.15)`.

### Section card pattern (History, News, Term, Think)
- Card: white, border 4px, radius 20, shadow 6px, `overflow:hidden`.
- Header: section color plus halftone, `border-bottom: 4px solid #111`, padding 12, flex row, space-between, centered, `flex-wrap: wrap`, gap 8. Left group: flex, centered, gap 8, `min-width:0`, containing a 38px white icon circle (3px ink border, 20px stroke icon, stroke width 2.5, round caps and joins) and the `h2` (margin 0, Lilita One 25px, letter-spacing 1px, weight 400). Right: badge (ink background, radius 999, padding `2px 12px`, 14px weight 800).
- On narrow phones the badge may wrap onto its own line. Accepted.
- Body: padding 16, flex column, gap 14.

Section icons (24x24 viewBox, `fill="none"`, `stroke="#111"`; also used in the quest tiles):

| Section | Icon | Path data |
|---|---|---|
| History | Hourglass | `M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9` |
| News | Newspaper | `<rect x="4" y="4" width="16" height="16" rx="2"/>` plus `M8 9h8M8 13h8M8 17h5` |
| Term | Lightbulb | `M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z` |
| Think | Speech bubble | `M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z` |

---

## 4. Section content and exact copy

### Today in History
- Header: "TODAY IN HISTORY". Badge: "NOV 21" (yellow text on ink). Header color orange.
- Tabs row: flex, gap 8, wrap. Chips "Events" (active: ink background, yellow text), "Births", "Deaths" (inactive: white). Chip: min-height 44, padding `0 16px`, border 3px, radius 999, weight 800.
- Entry row: flex, gap 12, align flex-start. Year badge: flex none, ink background, yellow text, radius 12, padding `4px 10px`, Lilita One 22px, `box-shadow: 3px 3px 0 #ff8a3d; transform: rotate(-2deg)`. Text: paragraph, margin 0.
- Divider between entries: `height:0; border-top:3px dashed #111;`
- Sample entries (mockup content, real data in the live version):
  1. 1783: "The first free flight by humans in a hot air balloon takes off from Paris."
  2. 1877: "Thomas Edison announces the phonograph, a machine that records and plays back sound."
  3. [YEAR]: "[Event from the Wikimedia On this day feed]"
- Footnote (13px, weight 600, margin `4px 0 0`): "Sample entries. The live version pulls from the Wikimedia On this day feed." (Remove in production.)

### News Feed
- Header: "NEWS FEED". Badge: "5 STORIES" (white text). Header color red.
- Filter chips row: flex, gap 8, overflow-x auto, padding-bottom 4. Chips (flex none, same style as tabs): "All" (active), "Israel", "World", "Science".
- Story card (x5): border 3px, radius 14, padding 12, flex column, gap 6, background `#f7f7f7`, shadow `4px 4px 0 #111`.
  - Meta row: flex, centered, gap 8, 13px weight 800. Left to right: number circle (30x30, ink background, yellow text, Lilita One 17px, weight 400, values 1 to 5), source pill (yellow, border 2px, radius 999, padding `0 10px`) with text "[Source]", then "[time ago]" pushed right with `margin-left: auto`.
  - Headline: `h3`, margin 0, 18px, line-height 1.25, weight 800: "[Headline from RSS feed]".
  - Link: "Read the story", flex, min-height 44, weight 800.
- Note under list (13px): "Sources are picked by a parent. Kid-appropriate feeds only."
- Data: supplied by the project owner's own news source (not specified here).

### Term of the Day
- Header: "TERM OF THE DAY". Badge: "STATS" (white text), category rotates Math, Statistics, Technology. Header color purple.
- Term sticker: `align-self:flex-start; background:#b79cf2; border:3px solid #111; border-radius:14px; box-shadow:4px 4px 0 #111; padding:4px 18px; transform:rotate(-1.5deg);` Lilita One 48px, line-height 1.1. Sample: "Median".
- Definition (18px): "The middle number when you line up all the values from smallest to largest."
- Example box: yellow, border 3px, radius 14, padding 12. Label "Example" as a pill: `display:inline-block; background:#111; color:#ffd23f; border-radius:999px; padding:0 12px; font-size:13px; font-weight:800; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px`. Lines: "Test scores: 3, 7, 9, 12, 100" / "Median: **9**" / "Average: **26.2**, dragged up by the 100".
- Why it matters (paragraph, bold lead-in): "**Why it matters:** the median ignores extreme values, so reports on things like income use it."
- Footnote (13px): "The term rotates between Math, Statistics and Technology."

### Think About It
- Header: "THINK ABOUT IT". Badge: "PHILOSOPHY" (white text). Header color teal.
- Concept title: Lilita One 36px, line-height 1.05. Sample: "The Ship of Theseus".
- Speech bubble: `position:relative; background:#c8f5ec; border:3px solid #111; border-radius:20px; padding:14px 16px; margin-bottom:8px`. Text (18px): "Replace the planks of a ship one at a time until every plank is new. Is it still the same ship?" Tail: absolutely positioned square, `left:30px; bottom:-12px; width:18px; height:18px; background:#c8f5ec; border-right:3px solid #111; border-bottom:3px solid #111; transform:rotate(45deg)`.
- Box (yellow, as in Term): label "Two ways to see it" (weight 800, margin-bottom 4). Lines: "Same ship: it kept its shape and its job." / "Different ship: none of the original parts are left."
- Label (`for="take"`, weight 800): "What is your take?"
- Textarea `id="take"`: rows 3, width 100%, border-box, border 3px ink, radius 14, padding 12, font inherit, 16px, weight 600, `resize:none`, placeholder "Write your answer here".

### Bonus Round (not part of the mission)
- **Banner:** flex column, centered, gap 4, padding-top 8. Top row: yellow four-point star (24px SVG, ink stroke 2, round joins, path `M12 1L15 9L23 12L15 15L12 23L9 15L1 12L9 9Z`), "BONUS ROUND" (Lilita One 30px, letter-spacing 2px, `text-shadow: 3px 3px 0 #fff`), the same star again. Below: "Just for fun. Not part of today's mission." (14px, weight 800, centered).
- Four cards follow the banner (Useless Fact, Roman Empire Fact, Chess Puzzle, and the conditional Scientist Born Today), all in the standard section card pattern.

**Useless Fact** (`id="fact"`)
- Header yellow, icon star (path `M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z`), title "USELESS FACT", badge "BONUS" (white text).
- Body: pill "DID YOU KNOW?" (`align-self:flex-start`, ink background, yellow text, radius 999, padding `0 12px`, 13px weight 800, letter-spacing 1px). Fact text: 20px, weight 800, line-height 1.3. Sample: "A group of flamingos is called a flamboyance."
- Footnote (13px): "Sample fact. The live version pulls from the Random Useless Facts API." (Remove in production.)

**Roman Empire Fact** (`id="roman"`)
- Header orange `#ff8a3d` (same token as History), icon temple (`<path d="M3 21h18M5 21V9M19 21V9M9 21V9M15 21V9M3 9h18L12 3z"/>`), title "ROMAN EMPIRE FACT", badge "ROME".
- Body: pill "ROME FACT" (ink, orange text), fact text 20px weight 800 line-height 1.3, link button "Read more on Wikipedia" (white, 3px ink border, radius 999, min-height 44, `align-self:flex-start`), footnote "Sample fact, to be replaced by the curated list (one per day)." (Remove in production.)
- Sample: "The Pantheon in Rome has a concrete dome, finished almost 1,900 years ago, that is still the largest of its kind without steel bars inside." (Unverified by me beyond general knowledge, check before shipping.)

**Chess Puzzle** (`id="chess"`)
- Header purple `#b79cf2`, icon chess pawn (`<path d="M9 3h6M12 3v3M8 21h8M9 21c0-4 1-6 3-8-2-1-3-3-3-5h6c0 2-1 4-3 5 2 2 3 4 3 8"/>`), title "CHESS PUZZLE", badge "DAILY".
- Body, top row: flex, wrap, gap 8. Pill "[WHITE] TO MOVE" (ink background, purple text; the side comes from the FEN) and a white chip with the puzzle title.
- Board: square SVG, `width:100%`, viewBox 320x320, border 3px ink, radius 10. Light squares `#ffe5a0`, dark squares `#b79cf2`. Pieces in the mockup are Unicode glyphs in the starting position, as a placeholder only. In production, draw the board from the puzzle FEN with a chess board library (pick one and check its license) or an SVG you generate. Do not hotlink the puzzle `image` URL without checking Chess.com terms.
- Buttons, wrapping row, 44px pills: "Solve on Chess.com" (ink, yellow text, links to the puzzle page) and "Hint" (white). Hint behavior is not designed.
- Footnote: "Sample position (the starting position). The live board is drawn from the puzzle's FEN. Puzzle source: Chess.com daily puzzle." (Remove the sample wording in production, keep the attribution.)
- Decision: the puzzle is solved on Chess.com. Our page only shows the position and links out, with no play or solution checking on our side. Not designed: what Hint does, and difficulty by weekday (Chess.com says its daily puzzles get harder through the week).

**Scientist Born Today** (`id="scientist"`) (conditional)
- Rendered only when a notable scientist was born on today's date. If there is none, the card is not rendered and no empty state or placeholder is shown.
- Header teal `#3ddbc0`, icon flask (`<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>`), title "BORN TODAY", badge "SCIENTIST".
- Body: row with a 64px circular portrait slot (border 3px ink, background `#c8f5ec`) and, beside it, the name (Lilita One 22px) and a line "[Field] · born [year], [country]" (14px weight 800). Below, a 1 to 2 sentence blurb (16px weight 800) and the "Read more on Wikipedia" button. The mockup shows placeholders in brackets.
- Portrait is optional. Image licensing per file is unchecked (see data sources). If none is available, show initials or an icon.
- Because the card appears on some days only, the page height varies and the mission progress is unaffected.

### Footer and grass strip
- Footer text: centered, 13px, padding `4px 8px 0`: "History data: Wikimedia On this day (CC BY-SA). News: RSS feeds from the sources shown." Update the news clause to match the real news source.
- Grass strip: SVG at the very bottom, bleeding to the edges (`width: calc(100% + 32px); margin: auto -16px 0; display:block`, the auto top margin pushes it to the bottom of the container), decorative.

```html
<svg viewBox="0 0 360 30" width="calc(100% + 32px)" height="auto" style="display:block;margin:auto -16px 0" aria-hidden="true">
  <path d="M0 14Q15 2 30 14T60 14T90 14T120 14T150 14T180 14T210 14T240 14T270 14T300 14T330 14T360 14V30H0Z" fill="#4cc24e" stroke="#111" stroke-width="3"/>
</svg>
```

### Links
`a` color ink, hover `#333`. Chips and tiles have no underline. "Read the story" uses the default link style at weight 800.

---

## 5. Behavior

The mockup is static except for the anchor jumps from the quest tiles. Everything else here is proposed.

| Element | Proposed behavior |
|---|---|
| Quest tiles | Smooth-scroll to the section (anchors are in the mockup) |
| Tile check circles, progress bar, "N of 4 done" | The mockup shows 0 of 4. Proposed: a tile becomes checked when the section is opened, scrolled into view, or tapped. The label and segments update. Decide the rule |
| Streak chip | Number is a placeholder. Proposed: count of consecutive days with at least one tile checked. Decide the rule and where it is stored |
| History tabs | Switch the list between events, births and deaths. Use buttons with `aria-pressed`, not links |
| News filter chips | Filter the list by category. Buttons with `aria-pressed` |
| Menu button | Destination undecided. Settings or parent controls |
| "Read the story" | Opens the article, ideally in the same tab with a back path |
| Textarea | Local only, or saved to the device. Decide whether answers persist |
| Bonus Round cards | One item per card per day. Fetch on the server, cache for the day, apply a content check before showing. No "next" button is designed |

Use real buttons for tabs and filters. The mockup uses link elements as visual stand-ins.

### States (proposed, not designed)
- Loading: skeleton blocks or a short loading line inside each card.
- Error: a plain message inside the card, for example "Could not load today's history. Try again later." The page must still render if one section fails.
- Empty: for news filters with no results.
- Mission progress: design a completed state (4 of 4) for the tiles, the bar and the label.

---

## 6. Data sources

None of these were fetched or tested. Verify each before wiring it in.

| Section | Source | Notes |
|---|---|---|
| Today in History | Wikimedia Feed API | `https://en.wikipedia.org/api/rest_v1/feed/onthisday/{events|births|deaths}/{MM}/{DD}`. Free, no key. Month and day must be zero-padded. Send a descriptive User-Agent with contact info. CC BY-SA, so attribution is required. Fetch once a day and cache |
| History fallbacks | byabbe.se, ZenQuotes | Wikipedia re-wrappers. byabbe: `https://byabbe.se/on-this-day/{month}/{day}/events.json`. ZenQuotes: `https://today.zenquotes.io/api/[month]/[day]`. Limits not confirmed |
| Term of the Day | Own curated list | No ready-made feed found. Each entry: term, category, plain definition, worked example, why it matters. Rotate Math, Statistics, Technology. Optional detail link from Wikipedia's REST article summary endpoint |
| Think About It | Own curated list | Same card format. Optional "go deeper" links: Stanford Encyclopedia of Philosophy RSS `https://plato.stanford.edu/rss/sep.xml` and Internet Encyclopedia of Philosophy RSS `https://iep.utm.edu/feed/` (both scholarly, announce new entries only) |
| News Feed | Project owner's own source | Not covered here |
| Useless Fact (Bonus Round) | Random Useless Facts API | Base URL `https://uselessfacts.jsph.pl`. No auth required. One source says facts can be requested in English or German. Kid-appropriateness not verified |
| Roman Empire Fact | Curated `roman-facts.json` (static, committed to the repo) | One entry per day, picked by day of year. Each entry carries a Wikipedia link. Drafted with Claude and reviewed by the owner before launch. Wikipedia text is CC BY-SA |
| Chess Puzzle | Chess.com Published-Data API, `GET https://api.chess.com/pub/puzzle` | Public, read-only, no key. Fields include `fen`, `pgn`, `image`, `publish_time`. Send a descriptive User-Agent with contact info, cache the daily response (ETag / If-None-Match), avoid parallel calls (429 reported). Chess.com says its daily puzzles get harder through the week. Terms of use for reuse and for the hosted `image` were not found, so check them and keep the Chess.com attribution and link |
| Scientist Born Today | Build-time script over Wikidata, output `scientists.json` keyed `MM-DD` | Optional per day. Query not tested yet. Owner reviews the output. Portraits from Wikimedia Commons have per-image licenses, unchecked |
| Optional vocabulary | Merriam-Webster word of the day | RSS `https://www.merriam-webster.com/wotd/feed/rss2`. General vocabulary, not math or tech |

### Data risks
- Wikimedia has had endpoint outages and path changes before. Cache and handle failures.
- Wikipedia definitions are written for adults. Use them as detail, not as card text.
- Keep the CC BY-SA attribution wherever Wikipedia-derived text appears.
- The Useless Fact comes from a third-party public API we do not control and could not verify as child-safe. Add a blocklist or review step, cache one item per day, and keep a fallback list in case the API is down. Roman facts and scientists are curated static files and reviewed before launch.
- No database. Content is static JSON in the repo, API pulls are cached daily with HTTP cache headers, and streak and answers use `localStorage`. This is a project decision, not a placeholder.

---

## 7. Accessibility

- Real links and buttons, a labelled textarea, decorative SVG hidden from assistive tech.
- Menu button has an accessible name.
- All tap targets at least 44px (quest tiles are 92px tall).
- Text is ink on light or mid-tone fills, or white, teal and yellow on the ink hero. The textures are faint enough not to affect contrast, but re-check with real rendering.
- The tile check circles are decorative in the mockup. If they become functional, expose their state to assistive tech (for example a real checkbox or a button with `aria-pressed`) and keep the "N of 4 done" text as the readable status.

---

## 8. Open questions

1. One scrolling page, or separate screens or tabs per section?
2. Larger-screen (desktop) layout needed? Current design is phone only.
3. What does the menu button open?
4. Should "What is your take?" answers be saved, and where?
5. Who maintains the term and concept lists, and how many entries are needed?
6. Should the Daily Mission progress and streak be functional? If so, what counts as "done" for a section, what resets the streak, and where is progress stored?
7. Should the Bonus Round have a "show me another" button, or is one item per card per day enough?
8. Should the Bonus Round count toward the mission (making it 6 of 6), or stay optional as designed?
