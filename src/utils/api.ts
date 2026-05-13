import { execFile } from 'node:child_process';

function findClaudeBinary(): string {
  const envPath = process.env.CLAUDE_CLI_PATH;
  if (envPath) return envPath;
  return 'claude';
}

export interface ClaudeCliOptions {
  system?: string;
  model?: string;
  maxTokens?: number;
}

export async function callClaudeCli(
  prompt: string,
  options: ClaudeCliOptions = {}
): Promise<string> {
  const claude = findClaudeBinary();

  const args: string[] = [];

  if (options.system) {
    args.push('--system-prompt', options.system);
  }

  if (options.model) {
    args.push('--model', options.model);
  }

  args.push('-p', prompt);

  return new Promise((resolve, reject) => {
    execFile(
      claude,
      args,
      {
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120_000,
      },
      (error, stdout, stderr) => {
        if (error) {
          const hint =
            error.code === 'ENOENT'
              ? 'Claude Code CLI not found. Install it: https://docs.anthropic.com/en/docs/claude-code'
              : error.message;
          reject(new Error(`Claude CLI failed: ${hint}`));
          return;
        }
        const output = (stdout || stderr || '').trim();
        if (!output) {
          reject(new Error('No output from Claude CLI'));
          return;
        }
        resolve(output);
      }
    );
  });
}
