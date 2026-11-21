---
name: plan
description: Write the implementation spec (full lane, after the PRD is approved) and set high_risk and tasks_total. Run only when the user types /plan.
disable-model-invocation: true
argument-hint: "<feature>"
---

# /plan $ARGUMENTS
1. Resolve the active feature (see CLAUDE.md). Read `.claude/agents/planner.md` and act ONLY as that role.
2. Full lane: require `prd_approved`, else tell the user to run `/pm`. Fill `EDIT` lines in `.plans/conventions.md` first, run `/grill-me`, then write `.plans/<feature>.md`.
3. State `planned` with open Chaos findings: revise per planner directive 12 instead of starting over.
4. Set `high_risk`, `tasks_total`, state `planned`. If the change must be full lane, say why and send the user to `/pm`.
5. End with: `high_risk` true -> "Next: run /chaos." (it runs isolated). Otherwise "Read the Summary for Approval, then run /approve."
