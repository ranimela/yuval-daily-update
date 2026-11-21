---
paths:
  - "tests/**"
---

- Tests use fixtures or temp copies. Never write to or delete the user's real data files.
- Never read `.env`. Use `.env.test` or values the user supplies.
- No live external services with write access.
