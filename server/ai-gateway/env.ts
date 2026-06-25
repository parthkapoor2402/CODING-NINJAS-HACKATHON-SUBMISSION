export interface ServerEnv {
  aiProvider: 'mock' | 'grok';
  grokApiKey: string | undefined;
  grokApiUrl: string;
  rateLimitPerMinute: number;
  maxDescriptionLength: number;
  maxImageBase64Length: number;
}

export function getServerEnv(): ServerEnv {
  const provider = process.env.AI_PROVIDER ?? 'mock';
  return {
    aiProvider: provider === 'grok' ? 'grok' : 'mock',
    grokApiKey: process.env.GROK_API_KEY?.trim() || undefined,
    grokApiUrl: process.env.GROK_API_URL ?? 'https://api.x.ai/v1',
    rateLimitPerMinute: Number(process.env.AI_GATEWAY_RATE_LIMIT_PER_MIN ?? '30'),
    maxDescriptionLength: Number(process.env.AI_GATEWAY_MAX_DESCRIPTION ?? '4000'),
    maxImageBase64Length: Number(process.env.AI_GATEWAY_MAX_IMAGE_B64 ?? '6_000_000'),
  };
}

export function isLiveAiEnabled(env: ServerEnv = getServerEnv()): boolean {
  return env.aiProvider === 'grok' && Boolean(env.grokApiKey);
}
