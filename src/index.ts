#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ZodError } from 'zod';
import { TOOLS, type ToolName, API_KEY_ENV_VAR, AUTH_TOKEN_ENV_VAR } from './types.js';
import { toolDefinitions } from './tools/definitions.js';
import { toolHandlers } from './tools/handlers.js';

const SERVER_CONFIG = {
  name: 'claude-code-mcp-server',
  version: '1.0.0',
} as const;

function isValidToolName(name: string): name is ToolName {
  return Object.values(TOOLS).includes(name as ToolName);
}

async function main(): Promise<void> {
  const apiKey = process.env[API_KEY_ENV_VAR] || process.env[AUTH_TOKEN_ENV_VAR];
  if (!apiKey) {
    console.error(
      `Warning: ${API_KEY_ENV_VAR} not set. API calls will fail until it is configured.`
    );
  }

  const server = new Server(
    { name: SERVER_CONFIG.name, version: SERVER_CONFIG.version },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: toolDefinitions };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!isValidToolName(name)) {
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    try {
      const handler = toolHandlers[name];
      return await handler.execute(args);
    } catch (error) {
      const message =
        error instanceof ZodError
          ? `Invalid arguments: ${error.message}`
          : error instanceof Error
            ? error.message
            : String(error);

      return {
        content: [{ type: 'text', text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_CONFIG.name} v${SERVER_CONFIG.version} started`);
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
