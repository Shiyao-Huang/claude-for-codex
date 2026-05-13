---
description: Adversarial deep review via Claude Code
argument-hint: '[file-path]'
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Run an adversarial review that tries to break the code.

## Execution

1. If `$ARGUMENTS` contains a file path, read it.
2. Call `claude-code-review` with `focus: "adversarial: break assumptions, race conditions, partial failure, resource exhaustion, idempotency, rollback safety"`
3. Return the review output verbatim.

## Rules
- The goal is to find what can go wrong, not what's right.
- Do not fix issues. Present attack vectors and ask which to address.
