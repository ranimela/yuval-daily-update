# Daily Dose: frontend developer handoff (v2)

A mobile-first daily-update web page for an 11-year-old. One scrolling page, single column, flat-cartoon look (original style: no characters, logos or show names).

- **Design mockup (live):** https://claude.ai/artifact/1BwMrWyo2ibbTQrHbC82Mg
- **Mockup frame:** 390px wide, static. Everything marked "Proposed" below is NOT in the mockup and needs a decision.
- v2 adds: sunburst hero and fuller skyline, section icons, halftone header texture, dotted sky, numbered news cards, sticker term, speech-bubble question, sticky nav, grass footer strip.

---

## 1. Page sections

Order, top to bottom: Header, Section nav (sticky), Hero, Today in History, News Feed, Term of the Day, Think About It, Footer, grass strip.

---

## 2. Design tokens

### Colors

| Token | Hex | Use |
|---|---|---|
| ink | `#111111` | All text, all borders, all hard shadows |
| sky (tweakable) | `#9fd8f0` | Page background. Alternatives: `#ffe5a0`, `#c9f2c7`, `#ffc9de` |
| yellow | `#ffd23f` | Logo badge, hero card, example boxes, source pills, active-chip text on ink |
| sunburst light | `#ffe58a` | Alternate ray color in the hero |
| orange | `#ff8a3d` | History header and nav chip, year-badge shadow, skyline door and sun |
| red | `#ff595e` | News header, News nav chip |
| purple | `#b79cf2` | Term header, term sticker, Term nav chip |
| teal | `#3ddbc0` | Think header, Think nav chip |
| bubble teal | `#c8f5ec` | Speech bubble background |
| white | `#ffffff` | Cards, inactive chips, menu button, icon circles |
| news card gray | `#f7f7f7` | News article cards |
| grass | `#4cc24e` | Skyline ground, footer strip |
| roof red | `#c1121f` | Skyline roof |
| roof purple | `#7b2cbf` | Skyline second roof |
| house blue | `#9fd8f0` | Skyline second house, window |
| tree green | `#2a9d3f` | Skyline tree crown and bush |
| trunk brown | `#8d5524` | Skyline tree trunk |

Text is always ink on colored fills. White or yellow text appears only on ink pills and circles.

### Textures

- **Page background:** sky color plus dots: `background-image: radial-gradient(rgba(255,255,255,0.5) 2px, transparent 2px); background-size: 18px 18px;`
- **Section headers:** header color plus halftone: `background-image: radial-gradient(rgba(0,0,0,0.13) 1.5px, transparent 1.5px); background-size: 9px 9px;`
- **Hero:** sunburst: `background: #ffd23f; background-image: repeating-conic-gradient(from 0deg at 26% 42%, #ffd23f 0deg 9deg, #ffe58a 9deg 18deg);`

### Typography

- Headings and display: **Lilita One** (Google Fonts), weight 400, uppercase.
- Body: **Nunito**, weights 600 (body) and 800 (labels, links, chips).
- Google Fonts link: `https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@600;800&display=swap`
- Base: Nunito 600, 16px, line-height 1.45, color ink.

| Role | Font | Size | Notes |
|---|---|---|---|
| Hero date | Lilita One | 80px | line-height 0.95, `text-shadow: 4px 4px 0 #fff` |
| Hero weekday | Lilita One | 22px | letter-spacing 2px, `text-shadow: 2px 2px 0 #fff` |
| Term name | Lilita One | 48px | line-height 1.1 |
| Concept title | Lilita One | 36px | line-height 1.05 |
| Logo | Lilita One | 30px | line-height 1, letter-spacing 1px |
| Section title | Lilita One | 25px | letter-spacing 1px |
| Year badge | Lilita One | 22px | |
| News number | Lilita One | 17px | |
| Intro / definition text | Nunito 600 | 18px | |
| Story headline | Nunito 800 | 18px | line-height 1.25 |
| Small text, notes, meta | Nunito 600 / 800 | 13px | |
| Section badge | Nunito 800 | 14px | |
| Example label | Nunito 800 | 13px | uppercase, letter-spacing 1px |

### Shape

| Element | Border | Radius | Shadow |
|---|---|---|---|
| Section cards, hero | 4px ink | 20px | `6px 6px 0 #111` |
| Logo badge | 4px ink | 16px | `4px 4px 0 #111` |
| Menu button | 4px ink | 50% (48x48) | `3px 3px 0 #111` |
| Nav chips | 3px ink | 999px | `3px 3px 0 #111` |
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

- Page background: sky color with dots, minimum height fills the page.
- Container: `max-width: 480px; margin: 0 auto; padding: 16px 16px 0;` flex column, `gap: 20px`. Bottom padding is 0 so the grass strip sits at the page bottom.
- On screens wider than 480px the column stays centered and the sky color fills the rest. (Larger-screen layout is not designed.)
- All tap targets at least 44px tall.
- Page basics: `html { scroll-behavior: smooth }`, `section { scroll-margin-top: 76px }` (clears the sticky nav).

### Header
Flex row, space-between, centered, gap 12.
- Left: logo badge. Yellow background, border 4px, radius 16, padding `6px 14px`, `transform: rotate(-2deg)`. Text "DAILY DOSE" (30px) and "for [NAME]" (13px, weight 800).
- Right: 48px circle menu button, white, three-line icon (22px SVG, stroke 3, round caps, ink). Accessible name: "Settings".

### Section nav (sticky)
`position: sticky; top: 0; z-index: 5; background-color: <sky>; margin: 0 -16px; padding: 8px 16px 10px; display: flex; gap: 10px; overflow-x: auto;`
Chips: `flex:none; min-height:44px; padding:0 18px; white-space:nowrap; text-decoration:none; font-weight:800.`

| Label | Color | Anchor |
|---|---|---|
| History | orange | `#history` |
| News | red | `#news` |
| Term of the day | purple | `#term` |
| Think about it | teal | `#think` |

### Hero card (sunburst)
- Inner padding `20px 20px 4px`.
- "SATURDAY" (22px, letter-spacing 2px), "NOV 21" (80px), greeting paragraph `margin:12px 0 0; font-size:18px; font-weight:800`: "Good morning, [NAME]! Four things to get your brain going."
- Skyline SVG below, full width, display block, decorative (`aria-hidden`).

Skyline SVG source:

```html
<svg viewBox="0 0 358 96" width="100%" height="auto" style="display:block" aria-hidden="true">
  <g fill="none" stroke="#111" stroke-width="6" stroke-linecap="round">
    <path d="M246 22h50"/><path d="M256 14h26"/>
    <path d="M92 20h40"/><path d="M100 12h20"/>
  </g>
  <g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
    <path d="M246 22h50"/><path d="M256 14h26"/>
    <path d="M92 20h40"/><path d="M100 12h20"/>
  </g>
  <g stroke="#111" stroke-width="3" stroke-linejoin="round">
    <circle cx="322" cy="26" r="15" fill="#ff8a3d"/>
  </g>
  <rect x="0" y="74" width="358" height="22" fill="#4cc24e" stroke="#111" stroke-width="3"/>
  <g stroke="#111" stroke-width="3" stroke-linejoin="round">
    <rect x="68" y="24" width="9" height="16" fill="#fff"/>
    <rect x="26" y="44" width="58" height="30" fill="#fff"/>
    <polygon points="20,44 55,16 90,44" fill="#c1121f"/>
    <rect x="46" y="54" width="13" height="20" fill="#ff8a3d"/>
    <rect x="65" y="52" width="12" height="11" fill="#9fd8f0"/>
  </g>
  <g stroke="#111" stroke-width="2" fill="#fff">
    <rect x="104" y="58" width="5" height="16"/><rect x="114" y="58" width="5" height="16"/>
    <rect x="124" y="58" width="5" height="16"/><rect x="134" y="58" width="5" height="16"/>
  </g>
  <g stroke="#111" stroke-width="3" stroke-linejoin="round">
    <rect x="164" y="52" width="9" height="22" fill="#8d5524"/>
    <circle cx="168" cy="42" r="19" fill="#2a9d3f"/>
    <ellipse cx="214" cy="68" rx="15" ry="10" fill="#2a9d3f"/>
    <rect x="246" y="42" width="60" height="32" fill="#9fd8f0"/>
    <polygon points="240,42 276,14 312,42" fill="#7b2cbf"/>
    <rect x="270" y="54" width="13" height="20" fill="#fff"/>
    <rect x="253" y="50" width="11" height="11" fill="#ffd23f"/>
    <rect x="289" y="50" width="11" height="11" fill="#ffd23f"/>
  </g>
</svg>
```

(The clouds are drawn as thick ink lines with a thinner white line on top.)

### Section card pattern (History, News, Term, Think)
- Card: white, border 4px, radius 20, shadow 6px, `overflow:hidden`.
- Header: section color plus halftone, `border-bottom: 4px solid #111`, padding 12, flex row, space-between, centered, `flex-wrap: wrap`, gap 8. Left group: flex, centered, gap 8, `min-width:0`, containing a 38px white icon circle (3px ink border, 20px stroke icon, stroke width 2.5, round caps and joins) and the `h2` (margin 0, Lilita One 25px, letter-spacing 1px, weight 400). Right: badge (ink background, radius 999, padding `2px 12px`, 14px weight 800).
- On narrow phones the badge may wrap onto its own line. Accepted.
- Body: padding 16, flex column, gap 14.

Section icons (24x24 viewBox, `fill="none"`, `stroke="#111"`):

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

### Footer and grass strip
- Footer text: centered, 13px, padding `4px 8px 0`: "History data: Wikimedia On this day (CC BY-SA). News: RSS feeds from the sources shown." Update the news clause to match the real news source.
- Grass strip: SVG at the very bottom, bleeding to the edges (`width: calc(100% + 32px); margin: 0 -16px; display:block`), decorative.

```html
<svg viewBox="0 0 360 30" width="calc(100% + 32px)" height="auto" style="display:block;margin:0 -16px" aria-hidden="true">
  <path d="M0 14Q15 2 30 14T60 14T90 14T120 14T150 14T180 14T210 14T240 14T270 14T300 14T330 14T360 14V30H0Z" fill="#4cc24e" stroke="#111" stroke-width="3"/>
</svg>
```

### Links
`a` color ink, hover `#333`. Nav and chips have no underline. "Read the story" uses the default link style at weight 800.

---

## 5. Behavior

The mockup is static except for the sticky nav and anchor scrolling. Everything else here is proposed.

| Element | Proposed behavior |
|---|---|
| Nav chips | Smooth-scroll to the section (anchors are in the mockup) |
| History tabs | Switch the list between events, births and deaths. Use buttons with `aria-pressed`, not links |
| News filter chips | Filter the list by category. Buttons with `aria-pressed` |
| Menu button | Destination undecided. Settings or parent controls |
| "Read the story" | Opens the article, ideally in the same tab with a back path |
| Textarea | Local only, or saved to the device. Decide whether answers persist |

Use real buttons for tabs and filters. The mockup uses link elements as visual stand-ins.

### States (proposed, not designed)
- Loading: skeleton blocks or a short loading line inside each card.
- Error: a plain message inside the card, for example "Could not load today's history. Try again later." The page must still render if one section fails.
- Empty: for news filters with no results.

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
| Optional vocabulary | Merriam-Webster word of the day | RSS `https://www.merriam-webster.com/wotd/feed/rss2`. General vocabulary, not math or tech |

### Data risks
- Wikimedia has had endpoint outages and path changes before. Cache and handle failures.
- Wikipedia definitions are written for adults. Use them as detail, not as card text.
- Keep the CC BY-SA attribution wherever Wikipedia-derived text appears.

---

## 7. Accessibility

- Real links and buttons, a labelled textarea, decorative SVG hidden from assistive tech.
- Menu button has an accessible name.
- All tap targets at least 44px.
- Text is ink on light or mid-tone fills, or light text on ink. The halftone and sky dots are faint enough not to affect contrast, but re-check with real rendering.
- Sticky nav: make sure focus is not hidden behind it when tabbing (the `scroll-margin-top: 76px` on sections handles anchor jumps).

---

## 8. Open questions

1. One scrolling page, or separate screens or tabs per section?
2. Larger-screen (desktop) layout needed? Current design is phone only.
3. What does the menu button open?
4. Should "What is your take?" answers be saved, and where?
5. Who maintains the term and concept lists, and how many entries are needed?
6. Is the sticky nav wanted, or should the nav scroll away with the header?
