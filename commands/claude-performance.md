---
description: Performance review via Claude Code
argument-hint: '[file-path]'
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Run a performance review using Claude Code.

## Execution

1. If `$ARGUMENTS` contains a file path, read it.
2. Call `claude-code-review` with `focus: "performance, memory leaks, N+1 queries, algorithm complexity, blocking I/O, unnecessary re-renders"`
3. Return the review output verbatim.

## Rules
- Do not fix issues. Present findings and ask the user which to address.
