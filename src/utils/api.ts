import Anthropic from '@anthropic-ai/sdk';
import {
  DEFAULT_MODEL,
  MODEL_ENV_VAR,
  API_KEY_ENV_VAR,
  AUTH_TOKEN_ENV_VAR,
  BASE_URL_ENV_VAR,
} from '../types.js';

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env[API_KEY_ENV_VAR] || process.env[AUTH_TOKEN_ENV_VAR];
    if (!apiKey) {
      throw new Error(
        `Missing ${API_KEY_ENV_VAR} or ${AUTH_TOKEN_ENV_VAR} environment variable. ` +
          'Set one to your API key.'
      );
    }

    const options: { apiKey: string; baseURL?: string } = { apiKey };
    const baseURL = process.env[BASE_URL_ENV_VAR];
    if (baseURL) {
      options.baseURL = baseURL;
    }

    client = new Anthropic(options);
  }
  return client;
}

export function resolveModel(requested?: string): string {
  return requested || process.env[MODEL_ENV_VAR] || DEFAULT_MODEL;
}

export interface ClaudeMessageParams {
  model: string;
  system?: string;
  messages: Anthropic.MessageParam[];
  maxTokens?: number;
}

export async function callClaude(params: ClaudeMessageParams): Promise<string> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: params.model,
    max_tokens: params.maxTokens ?? 4096,
    ...(params.system ? { system: params.system } : {}),
    messages: params.messages,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude response');
  }
  return textBlock.text;
}
