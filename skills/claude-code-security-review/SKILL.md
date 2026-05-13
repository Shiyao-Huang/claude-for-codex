---
name: claude-code-security-review
description: Security-focused code review using Claude Code. Scans for OWASP Top 10 vulnerabilities, injection, auth issues, and data leaks.
user-invocable: true
---

# Security Review

Use this skill for security-focused code review. Call `claude-code-review` with security-specific framing.

## When to use
- Before deploying new code
- When reviewing authentication/authorization code
- After changes to API endpoints or data handling
- Periodic security audits

## How to invoke

```
claude-code-review({
  code: "<the source code>",
  filename: "src/auth.ts",
  language: "typescript",
  focus: "security, authentication, authorization, data leaks, injection"
})
```

## Security checklist

The review covers:
- **Injection** — SQL, command, LDAP, XSS
- **Authentication** — Weak passwords, session handling, token management
- **Authorization** — Missing access controls, privilege escalation
- **Data exposure** — Sensitive data in logs, error messages, responses
- **Cryptographic** — Weak algorithms, hardcoded secrets, improper key management
- **Input validation** — Missing sanitization, type coercion, buffer overflow
- **Dependencies** — Known vulnerable packages, outdated libraries
- **Configuration** — Default credentials, debug mode, CORS settings

## Output format

Each finding includes:
1. **Severity** — Critical / High / Medium / Low
2. **Vulnerability type** — OWASP category
3. **Location** — File and line number
4. **Description** — What's wrong and why
5. **Remediation** — How to fix it

## Rules
- Always include severity rating
- Prioritize critical findings first
- Do not suggest changes that would weaken security further
- If no issues found, confirm explicitly with a "no security issues found" verdict
