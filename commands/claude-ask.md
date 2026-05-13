---
description: Ask Claude Code a question
argument-hint: '<your question>'
---

Send a question to Claude Code and return the response.

## Execution

1. Use the raw `$ARGUMENTS` as the message.
2. Call the `claude-code-chat` MCP tool.
3. Return Claude's response verbatim.

## Rules
- Do not paraphrase or summarize Claude's response.
- If the question is about code in the current repo, include relevant code context in the message.
