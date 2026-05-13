---
description: Security review via Claude Code
argument-hint: '[file-path]'
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Run a security review using Claude Code.

## Execution

1. If `$ARGUMENTS` contains a file path, read it.
2. Call `claude-code-review` with `focus: "security, authentication, authorization, data leaks, injection, XSS, SQL injection, secrets"`
3. Return the review output verbatim.

## Rules
- Do not fix issues. Present findings and ask the user which to address.
- If the tool returns an error, report it and stop.
