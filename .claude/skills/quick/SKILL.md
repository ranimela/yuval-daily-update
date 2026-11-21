---
name: quick
description: Small change to existing code (max 3 files, no money, personal data, auth, deletion, migration, or new dependency). Skips PRD, interview, and Chaos. Run only when the user types /quick.
disable-model-invocation: true
argument-hint: "<feature> <one-line description>"
---

# /quick $ARGUMENTS
1. Read `.claude/agents/planner.md`; act ONLY as the Planner.
2. Check the quick-lane exclusions in `.claude/rules/pipeline.md`. If any apply, set nothing, say why, send the user to `/pm`.
3. Create `.plans/<feature>.status.json` from the template with `lane: quick`; write the mini-spec to `.plans/<feature>.md` (Goal, Files, Change, Verify). `tasks_total: 1`, state `planned`.
4. Fill only the `EDIT` lines in `conventions.md` that this change needs.
5. End with: "Read the mini-spec, then run /approve."
