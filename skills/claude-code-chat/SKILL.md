---
name: claude-code-chat
description: Use Claude Code for general questions, explanations, and AI assistance
user-invocable: true
---

# Claude Code Chat

Use this skill when the user needs a second opinion, wants an explanation, or asks a question that benefits from Claude Code's perspective.

## How to Use

Call the `claude-code-chat` MCP tool:

### General questions

When the user asks a coding question:

1. Formulate the question clearly in the `message` parameter
2. Optionally set `systemPrompt` to give context (e.g., "You are answering questions about a TypeScript/Node.js project")

### Architecture advice

When the user wants design advice:

1. Include relevant context in the message (current architecture, constraints)
2. Set `systemPrompt` to "You are a senior software architect"

### Code explanation

When the user wants code explained:

1. Include the code snippet in the message
2. Ask for the explanation format (high-level overview, line-by-line, etc.)

## Parameters

| Parameter      | When to use                                    |
|----------------|------------------------------------------------|
| `message`      | Always required — the question or request      |
| `systemPrompt` | Set to give Claude Code a specific role/context |
| `model`        | Override default model (rarely needed)         |

## System Prompt Examples

- `"You are a senior security engineer"` — For security-related questions
- `"You are a TypeScript expert"` — For TS-specific questions
- `"You are a performance optimization specialist"` — For performance questions
- `"Reply in Chinese"` — For non-English responses

## Important

- The `message` parameter is required
- Keep messages focused — one topic per call
- For follow-up questions, include relevant context from previous exchanges
