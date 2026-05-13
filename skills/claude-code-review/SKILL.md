---
name: claude-code-review
description: Smart all-in-one code review via Claude Code. Automatically detects and reviews security, performance, correctness, architecture, and test coverage issues based on code content.
user-invocable: true
---

# Claude Code Smart Review

All-in-one intelligent code review. Claude Code automatically analyzes the code and determines which review dimensions are relevant — no need to specify focus areas.

## When to use
- After writing or modifying code — get a second opinion
- Before committing — catch issues early
- Reviewing PRs or diffs — structured feedback
- Any code quality check

## How to invoke

```
claude-code-review({
  code: "<source code>",
  filename: "src/auth.ts",
  language: "typescript"
})
```

Or with a diff:
```
claude-code-review({
  diff: "<unified diff>",
  filename: "src/api.ts"
})
```

No `focus` parameter needed — Claude automatically detects relevant review dimensions.

## Auto-detected review dimensions
Claude Code analyzes the code and automatically applies relevant checks:

- **Security** — SQL injection, XSS, auth bypass, hardcoded secrets, data exposure
- **Performance** — Memory leaks, N+1 queries, unnecessary re-renders, algorithmic complexity
- **Correctness** — Logic errors, race conditions, null handling, edge cases, off-by-one
- **Architecture** — Coupling, cohesion, SOLID violations, design pattern misuse
- **Error handling** — Missing error cases, silent failures, recovery paths
- **Test coverage** — Untested paths, weak assertions, missing edge case tests
- **Dependencies** — Outdated/vulnerable packages, unnecessary imports
- **Readability** — Naming, structure, documentation gaps

Not all dimensions apply to every review — Claude focuses on what's relevant.

## Output structure
1. **Summary** — What the code does and which dimensions were reviewed
2. **Issues** — Problems found, ordered by severity (critical → low)
3. **Suggestions** — Improvement recommendations
4. **Verdict** — approve / request changes / needs discussion

## Rules
- Do not auto-fix findings. Present them and ask which to address.
- If the tool returns an error, report it and stop.
- Always include `filename` and `language` when available.
