---
name: pm
description: Start a feature in the full lane. Interviews the user (questions only), then writes the PRD. Run only when the user types /pm.
disable-model-invocation: true
argument-hint: "<feature>"
---

# /pm $ARGUMENTS
1. Feature name = argument, else ask (kebab-case).
2. Read `.claude/agents/product-manager.md` and act ONLY as that role (in this conversation, no subagent).
3. If `.plans/<feature>.status.json` is missing, create it from `.plans/status.template.json` with `feature`, `lane: full`, `state: prd_drafted`.
4. State `prd_drafted` with an existing PRD: show it and wait. On "PRD approved", set `prd_approved`.
5. Otherwise: questions only, wait, draft `.plans/prd.md`, wait for "PRD approved".
6. End with: "Next: run /plan."
