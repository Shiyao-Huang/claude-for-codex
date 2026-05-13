---
description: Send code to Claude Code for review
argument-hint: '<file-path or paste code>'
---

Run a Claude Code review on the provided code or diff.

## Execution

1. If a file path is given as argument, read the file contents first.
2. If in a git repo, also grab the diff with `git diff` for context.
3. Call the `claude-code-review` MCP tool with:
   - `code`: the file contents
   - `diff`: the git diff (if available)
   - `filename`: the file path
   - `language`: inferred from file extension
4. Return Claude's review output verbatim to the user.

## Rules
- Do not fix any issues mentioned in the review. Present findings and ask the user which to address.
- If the tool returns an error, report it and stop.
