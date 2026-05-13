import { z } from 'zod';

// Tool constants
export const TOOLS = {
  CLAUDE_REVIEW: 'claude-code-review',
  CLAUDE_CHAT: 'claude-code-chat',
} as const;

export type ToolName = (typeof TOOLS)[keyof typeof TOOLS];

// Tool annotations for MCP spec
export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

// Tool definition interface
export interface ToolDefinition {
  name: ToolName;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
  annotations?: ToolAnnotations;
}

// Tool result — matches MCP SDK expectations
export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
    _meta?: Record<string, unknown>;
  }>;
  isError?: boolean;
  [key: string]: unknown;
}

// Zod schemas
export const ReviewToolSchema = z.object({
  code: z.string().optional().describe('Source code to review'),
  diff: z.string().optional().describe('Diff or patch content to review'),
  filename: z
    .string()
    .optional()
    .describe('Filename for context (e.g., "src/auth.ts")'),
  language: z
    .string()
    .optional()
    .describe('Programming language for better review context'),
  focus: z
    .string()
    .optional()
    .describe('Specific review focus areas (e.g., "security, performance")'),
  model: z.string().optional().describe('Claude model to use'),
});

export const ChatToolSchema = z.object({
  message: z.string().describe('The message or question for Claude Code'),
  systemPrompt: z
    .string()
    .optional()
    .describe('Optional system prompt to set context'),
  model: z.string().optional().describe('Claude model to use'),
});

export type ReviewToolArgs = z.infer<typeof ReviewToolSchema>;
export type ChatToolArgs = z.infer<typeof ChatToolSchema>;
