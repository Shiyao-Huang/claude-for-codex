import { TOOLS, AVAILABLE_MODELS, DEFAULT_MODEL, type ToolDefinition } from '../types.js';

const modelList = AVAILABLE_MODELS.join(', ');
const modelDescription = `Claude Code model to use (default: ${DEFAULT_MODEL}). Options: ${modelList}`;

export const toolDefinitions: ToolDefinition[] = [
  {
    name: TOOLS.CLAUDE_REVIEW,
    description:
      'Call Claude Code to perform a code review. Provide code, a diff, or both. ' +
      'Returns structured review feedback with issues and suggestions.',
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
        focus: {
          type: 'string',
          description:
            'Specific review focus areas (e.g., "security, performance, readability")',
        },
        model: {
          type: 'string',
          description: modelDescription,
        },
      },
      required: [],
    },
    annotations: {
      title: 'Claude Code Review',
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
          description: modelDescription,
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
