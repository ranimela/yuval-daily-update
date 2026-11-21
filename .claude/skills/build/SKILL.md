---
name: build
description: Implement the next micro-task of the approved spec, or fix a failed one, in an isolated subagent. Run only when the user types /build.
disable-model-invocation: true
argument-hint: "<feature>"
context: fork
agent: builder
---

# /build $ARGUMENTS
1. Resolve the active feature. Follow `CLAUDE.md`, `.claude/rules/pipeline.md`, and your role rule.
2. Require state `approved` or `building`. If the state is anything else, STOP: report the current state and which command to run instead (`validated` or `shipped` means `/ship`). Write nothing: no code, no status change. If the last Validator result is FAIL, fix only what `.qa/report.md` lists.
3. Do the next micro-task, then return the diff with its `Changed:` and `Check:` lines (run `git diff` for the real diff).
4. End with: `gate_mode: validator` -> "Next: run /validate." `human_per_task` -> "Review the diff; reply to approve, then run /validate."
If you cannot proceed, set `blocked` in the status file and say why. You cannot ask the user questions from here.


