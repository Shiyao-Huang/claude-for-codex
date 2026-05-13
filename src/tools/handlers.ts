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

const SMART_REVIEW_PROMPT = `You are an expert code reviewer. Analyze the provided code and automatically detect which review dimensions are relevant:

- **Security**: SQL injection, XSS, auth bypass, hardcoded secrets, data exposure
- **Performance**: Memory leaks, N+1 queries, unnecessary re-renders, algorithmic complexity
- **Correctness**: Logic errors, race conditions, null handling, edge cases
- **Architecture**: Coupling, cohesion, SOLID violations, design pattern misuse
- **Error handling**: Missing error cases, silent failures, recovery paths
- **Dependencies**: Outdated/vulnerable packages, unnecessary imports
- **Test coverage**: Untested paths, weak assertions, missing edge cases
- **Readability**: Naming, structure, documentation gaps

Not all dimensions apply to every review — focus on what's relevant for THIS code.

Structure your review as:
1. **Summary** — What the code does and which dimensions were reviewed
2. **Issues** — Problems found, ordered by severity (critical → high → medium → low)
3. **Suggestions** — Improvement recommendations
4. **Verdict** — approve / request changes / needs discussion

Be concise. Use bullet points. Prioritize real issues over style preferences.`;

function buildReviewPrompt(args: ReviewToolArgs): string {
  const parts: string[] = [];

  parts.push('Review the following code. Automatically detect relevant review dimensions (security, performance, correctness, architecture, error handling, test coverage, dependencies, readability).');
  parts.push('');

  if (args.language) {
    parts.push(`Language: ${args.language}`);
  }
  if (args.filename) {
    parts.push(`File: ${args.filename}`);
  }

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
    system: SMART_REVIEW_PROMPT,
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
