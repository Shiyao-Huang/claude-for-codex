# claude-code-mcp-server

MCP server that lets Codex CLI call Claude Code for code review and chat.

Built on the same architecture as [codex-mcp-server](https://github.com/tuannvm/codex-mcp-server), but in reverse: instead of Claude Code calling Codex, Codex calls Claude Code.

## What It Does

- **claude-code-review** — Send code or a diff to Claude Code and get structured review feedback (bugs, security issues, suggestions, verdict)
- **claude-code-chat** — Ask Claude Code general questions from within Codex

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

## Install

```bash
git clone https://github.com/copizza/claude-for-codex.git
cd claude-for-codex
npm install
npm run build
```

## Configure

Set your Anthropic API key:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Or use an auth token:

```bash
export ANTHROPIC_AUTH_TOKEN="your-token"
```

Optional — override the default model or use a custom API endpoint:

```bash
export ANTHROPIC_MODEL="claude-opus-4-6"
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
```

## Use with Codex CLI

Add the server to your Codex MCP configuration file. Edit `~/.codex/config.json` (create it if it doesn't exist):

```json
{
  "mcpServers": {
    "claude": {
      "command": "node",
      "args": ["/absolute/path/to/claude-for-codex/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

Or with a custom API endpoint:

```json
{
  "mcpServers": {
    "claude": {
      "command": "node",
      "args": ["/absolute/path/to/claude-for-codex/dist/index.js"],
      "env": {
        "ANTHROPIC_AUTH_TOKEN": "your-token",
        "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
        "ANTHROPIC_MODEL": "glm-5.1"
      }
    }
  }
}
```

Or use `npx` to run from source:

```json
{
  "mcpServers": {
    "claude": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/claude-for-codex/src/index.ts"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

After updating the config, restart Codex. The `claude-code-review` and `claude-code-chat` tools will be available.

## Tools

### claude-code-review

Review code or a diff using Claude Code.

**Parameters:**

| Parameter   | Type   | Required | Description                                          |
|-------------|--------|----------|------------------------------------------------------|
| `code`      | string | no*      | Full source code to review                           |
| `diff`      | string | no*      | Diff or patch content to review                      |
| `filename`  | string | no       | Filename for context (e.g., `"src/auth.ts"`)         |
| `language`  | string | no       | Programming language for better review context       |
| `focus`     | string | no       | Focus areas (e.g., `"security, performance"`)        |
| `model`     | string | no       | Claude Code model override                           |

\* At least one of `code` or `diff` is required.

**Example — ask Codex to review your changes:**

```
> Use claude-review to review the diff of my uncommitted changes with focus on security
```

**Example — review a specific file:**

```
> Use claude-review to review the code in src/handlers.ts (language: typescript, focus: error handling)
```

### claude-code-chat

Send a message to Claude Code and get a response.

**Parameters:**

| Parameter      | Type   | Required | Description                     |
|----------------|--------|----------|---------------------------------|
| `message`      | string | yes      | The message or question         |
| `systemPrompt` | string | no       | System prompt to set context    |
| `model`        | string | no       | Claude Code model override      |

**Example:**

```
> Use claude-chat to ask "What are the best practices for JWT token rotation?"
```

## Use Cases

1. **Post-write review** — After Codex generates code, ask Claude Code to review it for bugs and security issues
2. **Second opinion** — Get Claude Code's perspective on architectural decisions while working in Codex
3. **Security audit** — Focus Claude Code's review on security concerns in generated code
4. **Documentation help** — Ask Claude Code to explain complex code or suggest documentation

## Docker

Build and run in a container:

```bash
# Build image
docker build -t claude-code-mcp-server .

# Run with API key
docker run --rm \
  -e ANTHROPIC_API_KEY="sk-ant-..." \
  claude-code-mcp-server

# Run with custom endpoint (e.g., Zhipu proxy)
docker run --rm \
  -e ANTHROPIC_AUTH_TOKEN="your-token" \
  -e ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic" \
  -e ANTHROPIC_MODEL="glm-5.1" \
  claude-code-mcp-server
```

Use in Codex config with Docker:

```json
{
  "mcpServers": {
    "claude": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-e", "ANTHROPIC_API_KEY", "claude-code-mcp-server"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

## Development

```bash
# Build
npm run build

# Development with hot reload
npm run dev

# Type check
npx tsc --noEmit
```

## License

MIT
