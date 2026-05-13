---
name: claude-code-test-coverage
description: Test coverage review. Identifies missing test scenarios, weak assertions, and untested edge cases.
user-invocable: true
---

# Test Coverage Review

Use this skill to review test quality and identify gaps. Call `claude-code-review` with testing focus.

## When to use
- After writing new code that needs tests
- Reviewing existing test suites
- Before merging PRs with new features

## How to invoke

```
claude-code-review({
  code: "<source code + test code>",
  filename: "src/utils/validator.ts",
  language: "typescript",
  focus: "test coverage, edge cases, boundary conditions, error paths"
})
```

## Checklist

- **Happy path** — Is the main success scenario tested?
- **Error paths** — Are failure modes covered?
- **Boundary conditions** — Empty inputs, max values, null/undefined
- **Type safety** — Invalid types, coercion, unexpected formats
- **Race conditions** — Concurrent access, timeouts, ordering
- **Side effects** — Are external calls properly mocked?
- **Assertions quality** — Do tests assert meaningful things?
- **Test isolation** — Can tests run independently?
- **Missing scenarios** — What's NOT tested that should be?

## Output format
List of untested scenarios with priority (critical/important/nice-to-have) and suggested test cases.
