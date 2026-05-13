---
name: claude-code-chat
description: General-purpose Claude Code chat. Use for questions, explanations, analysis, or tasks that benefit from Claude's perspective.
user-invocable: true
---

# Claude Code Chat

Use this skill to ask Claude Code a question or get an explanation.

## When to use
- When Codex needs Claude's analysis on a design decision
- To get explanations of complex code or algorithms
- For research questions about best practices or patterns
- When you need a different perspective on a problem

## How to invoke

```
claude-code-chat({
  message: "What are the tradeoffs between event-driven and polling architectures?",
  systemPrompt: "You are a senior architect. Focus on scalability and maintainability."
})
```

## Tips
- Be specific in your message for better responses
- Use `systemPrompt` to set the role or context (e.g., "security expert", "performance engineer")
- For code-related questions, include the relevant code snippet in the message

## Rules
- Do not use claude-code-chat as a substitute for writing code yourself. Use it for analysis, review, and advice.
- Do not forward Codex's own tool output to Claude and ask it to redo the work.
