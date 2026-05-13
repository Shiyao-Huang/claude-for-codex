import { ZodError } from 'zod';
import {
  TOOLS,
  ReviewToolSchema,
  ChatToolSchema,
  type ToolResult,
  type ReviewToolArgs,
  type ChatToolArgs,
} from '../types.js';
import { callClaude, resolveModel } from '../utils/api.js';

function buildReviewSystemPrompt(args: ReviewToolArgs): string {
  const parts = [
    'You are Claude Code, an expert code reviewer. Provide a thorough, actionable code review.',
  ];

  if (args.language) {
    parts.push(`The code is written in ${args.language}.`);
  }
  if (args.filename) {
    parts.push(`File: ${args.filename}`);
  }
  if (args.focus) {
    parts.push(`Focus areas: ${args.focus}`);
  }

  parts.push(
    '',
    'Structure your review as:',
    '1. **Summary** — Brief overview of what the code does',
    '2. **Issues** — List problems found (bugs, security, performance)',
    '3. **Suggestions** — Improvement recommendations',
    '4. **Verdict** — Overall assessment (approve / request changes / needs discussion)',
    '',
    'Be concise. Use bullet points. Prioritize real issues over style preferences.'
  );

  return parts.join('\n');
}

function buildReviewUserMessage(args: ReviewToolArgs): string {
  const parts: string[] = [];

  if (args.diff) {
    parts.push('## Diff to review:\n```diff');
    parts.push(args.diff);
    parts.push('```');
  }

  if (args.code) {
    parts.push('## Full code:');
    if (args.language) {
      parts.push('```' + args.language);
    } else {
      parts.push('```');
    }
    parts.push(args.code);
    parts.push('```');
  }

  if (!args.code && !args.diff) {
    parts.push('No code or diff provided. Please provide code or diff for review.');
  }

  return parts.join('\n');
}

async function handleReview(args: unknown): Promise<ToolResult> {
  const parsed: ReviewToolArgs = ReviewToolSchema.parse(args);
  const model = resolveModel(parsed.model);

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

  const review = await callClaude({
    model,
    system: buildReviewSystemPrompt(parsed),
    messages: [
      {
        role: 'user',
        content: buildReviewUserMessage(parsed),
      },
    ],
  });

  return {
    content: [{ type: 'text', text: review }],
  };
}

async function handleChat(args: unknown): Promise<ToolResult> {
  const parsed: ChatToolArgs = ChatToolSchema.parse(args);
  const model = resolveModel(parsed.model);

  const response = await callClaude({
    model,
    system: parsed.systemPrompt,
    messages: [
      {
        role: 'user',
        content: parsed.message,
      },
    ],
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
