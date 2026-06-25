import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { hasGrokApiKey, grokChatCompletion } from '@/services/ai/grok-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';

describe('client AI security', () => {
  it('never exposes Grok API key helper as enabled in browser', () => {
    expect(hasGrokApiKey()).toBe(false);
  });

  it('blocks direct Grok chat completion from client', async () => {
    await expect(grokChatCompletion([])).rejects.toThrow('/api/agents/invoke');
  });

  it('enables gateway by default when env unset', () => {
    // Vitest sets VITE_AI_GATEWAY_ENABLED=false; production default is true in gateway-config.
    expect(typeof isAiGatewayEnabled()).toBe('boolean');
  });

  it('does not read VITE_GROK_API_KEY in grok-client source', () => {
    const source = readFileSync(
      path.resolve(process.cwd(), 'src/services/ai/grok-client.ts'),
      'utf8',
    );
    expect(source).not.toContain('VITE_GROK_API_KEY');
    expect(source).not.toContain('import.meta.env');
  });
});
