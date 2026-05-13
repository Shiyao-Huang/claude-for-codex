---
name: claude-code-qa
description: Invoke Claude Code for systematic QA testing — exploratory testing, bug hunting, edge case discovery, and regression checking.
user-invocable: true
---

# Claude Code QA

Use this skill when you need Claude Code to systematically test and verify code quality.

## When to use
- After implementing a feature — run QA before shipping
- Before merging a PR — check for regressions
- When investigating reported bugs — reproduce and diagnose
- To verify edge cases and error handling

## How to invoke

```
claude-code-chat({
  message: "Perform systematic QA on the following code changes. Check: 1) Happy path correctness 2) Edge cases 3) Error handling 4) Input validation 5) State management. Code:\n```typescript\n<code here>\n```",
  systemPrompt: "You are a QA engineer. Be thorough, systematic, and specific. Report findings with severity levels (critical/high/medium/low). Include reproduction steps for any bugs found."
})
```

## QA checklist
- Happy path: Does the main use case work?
- Edge cases: Empty inputs, null, undefined, very large values
- Error handling: What happens when things fail?
- Input validation: Are boundaries enforced?
- State management: Side effects, race conditions
- Backwards compatibility: Does existing functionality break?
- Security: Injection, auth bypass, data leaks

## Output format
1. **Test coverage assessment** — What was tested, what wasn't
2. **Findings** — Ordered by severity (critical → low)
3. **Reproduction steps** — For each bug found
4. **Risk assessment** — Overall confidence level

## Rules
- Do not auto-fix findings. Report them and ask which to address.
- Always include reproduction steps for bugs.
- Distinguish between bugs and suggestions.
