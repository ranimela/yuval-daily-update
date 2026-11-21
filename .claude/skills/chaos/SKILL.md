---
name: chaos
description: Adversarial review of a high_risk spec in an isolated subagent, max 2 rounds. Run only when the user types /chaos.
disable-model-invocation: true
argument-hint: "<feature>"
context: fork
agent: chaos-monkey
---

# /chaos $ARGUMENTS
1. Resolve the active feature (argument, else the only status file whose state is not `shipped`; if several, report that and stop).
2. Require `high_risk: true` and state `planned`. Otherwise say why it is not needed or not ready, and stop.
3. Follow your role rule (P0/P1/P2, max 2 rounds, edit only your own section and the review file).
4. Report back: open P0/P1 remain -> "Next: run /plan to revise, then /chaos again." Otherwise "Next: run /approve."
