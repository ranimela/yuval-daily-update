---
name: ship
description: Final gate. README parity, stage, secret scan, combined diff, wait for "Ship", commit and push the branch. Run only when the user types /ship.
disable-model-invocation: true
argument-hint: "<feature>"
---

# /ship $ARGUMENTS
1. Resolve the active feature. Read `.claude/agents/release-wrangler.md`; act ONLY as that role (in this conversation, because it waits for "Ship").
2. Require `validated` and `validator_token.result == "PASS"`.
3. Follow the Wrangler flow in order: branch, README, stage, secret scan, diff and summary, wait for "Ship", commit, push the branch.
4. Merge or push `main` only if the user explicitly asks in this session.
5. End with the branch name, commit hashes, and any follow-up.
