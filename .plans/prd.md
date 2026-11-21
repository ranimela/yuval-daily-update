# PRD: Yuval Daily Feed (`yuval-daily-feed`)

## Problem
The user wants a private, password-protected daily update webpage for his son Yuval at `yuval.melameds.net`. The page must present curated daily content across two distinct sections—historical events for the current date and continuous news updates—using the visual guidelines in `createspace-DESIGN.md` while remaining within Vercel's 100% free tier.

## User & Job-to-be-Done
- **Primary User:** Yuval (the user's son). `[CONFIRMED]`
- **Job-to-be-Done:** User declined to specify a formal job-to-be-done ("no jobs"); inferred use is reading daily curated history and news updates in one place. `[UNVERIFIED]`
- **Current Alternative:** `[UNVERIFIED]` (not provided).

## Success Metric
- User marked formal success metrics as irrelevant. `[UNVERIFIED]`
- Observable baseline for v1 completion: All acceptance criteria (AC-1 through AC-6) pass end-to-end locally and on `yuval.melameds.net` within Vercel free-tier constraints. `[UNVERIFIED]`

## Non-Goals
- Bypassing `haaretz.co.il` subscriber paywalls or scraping restricted full-article text. `[CONFIRMED]`
- Multi-user accounts, roles, or per-user profiles (single shared password only). `[CONFIRMED]`
- Rigid adherence to `createspace-DESIGN.md` where it conflicts with readable daily feed layout or Hebrew/English directionality. `[CONFIRMED]`
- Notifications, search, saved favorites, or an admin UI for managing sources in v1. `[UNVERIFIED]`

## Acceptance Criteria
- **AC-1 (Password Gate):** Given an unauthenticated visitor requests `yuval.melameds.net` or any feed data endpoint, when they have not entered the valid shared password, then access to both the page content and feed data is denied and a password prompt is shown.
- **AC-2 (Authenticated Access):** Given an unauthenticated visitor submits the correct shared password, when verification succeeds, then they are granted access to the daily update page and its two sections.
- **AC-3 (Today's Events in History — Content & Cadence):** Given the daily 07:00 (Asia/Jerusalem) refresh has run using Wikimedia Feed API (`onthisday`) and ZenQuotes OnThisDay, when Yuval views the "Today's events in history" section, then approximately 10 Western-history-related items for the current calendar day are displayed.
- **AC-4 (News Update — Content & Cadence):** Given `haaretz.co.il` public updates are available, when Yuval views the "News update" section, then current public headlines/summaries are displayed in an RTL-friendly layout and reflect continuous/recent updates without paywall circumvention.
- **AC-5 (Resilience on Source Failure):** Given one external source (`haaretz.co.il`, Wikimedia, or ZenQuotes) is unreachable or returns an error, when Yuval loads the page, then the other section still renders normally and previously stored items or a clear stale/unavailable indicator are shown rather than crashing the page.
- **AC-6 (Local-First & Free-Tier Deployment):** Given the application is built locally first, when deployed to Vercel's free tier with Neon DB storage and custom domain `yuval.melameds.net`, then it operates within \$0 hosting/storage limits.

## Assumptions
- `[CONFIRMED]` Feature name assigned as `yuval-daily-feed` (user asked for clarification on naming).
- `[CONFIRMED]` History sources are Wikimedia Feed API (`https://en.wikipedia.org/api/rest_v1/feed/onthisday/{type}/{MM}/{DD}`) and ZenQuotes OnThisDay (`https://today.zenquotes.io/api/[month]/[day]`).
- `[CONFIRMED]` News source is `haaretz.co.il` (publicly accessible content only, continuous updates).
- `[CONFIRMED]` Storage uses Neon DB; hosting uses Vercel 100% free tier with custom domain `yuval.melameds.net`; development starts locally.
- `[UNVERIFIED]` "News update" item count (assumed ~10 or latest feed batch, pending confirmation).
- `[UNVERIFIED]` Retention policy for past days' items (whether yesterday's history/news items are archived or replaced).
- `[UNVERIFIED]` Exact definition/rules for filtering "Western history related" items from Wikimedia and ZenQuotes.
- `[UNVERIFIED]` Whether `haaretz.co.il` exposes an unblocked public RSS/API endpoint from cloud IPs.

## Kill Criteria
- User marked kill criteria as irrelevant. `[UNVERIFIED]`

## Open Questions
1. How should "Western history related" be defined for filtering the ~10 daily history items?
2. How many items should appear in "News update", and should past days be archived or replaced?
3. Does `haaretz.co.il` expose a public RSS feed accessible from Vercel/cloud IPs without WAF blocking?
