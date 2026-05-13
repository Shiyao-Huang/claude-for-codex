---
name: claude-code-review
description: Use Claude Code to perform expert code review on code, diffs, or uncommitted changes
user-invocable: true
---

# Claude Code Review

Use this skill when the user asks for a code review, wants feedback on their code, or says "review this".

## How to Use

Call the `claude-code-review` MCP tool with the appropriate parameters:

### Review uncommitted changes

When the user asks to review their current work:

1. Get the diff: `git diff` (unstaged) and `git diff --cached` (staged)
2. Combine both into the `diff` parameter
3. Set `focus` if the user mentioned specific concerns

### Review a specific file

When the user points to a file:

1. Read the file content
2. Pass it as the `code` parameter
3. Set `filename` and `language` for context

### Review a PR or branch diff

When the user asks to review changes against a branch:

1. Get the diff: `git diff main...HEAD` (or the specified base)
2. Pass the output as the `diff` parameter

## Parameters

| Parameter  | When to use                                          |
|------------|------------------------------------------------------|
| `code`     | Reviewing a complete file or snippet                 |
| `diff`     | Reviewing changes (git diff, uncommitted, PR diff)   |
| `filename` | Always set when reviewing a specific file            |
| `language` | Set when language affects review (e.g., TypeScript)  |
| `focus`    | Set when user mentions specific concerns             |
| `model`    | Override default model (rarely needed)               |

## Output Handling

- Present the review findings in order: Issues > Suggestions > Positive Notes > Verdict
- Preserve severity levels and line references from the review
- Do NOT auto-fix issues found in the review — always ask the user first
- If the review is clean, say so explicitly

## Focus Area Examples

- `security` — Focus on vulnerabilities, injection, auth issues
- `performance` — Focus on bottlenecks, memory leaks, N+1 queries
- `readability` — Focus on naming, structure, documentation
- `correctness` — Focus on logic errors, edge cases, error handling
- `security, performance` — Combine multiple focus areas

## Important

- At least one of `code` or `diff` is required
- The review is read-only — never apply fixes automatically
- For large diffs, the tool handles them; no need to chunk manually
