---
name: grill-me
description: Interview the user on edge cases, data constraints, and dependencies before planning. Questions only. Run when the Planner or the user invokes /grill-me.
disable-model-invocation: true
---

# /grill-me
1. Read `.plans/prd.md` and `.plans/context-map.json` (if present). Ask nothing the PRD or `conventions.md` already answers.
2. Reply with questions ONLY (max 8, grouped): data structures and ownership, external dependencies and rate limits, environment and OS constraints, failure behavior, volume and scale, security and secrets.
3. Blunt. No recommendations and no draft plan until the user answers.
4. After the answers, list the assumptions carried into the plan, each `[CONFIRMED]` or `[UNVERIFIED]`.
