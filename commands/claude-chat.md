---
description: Ask Claude Code a question or get advice
argument-hint: '<question>'
---

Ask Claude Code a question using the claude-code-chat MCP tool.

Raw slash-command arguments:
`$ARGUMENTS`

Execution steps:

1. **Formulate the message** — Use `$ARGUMENTS` as the message for Claude Code
2. **Call the tool** — Invoke `claude-code-chat` with:
   - `message`: the user's question
   - `systemPrompt`: (optional) if the question context suggests a specific role

3. **Present results** — Return Claude Code's response as-is

Use cases:
- Architecture advice
- Code explanation
- Best practices
- Design decisions
- Debugging guidance
