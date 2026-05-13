---
name: claude-code-adversarial-review
description: Deep adversarial review that challenges assumptions and tries to break the code. Focuses on extreme edge cases, race conditions, and failure recovery.
user-invocable: true
---

# Adversarial Review

Use this skill for deep adversarial review. The goal is to break confidence in the code, not validate it.

## When to use
- Before shipping critical code (auth, payments, data handling)
- When code claims to handle "all edge cases"
- Pre-deployment safety gates

## How to invoke

```
claude-code-review({
  code: "<the source code>",
  filename: "src/payment/processor.ts",
  language: "typescript",
  focus: "adversarial: break assumptions, extreme edge cases, race conditions, failure recovery, idempotency"
})
```

## Attack surface

- **Happy path bias** — Does it only work when everything goes right?
- **Partial failure** — What happens mid-transaction? Is state recoverable?
- **Race conditions** — Concurrent requests, stale state, re-entrancy
- **Resource exhaustion** — What if inputs are 1000x expected size?
- **Dependency failure** — What if DB/Redis/API is slow or down?
- **Data corruption** — Can invalid state propagate silently?
- **Rollback safety** — Can changes be safely reversed?
- **Idempotency** — What if this runs twice? Ten times?
- **Observability gaps** — Would you know if this failed in production?

## Stance
Default to skepticism. Assume the code can fail in subtle, expensive ways until evidence says otherwise. No credit for good intent.

## Output format
Each finding: attack vector, worst-case impact, likelihood, and concrete fix.
