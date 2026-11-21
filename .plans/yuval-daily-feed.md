# Implementation Specification: Yuval Daily Feed (`yuval-daily-feed`)

## Summary for Approval
- **What this builds:** A password-protected Next.js web app (`yuval.melameds.net`) backed by Neon Postgres with two isolated sections: "Today's events in history" (~10 Europe/US/Israel items at 07:00) and "News update" (latest 15 public `haaretz.co.il` headlines).
- **What could break:** `haaretz.co.il` may block cloud IPs with Cloudflare `403`, and deterministic keyword filtering for Western history may miss or misclassify edge-case events.
- **Decisions needed from you:** Confirm whether you want Haaretz refreshed on-demand (15-min cache TTL when Yuval opens the page) or via an external GitHub Actions cron (every 30 mins on a private repo to stay within 2,000 free mins/month).

---

## Goal & Non-Goals
**Goal:** Deliver a private, password-gated daily update webpage for Yuval at `yuval.melameds.net` displaying curated historical events and continuous public news updates, styled per `createspace-DESIGN.md` on Vercel's 100% free tier with Neon Postgres.

**Non-Goals (from PRD):**
- Bypassing `haaretz.co.il` subscriber paywalls or scraping restricted full-article text.
- Multi-user accounts, roles, or per-user profiles (single shared password only).
- Rigid adherence to `createspace-DESIGN.md` where it conflicts with readable daily feed layout or Hebrew/English directionality.
- Notifications, search, saved favorites, or an admin UI for managing sources in v1.

---

## Architectural Overview
The system enforces strict three-layer isolation:
1. **Ingestion Layer (`src/lib/ingestion/`):** Independent adapters for Wikimedia/ZenQuotes (`history_events`) and Haaretz (`news_update`). Each adapter fetches, strips HTML, decodes HTML entities, validates URLs, applies filtering/caps, and writes to Neon Postgres. Wikimedia and ZenQuotes run via `Promise.allSettled` so one failure does not drop the other. Failures update `source_health` without deleting prior cached items, and ingestion prunes `feed_items` older than 7 days.
2. **Data Store Layer (`src/lib/db/` — Neon Postgres):** Single source of truth with three tables (`feed_items`, `source_health` with atomic `lease_until` locking, and `login_attempts` for brute-force rate limiting). Tests run strictly against mocked DB/HTTP fixtures—never production Neon.
3. **Presentation & Auth Layer (`src/app/`, `src/middleware.ts`):**
   - `src/lib/auth.ts` uses Web Crypto (`crypto.subtle`) exclusively so HMAC-SHA256 verification works identically in Edge Middleware and Node Server Components/API routes, failing closed if `SESSION_SECRET` (<32 chars) or `CRON_SECRET` is missing.
   - `middleware.ts`, `src/app/page.tsx`, and `/api/feed` all verify the signed HTTP-only session cookie before any page or data is served (defense-in-depth). `/api/auth/login` enforces rate limiting (max 5 failed attempts per 15 minutes).
   - `src/app/page.tsx` reads normalized items by `category` (`history_events` in LTR, `news_update` in RTL), never by source name.
   - Haaretz "continuous" refresh uses an atomic DB-leased **15-minute TTL pull-through check** on authenticated `/api/feed` reads (4.5s interactive timeout, serving cached rows on timeout), plus a `CRON_SECRET`-protected `/api/cron/news` endpoint. History runs daily at `04:00 UTC` via Vercel Cron (`/api/cron/history`) with a lease-guarded on-demand fallback if today's `editionDate` has 0 rows.

---

## Immutable Data Contracts

```typescript
export type FeedCategory = "history_events" | "news_update";
export type LanguageDirection = "ltr" | "rtl";
export type SourceStatus = "ok" | "degraded" | "failed";

export interface FeedItem {
  id: string;                 // SHA-256 of `${sourceId}:${canonicalKey}`
  sourceId: string;           // e.g. "wikimedia", "zenquotes", "haaretz"
  sourceLabel: string;        // e.g. "Wikimedia", "ZenQuotes", "Haaretz"
  category: FeedCategory;
  language: "en" | "he";
  direction: LanguageDirection;
  title: string;              // Plain text, max 240 chars, HTML stripped
  summary: string;            // Plain text, max 500 chars, HTML stripped
  externalUrl: string | null; // Strict http/https only
  year: number | null;        // For history_events
  publishedAt: string;        // ISO-8601 UTC
  ingestedAt: string;         // ISO-8601 UTC
  editionDate: string;        // YYYY-MM-DD in Asia/Jerusalem
}

export interface SourceHealth {
  sourceId: string;
  category: FeedCategory;
  status: SourceStatus;
  lastSuccessAt: string | null;
  lastError: string | null;   // Sanitized message, never secrets/stack
  updatedAt: string;
}

export interface FeedResponse {
  editionDate: string;
  historyEvents: FeedItem[];
  newsUpdates: FeedItem[];
  health: SourceHealth[];
}
```

---

## Affected Files
- **New Application & Config Files:**
  - `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `vercel.json`, `vitest.config.ts`
  - `.env.example` (lists `DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, `CRON_SECRET` with empty values)
  - `src/lib/contracts.ts`, `src/lib/sanitize.ts`, `src/lib/logger.ts`
  - `src/lib/db/client.ts`, `src/lib/db/schema.sql`, `src/lib/db/repository.ts`
  - `src/lib/auth.ts`, `src/middleware.ts`
  - `src/lib/ingestion/history.ts`, `src/lib/ingestion/news.ts`, `src/lib/ingestion/westernFilter.ts`
  - `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/login/page.tsx`
  - `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`
  - `src/app/api/feed/route.ts`, `src/app/api/cron/history/route.ts`, `src/app/api/cron/news/route.ts`
  - `src/components/HistorySection.tsx`, `src/components/NewsSection.tsx`, `src/components/PasswordForm.tsx`
- **New Test Files:**
  - `tests/sanitize.test.ts`, `tests/auth.test.ts`, `tests/historyIngestion.test.ts`, `tests/newsIngestion.test.ts`, `tests/feedApi.test.ts`
- **Updated Docs:** `README.md`, `.gitignore`
- **Pristine / Untouched:** `.agents/`, `.plans/prd.md`, `createspace-DESIGN.md`

---

## Logging & Observability
- **Mode:** Structured JSON logs with `timestamp`, `level`, `correlationId`, `module`, and `message` (required because ingestion runs unattended via cron/TTL and has multi-step external fetches).
- **Guardrails:** Never log `APP_PASSWORD`, `SESSION_SECRET`, `CRON_SECRET`, `DATABASE_URL`, or raw cookie headers. On exceptions, log sanitized error message + stack trace; never silently swallow errors.

---

## Step-by-Step Micro-Tasks

1. **Task 1 — Project Scaffolding, Env Contract & Neon Schema** *(AC-6)*
   - Initialize Next.js (TypeScript, App Router, Tailwind CSS) and Vitest in `package.json`.
   - Create `.env.example` (`DATABASE_URL=`, `APP_PASSWORD=`, `SESSION_SECRET=`, `CRON_SECRET=`) and update `.gitignore` for `.env`, `.next`, `node_modules`, `/.backup/`.
   - Create `src/lib/db/schema.sql` (`feed_items`, `source_health` with `lease_until`, and `login_attempts`), `src/lib/db/client.ts`, `repository.ts` (including atomic `acquireRefreshLease`, `pruneOldFeedItems(7)`), and a local backup/export helper to `/.backup/`.

2. **Task 2 — Immutable Data Contracts, Sanitization & Structured Logger** *(AC-3, AC-4, AC-5)*
   - Create `src/lib/contracts.ts` with the exact interfaces above.
   - Create `src/lib/sanitize.ts` (strip HTML tags, decode HTML entities like `&quot;`/`&#39;`/`&nbsp;`/numeric refs, enforce `http:`/`https:` URLs only, truncate lengths).
   - Create `src/lib/logger.ts` emitting structured JSON logs with `correlationId`.

3. **Task 3 — Password Auth Gate & Middleware** *(AC-1, AC-2)*
   - Create `src/lib/auth.ts` using Web Crypto (`crypto.subtle`) exclusively for HMAC-SHA256 signing/verification (Edge + Node compatible), failing closed if `SESSION_SECRET` (<32 chars) or `CRON_SECRET` is unset, and constant-time password/secret comparison.
   - Create `src/middleware.ts` protecting `/` and `/api/feed` (redirecting unauthenticated page requests to `/login`, returning `401` on unauthenticated `/api/feed`).
   - Create `src/app/login/page.tsx`, `/api/auth/login/route.ts` (with Neon-backed rate limiting: max 5 failed attempts per 15-min window; sets `HttpOnly; SameSite=Lax; Path=/` + `Secure` in prod), and `/api/auth/logout/route.ts`.

4. **Task 4 — History Ingestion Adapter (Wikimedia + ZenQuotes)** *(AC-3, AC-5)*
   - Create `src/lib/ingestion/westernFilter.ts` (deterministic Europe, US, and Israel keyword/entity allowlist).
   - Create `src/lib/ingestion/history.ts` fetching Wikimedia REST `onthisday/selected` + `events` and ZenQuotes `today.zenquotes.io/api/{month}/{day}` via `Promise.allSettled` (configurable 4.5s/8s timeout) so one source failure does not drop the other, filtering to ~10 Western history items for `editionDate` (Asia/Jerusalem), deduplicating, upserting into `feed_items` + `source_health`, and pruning items >7 days old.

5. **Task 5 — News Ingestion Adapter (`haaretz.co.il`)** *(AC-4, AC-5)*
   - Create `src/lib/ingestion/news.ts` fetching `haaretz.co.il` public RSS feed(s) with configurable timeout (4.5s interactive, 8s cron) and zero paywall bypass, sanitizing/decoding up to latest 15 `he`/`rtl` items, and upserting into `feed_items` + `source_health`.
   - On `403`/timeout/parse error, record `failed`/`degraded` in `source_health` and preserve existing cached rows.

6. **Task 6 — Feed API, Cron Endpoints & TTL Refresh** *(AC-3, AC-4, AC-5, AC-6)*
   - Create `/api/feed/route.ts` (enforces session verification; reads `history_events` for today + latest 15 `news_update`; acquires atomic DB lease before triggering 4.5s-bounded `news` refresh if >15 mins stale or `history` fallback if today's `editionDate` has 0 rows; returns cached data on timeout).
   - Create `/api/cron/history/route.ts` and `/api/cron/news/route.ts` protected by constant-time `CRON_SECRET` check (failing closed if unset), plus `vercel.json` scheduling `/api/cron/history` daily at `04:00 UTC`.

7. **Task 7 — CreateSpace UI (LTR/RTL) & End-to-End Verification** *(AC-1, AC-2, AC-3, AC-4, AC-5, AC-6)*
   - Configure `createspace-DESIGN.md` tokens in `tailwind.config.ts` and `src/app/layout.tsx` (Poppins, DM Sans, Heebo, Fira Code).
   - Build `src/app/page.tsx` (defense-in-depth session verification), `HistorySection.tsx` (LTR), and `NewsSection.tsx` (RTL) with glassmorphism cards, opaque fallback, and source-health degradation banner.
   - Write Vitest unit/integration tests in `tests/` (including auth rate-limit, Edge Web Crypto, atomic lease stampede guard, `Promise.allSettled` partial failure, and HTML entity decoding) using mocked HTTP/DB fixtures and update `README.md` with local setup and env var docs.

---

## Acceptance Traceability
| AC ID | Micro-Task(s) | Verification Method |
| :--- | :--- | :--- |
| AC-1 | Task 3, Task 7 | Vitest auth/middleware test + unauthenticated `GET /` redirects to `/login`, `GET /api/feed` returns `401`. |
| AC-2 | Task 3, Task 7 | Vitest login test: valid password sets signed HTTP-only cookie and `GET /api/feed` returns `200`. |
| AC-3 | Task 2, Task 4, Task 6, Task 7 | Vitest fixture test on `history.ts` + `westernFilter.ts` returning <=10 Europe/US/Israel items for `editionDate`. |
| AC-4 | Task 2, Task 5, Task 6, Task 7 | Vitest fixture test on `news.ts` returning <=15 sanitized `he`/`rtl` items; UI renders RTL container. |
| AC-5 | Task 2, Task 4, Task 5, Task 6, Task 7 | Vitest failure test: mocked `403`/timeout on Haaretz sets `source_health=failed` while preserving cached items and rendering history normally. |
| AC-6 | Task 1, Task 6, Task 7 | `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` succeed locally with Neon env vars. |

---

## Verification Criteria
- `npx tsc --noEmit` exits `0`.
- `npm run lint` exits `0`.
- `npm test` (Vitest) passes all unit and mocked integration tests in `tests/`.
- `npm run build` (Next.js production build) exits `0`.
- No secrets or hardcoded `"yuval"` password strings in `src/` or `tests/`.

---

## Context Pruning
By default, the Builder should read only:
1. `.plans/yuval-daily-feed.md` (this spec)
2. `.plans/conventions.md`
3. `createspace-DESIGN.md` (only during Task 7)

---

## Failure Modes & Mitigation
*(Appended by Chaos Monkey — Round 1)*

1. **Edge Runtime Auth & Unset Secrets (P0):** `middleware.ts` and `src/lib/auth.ts` must use Web Crypto (`crypto.subtle`) so HMAC-SHA256 verification works identically in Edge Middleware and Node Server Components/API routes. Fail closed if `SESSION_SECRET` (<32 chars) or `CRON_SECRET` is unset. Verify session in both `middleware.ts` and `page.tsx`/`/api/feed`.
2. **Login Brute-Force & Cookie Flags (P0):** `/api/auth/login` must enforce rate limiting (e.g., max 5 failed attempts per 15-minute window tracked in Neon or keyed store) and set `HttpOnly; SameSite=Lax; Path=/` (plus `Secure` in production).
3. **On-Demand TTL Refresh Stampede & 10s Timeout (P1):** `/api/feed` must acquire an atomic DB lease in `source_health` before triggering a Haaretz refresh, cap interactive external fetch timeouts at 4.5s, and return cached items on timeout/failure.
4. **Empty History Day, DST Drift & DB Bloat (P1):** Schedule Vercel Cron at `04:00 UTC` (covers 06:00 IST / 07:00 IDT), add a lease-guarded on-demand fallback in `/api/feed` when today's `editionDate` has 0 history rows, and prune `feed_items` older than 7 days.
5. **Partial Source Failure & Entity Corruption (P1):** Use `Promise.allSettled` for Wikimedia + ZenQuotes so one failure does not drop the other, and decode HTML entities after stripping tags.

