---
name: claude-code-architecture-review
description: Architecture and design review. Checks coupling, cohesion, SOLID principles, design patterns, and scalability.
user-invocable: true
---

# Architecture Review

Use this skill for architecture and design review. Call `claude-code-review` with architecture-specific framing.

## When to use
- New modules or services
- Refactoring proposals
- Before adding new dependencies
- Code that crosses module boundaries

## How to invoke

```
claude-code-review({
  code: "<the source code>",
  filename: "src/services/order.ts",
  language: "typescript",
  focus: "architecture, coupling, cohesion, SOLID principles, design patterns"
})
```

## Checklist

- **Single Responsibility** — Does each module/class do one thing?
- **Open/Closed** — Can behavior be extended without modification?
- **Dependency Inversion** — Depend on abstractions, not implementations
- **Coupling** — Are modules tightly coupled to each other?
- **Cohesion** — Do related things live together?
- **Abstraction level** — Are abstractions at the right level?
- **Interface design** — Are APIs clean and minimal?
- **Error boundaries** — Are failures contained properly?
- **Scalability** — Will this design scale with requirements?
- **Testability** — Can this code be easily tested?

## Output format
For each issue: principle violated, current state, suggested improvement, trade-off analysis.
