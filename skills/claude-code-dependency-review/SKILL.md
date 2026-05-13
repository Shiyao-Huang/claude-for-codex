---
name: claude-code-dependency-review
description: Dependency audit. Checks for outdated, vulnerable, or license-incompatible dependencies.
user-invocable: true
---

# Dependency Review

Use this skill to review project dependencies for security, freshness, and license compliance.

## When to use
- Periodic dependency audits
- Before adding new dependencies
- When updating package versions

## How to invoke

```
claude-code-review({
  code: "<package.json contents + any lock file excerpts>",
  filename: "package.json",
  language: "json",
  focus: "dependency audit, security vulnerabilities, outdated packages, license compliance"
})
```

## Checklist

- **Known vulnerabilities** — CVEs in current versions
- **Outdated packages** — Major versions behind
- **Abandoned packages** — No updates in 2+ years
- **License compliance** — GPL/AGPL in proprietary projects
- **Bundle size** — Large dependencies with small usage
- **Duplicate functionality** — Multiple packages doing the same thing
- **Transitive dependencies** — Hidden sub-dependencies
- **Maintenance health** — Issue backlog, contributor count, release frequency

## Output format
Table: package | current version | latest | status | risk | recommendation
