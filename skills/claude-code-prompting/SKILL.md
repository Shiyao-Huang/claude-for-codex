---
name: claude-code-prompting
description: Internal guidance for composing effective prompts when calling Claude Code tools from Codex
user-invocable: false
---

# Claude Code Prompting

Use this skill to craft better prompts when invoking Claude Code tools.

## Core rules
- One clear task per Claude Code call. Split unrelated asks into separate calls.
- Provide context: include `filename`, `language`, and `focus` for reviews.
- Be specific about what you want: "check for SQL injection" > "check for security issues".
- Include relevant code snippets rather than describing what the code does.

## Review prompt optimization
For `claude-code-review`:
- Always provide either `code` or `diff` (or both)
- Set `focus` to the most relevant concern area
- Include `language` for syntax-aware analysis
- Use `diff` when reviewing changes; use `code` when reviewing new files

## Chat prompt optimization
For `claude-code-chat`:
- Use `systemPrompt` to set Claude's role and expertise
- Ask focused questions rather than open-ended ones
- Include code context in the `message` when relevant
- Request structured output when you need parseable responses

## Anti-patterns to avoid
- Do not send entire repositories as code. Send only relevant files or diffs.
- Do not ask Claude to "do everything". Break into focused tasks.
- Do not ask for the same review twice with slight rewording.
- Do not use chat when review is the right tool. Use the right tool for the job.
