#!/usr/bin/env node

/**
 * Simple MCP client to test claude-mcp-server via stdio.
 * Usage: ANTHROPIC_API_KEY=your-key node test-mcp-client.mjs
 *
 * Sends: initialize → tools/list → tools/call (claude-chat)
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const useDocker = process.argv.includes('--docker');

  const transport = new StdioClientTransport(
    useDocker
      ? {
          command: 'docker',
          args: ['run', '--rm', '-i', '-e', 'ANTHROPIC_API_KEY', 'claude-mcp-server'],
          env: { ...process.env },
        }
      : {
          command: 'node',
          args: ['dist/index.js'],
          env: {
            ...process.env,
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
          },
        }
  );

  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  });

  await client.connect(transport);
  console.log('✅ Connected to claude-mcp-server');

  // List tools
  const tools = await client.listTools();
  console.log(`\n📋 Tools available: ${tools.tools.map(t => t.name).join(', ')}`);

  // Test claude-chat
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('\n🔧 Testing claude-chat...');
    const chatResult = await client.callTool({
      name: 'claude-chat',
      arguments: {
        message: 'Say "Hello from claude-mcp-server!" and nothing else.',
      },
    });
    console.log('claude-chat response:', chatResult.content[0].text);

    // Test claude-review
    console.log('\n🔧 Testing claude-review...');
    const reviewResult = await client.callTool({
      name: 'claude-review',
      arguments: {
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript',
        focus: 'correctness',
      },
    });
    console.log('claude-review response:', reviewResult.content[0].text.slice(0, 500) + '...');
  } else {
    console.log('\n⚠️  ANTHROPIC_API_KEY not set, skipping live API tests.');
    console.log('Server connection and tool listing verified OK.');
  }

  await client.close();
  console.log('\n✅ All tests passed!');
}

main().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
