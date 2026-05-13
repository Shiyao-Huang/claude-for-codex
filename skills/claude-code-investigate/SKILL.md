---
name: claude-code-investigate
description: Invoke Claude Code to investigate bugs, trace errors, and diagnose root causes.
user-invocable: true
---

# Claude Code Investigate

Use this skill when you need Claude Code to investigate a bug or error.

## When to use
- Debugging a reported error
- Tracing error messages to root cause
- Analyzing crash logs or stack traces
- Investigating unexpected behavior

## How to invoke

```
claude-code-chat({
  message: "Investigate this error and find the root cause:\n\nError: Cannot read properties of undefined (reading 'map')\n  at UserList (src/components/UserList.tsx:42:18)\n  at renderWithHooks (node_modules/react-dom/...)\n\nContext: This happens when navigating to /users after login.",
  systemPrompt: "You are a debugging expert. Follow 4-phase debugging: 1) Investigate (gather facts) 2) Analyze (identify patterns) 3) Hypothesize (form theories) 4) Verify (confirm root cause). Always state evidence, never guess."
})
```

## Investigation framework
1. **Gather facts** — Error message, stack trace, reproduction steps
2. **Identify patterns** — When does it happen? What's consistent?
3. **Form hypotheses** — Top 3 most likely causes
4. **Verify** — Which hypothesis is confirmed by evidence

## Output format
1. **Observed behavior** — What happened
2. **Expected behavior** — What should have happened
3. **Root cause** — The confirmed cause with evidence
4. **Fix recommendation** — Specific, minimal change needed

## Rules
- Never fix without identifying root cause first.
- State what's confirmed vs. hypothesized.
- Include file paths and line numbers.
