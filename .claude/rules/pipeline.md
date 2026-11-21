# Pipeline contract

## Lanes (`lane` in the status file)
- `full` (default): `/pm -> /plan (runs /grill-me) -> [/chaos only if high_risk] -> /approve -> /build <-> /validate (per micro-task) -> /ship`
- `quick`: `/quick -> /approve -> /build <-> /validate -> /ship`. Mini-spec with exactly one task. No PRD, no `/grill-me`, no Chaos.
- Quick lane is forbidden (Planner sets `lane: full`, says why, sends the user to `/pm`) when the change touches money, personal data, auth, external write APIs, concurrency, data deletion, migration or overwrite of data, or a data contract; changes more than 3 files; or needs a new dependency.

## Status file: `.plans/<feature>.status.json`
Created from `.plans/status.template.json`. The only handoff channel between agents. Read before acting; update only the fields you own.

States in order: `prd_drafted -> prd_approved -> planned -> hardened -> approved -> building -> validated -> shipped` (plus `blocked`).
- `prd_drafted`, `prd_approved`: full lane only. Quick lane starts at `planned`.
- `hardened`: only when `high_risk` is true. Otherwise `planned -> approved`.
- Chaos loop: open P0/P1 after a round keeps state `planned`; Planner revises; Chaos reviews again (max 2 rounds). Chaos sets `hardened` when no P0/P1 is open, or after round 2 once the user decided on the leftovers.
- Tasks are numbered from 1. Builder sets `current_task` when it starts a task. After the Validator passes it, Builder sets `tasks_done` to that number, `current_task` to the next, `fix_attempts` to 0. Validator sets `validated` when it passes the task where `current_task == tasks_total`.
- Unblocking: the user resolves the reason and tells the blocking agent to resume; that agent restores `blocked.from_state` and clears `blocked`.

`gate_mode`: `validator` (default; Validator gates each task, user reviews one combined diff at `/ship`) or `human_per_task` (Builder halts for the user's approval of each diff).
`validation_mode`: `host` (default) or `docker` (opt-in).

## Ownership
| Artifact / field | Owner |
|---|---|
| status file creation, `feature` | PM (full) or Planner (quick) |
| `.plans/prd.md`, state `prd_drafted` | PM |
| `state: prd_approved` | User, recorded by PM only after "PRD approved" |
| `.plans/<feature>.md`, `planned`, `high_risk`, `tasks_total`, `.plans/conventions.md` answers | Planner |
| `## Failure Modes & Mitigation` section, `<feature>.review.md`, `review_rounds`, `hardened` | Chaos Monkey |
| `state: approved`, `gate_mode` | User, recorded by `/approve` (Planner role) |
| source code, `current_task`, `tasks_done`, `fix_attempts`, `building` | Builder |
| `validator_token`, `.qa/` reports, `validated` | Validator |
| `lane`, `validation_mode` | User (Planner may force `lane: full`; user or Planner may set `docker`) |
| branch, commits, PR text, README/docs parity, `shipped` | Release Wrangler |
| `blocked` | The agent that blocks; cleared by it on the user's "resume" |
