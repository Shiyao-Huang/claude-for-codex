---
name: claude-code-review
description: Invoke Claude Code for expert code review. Use when Codex needs a second opinion on code quality, security, or architecture.
user-invocable: true
---

# Claude Code Review

Use this skill when you need Claude Code to review code that Codex has written or is analyzing.

## When to use
- After Codex generates or modifies code, run claude-code-review for a second opinion
- When you need security, performance, or architecture review
- Before committing large changes

## How to invoke

Call the `claude-code-review` MCP tool with the code or diff to review.

### Review generated code
```
claude-code-review({
  code: "<the source code>",
  filename: "src/auth.ts",
  language: "typescript",
  focus: "security, correctness"
})
```

### Review a diff
```
claude-code-review({
  diff: "<unified diff output>",
  filename: "src/api.ts",
  focus: "breaking changes, test coverage"
})
```

### Focus areas
- `security` — Vulnerabilities, injection risks, auth issues
- `performance` — Bottlenecks, memory leaks, N+1 queries
- `correctness` — Logic errors, edge cases, null handling
- `readability` — Naming, structure, documentation
- `architecture` — Coupling, cohesion, design patterns

## Output structure
Claude Code returns:
1. **Summary** — What the code does
2. **Issues** — Problems found (bugs, security, performance)
3. **Suggestions** — Improvement recommendations
4. **Verdict** — approve / request changes / needs discussion

## Rules
- Do not auto-fix review findings. Present them to the user and ask which to address.
- If the review tool returns an error, report it and stop. Do not improvise a review yourself.
- Always include `filename` and `language` when available for better context.
