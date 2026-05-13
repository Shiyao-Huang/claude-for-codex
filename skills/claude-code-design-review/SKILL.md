---
name: claude-code-design-review
description: Invoke Claude Code for architecture and design review — coupling, cohesion, scalability, maintainability.
user-invocable: true
---

# Claude Code Design Review

Use this skill when you need Claude Code to review architecture and design decisions.

## When to use
- Before implementing a new module or service
- When refactoring existing architecture
- Reviewing API design or data models
- Evaluating scalability of a design

## How to invoke

```
claude-code-chat({
  message: "Review the architecture of this module:\n\n<describe or paste architecture/code>",
  systemPrompt: "You are a senior architect. Evaluate: 1) Coupling and cohesion 2) Single responsibility 3) Dependency direction 4) Extensibility 5) Testability 6) Performance implications. Be specific with file/class names."
})
```

## Review criteria
- **Coupling** — Are modules independent? Can they change in isolation?
- **Cohesion** — Does each module have a single clear purpose?
- **Dependency direction** — Do dependencies point inward (stable)?
- **Extensibility** — Can new behavior be added without modification?
- **Testability** — Can components be tested in isolation?
- **Scalability** — Will this design hold under 10x/100x load?

## Output format
1. **Architecture overview** — Current design summary
2. **Strengths** — What's well-designed
3. **Concerns** — Ranked by risk (high → low)
4. **Recommendations** — Specific improvements with tradeoff analysis

## Rules
- Focus on design, not style. No nitpicks.
- Every concern must include a recommendation.
- Acknowledge tradeoffs — there are no perfect designs.
