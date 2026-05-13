---
name: claude-code-performance-review
description: Performance-focused code review. Identifies bottlenecks, memory leaks, N+1 queries, unnecessary re-renders, and algorithmic inefficiencies.
user-invocable: true
---

# Performance Review

Use this skill for performance-focused code review. Call `claude-code-review` with performance-specific framing.

## When to use
- Code that handles large datasets or high traffic
- Database queries and ORM usage
- Loops, recursion, or batch processing
- Frontend rendering and state management
- After optimization work to verify improvements

## How to invoke

```
claude-code-review({
  code: "<the source code>",
  filename: "src/api/users.ts",
  language: "typescript",
  focus: "performance, memory usage, algorithm complexity, database queries"
})
```

## Checklist

### Backend
- **N+1 queries** — Loops making individual DB calls
- **Missing indexes** — Queries on unindexed columns
- **Memory leaks** — Unclosed connections, growing caches, event listeners
- **Blocking I/O** — Synchronous operations in async code
- **Large payloads** — Over-fetching data, missing pagination
- **Algorithm complexity** — O(n²) where O(n) or O(log n) would work
- **Connection pooling** — Missing or misconfigured pools
- **Caching** — Missing cache for frequently accessed data

### Frontend
- **Unnecessary re-renders** — Missing memoization, prop changes
- **Bundle size** — Large imports, tree-shaking issues
- **Layout thrashing** — DOM reads interleaved with writes
- **Image optimization** — Unoptimized images, missing lazy loading
- **Debouncing/throttling** — Missing on scroll/resize/input handlers

## Output format
Each finding: severity, location, description, estimated impact, and fix.
