import { ZodError } from 'zod';
import {
  TOOLS,
  ReviewToolSchema,
  ChatToolSchema,
  type ToolResult,
  type ReviewToolArgs,
  type ChatToolArgs,
} from '../types.js';
import { callClaudeCli } from '../utils/api.js';

function buildReviewPrompt(args: ReviewToolArgs): string {
  const parts: string[] = [];

  parts.push('Review the following code and provide a structured review.');
  parts.push('');

  if (args.language) {
    parts.push(`Language: ${args.language}`);
  }
  if (args.filename) {
    parts.push(`File: ${args.filename}`);
  }
  if (args.focus) {
    parts.push(`Focus areas: ${args.focus}`);
  }

  parts.push('');
  parts.push('Structure your review as:');
  parts.push('1. **Summary** — Brief overview of what the code does');
  parts.push('2. **Issues** — Problems found (bugs, security, performance), ordered by severity');
  parts.push('3. **Suggestions** — Improvement recommendations');
  parts.push('4. **Verdict** — Overall assessment (approve / request changes / needs discussion)');
  parts.push('');
  parts.push('Be concise. Use bullet points. Prioritize real issues over style preferences.');
  parts.push('');

  if (args.diff) {
    parts.push('## Diff to review:');
    parts.push('```diff');
    parts.push(args.diff);
    parts.push('```');
  }

  if (args.code) {
    parts.push('## Full code:');
    parts.push('```' + (args.language || ''));
    parts.push(args.code);
    parts.push('```');
  }

  return parts.join('\n');
}

async function handleReview(args: unknown): Promise<ToolResult> {
  const parsed: ReviewToolArgs = ReviewToolSchema.parse(args);

  if (!parsed.code && !parsed.diff) {
    return {
      content: [
        {
          type: 'text',
          text: 'Error: Please provide either "code" or "diff" for review.',
        },
      ],
      isError: true,
    };
  }

  const prompt = buildReviewPrompt(parsed);
  const review = await callClaudeCli(prompt, {
    model: parsed.model,
  });

  return {
    content: [{ type: 'text', text: review }],
  };
}

async function handleChat(args: unknown): Promise<ToolResult> {
  const parsed: ChatToolArgs = ChatToolSchema.parse(args);

  const response = await callClaudeCli(parsed.message, {
    system: parsed.systemPrompt,
    model: parsed.model,
  });

  return {
    content: [{ type: 'text', text: response }],
  };
}

export interface ToolHandler {
  execute: (args: unknown) => Promise<ToolResult>;
}

export const toolHandlers: Record<string, ToolHandler> = {
  [TOOLS.CLAUDE_REVIEW]: { execute: handleReview },
  [TOOLS.CLAUDE_CHAT]: { execute: handleChat },
};
