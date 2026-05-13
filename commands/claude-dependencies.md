---
description: Dependency audit via Claude Code
argument-hint: ''
allowed-tools: Bash(git:*), Read, Glob, Grep
---

Audit project dependencies using Claude Code.

## Execution

1. Read `package.json` (and `package-lock.json` if available).
2. Call `claude-code-review` with `focus: "dependency audit, security vulnerabilities, outdated packages, license compliance, bundle size"`
3. Return the review output verbatim.

## Rules
- Do not modify package.json. Present findings and recommendations.
