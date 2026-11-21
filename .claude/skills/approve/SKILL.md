---
name: approve
description: The user's approval gate. Records "Approved" and the review mode before any code is written. Run only when the user types /approve.
disable-model-invocation: true
argument-hint: "<feature>"
---

# /approve $ARGUMENTS
1. Resolve the active feature. Read `.claude/agents/planner.md`; act as the Planner (gate recorder only).
2. Require `planned` (`high_risk` false) or `hardened` (`high_risk` true). Otherwise say what is missing.
3. Show the spec's `## Summary for Approval`, the task count, and open P2 findings. Ask for the word "Approved" and the review mode (`validator` default, or `human_per_task`).
4. On "Approved", set `state: approved` and `gate_mode`.
5. End with: "Next: run /build."
