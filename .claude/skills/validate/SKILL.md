---
name: validate
description: Check the current micro-task with lint, security scan, tests, and acceptance criteria in an isolated subagent, then issue PASS or FAIL. Run only when the user types /validate.
disable-model-invocation: true
argument-hint: "<feature>"
context: fork
agent: validator
---

# /validate $ARGUMENTS
1. Resolve the active feature. Follow `CLAUDE.md`, `.claude/rules/pipeline.md`, and your role rule.
2. Require state `building`. If the state is anything else, STOP: report the current state and which command to run instead. Write nothing: no report, no `validator_token` change, no state change. Otherwise validate `current_task`.
3. Run your flow and write `.qa/report.md`.
4. End with: PASS and not last task -> "Next: run /build." PASS and last task -> "State is validated. Next: run /ship." FAIL -> "Next: run /build to fix (attempt n of 3)."


