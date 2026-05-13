---
name: claude-code-pr-review
description: PR review using Claude Code. Analyzes a full diff against a base branch and provides structured review feedback.
user-invocable: true
---

# PR Review

Use this skill to review a full pull request or branch diff with Claude Code.

## When to use
- Before merging a PR
- Reviewing team members' code
- Pre-deployment safety check

## How to invoke

### Review current branch vs main
```
claude-code-review({
  diff: "<output of git diff main...HEAD>",
  focus: "breaking changes, test coverage, API compatibility"
})
```

### Review specific PR changes
```
claude-code-review({
  diff: "<output of git diff base...pr-branch>",
  focus: "correctness, performance, security"
})
```

## Review checklist

The review covers:
1. **Correctness** — Logic errors, edge cases, null handling
2. **Breaking changes** — API contract changes, migration needs
3. **Test coverage** — Missing tests for new behavior
4. **Performance** — N+1 queries, unnecessary loops, memory leaks
5. **Security** — Input validation, auth, data exposure
6. **Readability** — Naming, structure, documentation
7. **Architecture** — Coupling, cohesion, design pattern violations

## Output format

```
## PR Review: <branch> → <base>

### Summary
<1-2 sentence overview of what this PR does>

### Critical Issues (must fix before merge)
- ...

### Suggestions (should fix)
- ...

### Nitpicks (nice to have)
- ...

### Positive
- ...

### Verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION
```

## Rules
- Always provide a clear verdict
- Critical issues must be addressed before merge
- Do not auto-fix issues — present them for the author
- Include file paths and line numbers in findings
