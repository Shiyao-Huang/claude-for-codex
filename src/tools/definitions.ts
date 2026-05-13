import { TOOLS, type ToolDefinition } from '../types.js';

export const toolDefinitions: ToolDefinition[] = [
  {
    name: TOOLS.CLAUDE_REVIEW,
    description:
      'Smart all-in-one code review via Claude Code. Automatically detects and reviews ' +
      'security, performance, correctness, architecture, and test coverage issues. ' +
      'Provide code, a diff, or both.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Full source code to review',
        },
        diff: {
          type: 'string',
          description: 'Diff or patch content to review',
        },
        filename: {
          type: 'string',
          description: 'Filename for context (e.g., "src/auth.ts")',
        },
        language: {
          type: 'string',
          description: 'Programming language for better review context',
        },
        model: {
          type: 'string',
          description: 'Claude Code model to use (optional, uses default)',
        },
      },
      required: [],
    },
    annotations: {
      title: 'Claude Code Smart Review',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
  },
  {
    name: TOOLS.CLAUDE_CHAT,
    description:
      'Send a message to Claude Code and get a response. Useful for asking questions, ' +
      'getting explanations, or general AI assistance.',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The message or question for Claude Code',
        },
        systemPrompt: {
          type: 'string',
          description: 'Optional system prompt to set context',
        },
        model: {
          type: 'string',
          description: 'Claude Code model to use (optional, uses default)',
        },
      },
      required: ['message'],
    },
    annotations: {
      title: 'Claude Code Chat',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
];
