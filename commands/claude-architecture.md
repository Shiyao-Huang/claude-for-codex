---
description: Architecture review via Claude Code
argument-hint: '[file-path or module]'
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Run an architecture review using Claude Code.

## Execution

1. If `$ARGUMENTS` contains a file path, read it.
2. Call `claude-code-review` with `focus: "architecture, coupling, cohesion, SOLID principles, design patterns, scalability"`
3. Return the review output verbatim.

## Rules
- Do not fix issues. Present findings and ask the user which to address.
