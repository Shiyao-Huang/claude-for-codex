---
description: Test coverage review via Claude Code
argument-hint: '[file-path]'
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Review test coverage and identify gaps using Claude Code.

## Execution

1. Read the source file and its corresponding test file.
2. Call `claude-code-review` with both source and test code, `focus: "test coverage, edge cases, boundary conditions, error paths, missing scenarios"`
3. Return the review output verbatim.

## Rules
- Do not write tests. Identify gaps and suggest what should be tested.
