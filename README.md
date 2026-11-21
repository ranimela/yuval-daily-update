# Yuval Daily Update

A password-protected daily digest webpage (`yuval.melameds.net`) displaying Western history events (Wikimedia Feed API & ZenQuotes OnThisDay) and continuous public news headlines (`haaretz.co.il`).

## Setup
1. Install Node.js 20+ and npm dependencies:
   ```powershell
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values.
3. Initialize the Neon Postgres schema by running `src/lib/db/schema.sql` in your Neon SQL Editor (or `psql $DATABASE_URL -f src/lib/db/schema.sql`).

## Run
- Local dev server: `npm run dev` (opens at `http://localhost:3000`)
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Unit & mocked integration tests: `npm test`
- Production build: `npm run build`
- Export DB snapshot to `.backup/`: `npm run db:backup`

## Configuration
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `APP_PASSWORD` | Shared login password for the site |
| `SESSION_SECRET` | Random secret (>= 32 chars) for HMAC-SHA256 session cookies |
| `CRON_SECRET` | Bearer token protecting `/api/cron/history` and `/api/cron/news` |
| `HAARETZ_RSS_URL` | Optional override URL for Haaretz public RSS feed |

## Notes
- Hosted on Vercel Hobby (free tier) with Neon Postgres free tier.
- Vercel Cron triggers `/api/cron/history` daily at `04:00 UTC`; `/api/feed` also refreshes Haaretz on a 15-minute atomic DB lease.
