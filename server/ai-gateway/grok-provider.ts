import { getServerEnv } from './env.ts';

const DEFAULT_MODEL = 'grok-2-vision-1212';
const TEXT_MODEL = 'grok-2-latest';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | GrokContentPart[];
}

interface GrokContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string; detail?: 'low' | 'high' | 'auto' };
}

export async function grokChatCompletion(
  messages: GrokMessage[],
  options?: { json?: boolean; model?: string; timeoutMs?: number },
): Promise<string> {
  const env = getServerEnv();
  const apiKey = env.grokApiKey;
  if (!apiKey) {
    throw new Error('GROK_KEY_MISSING');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 12_000);

  try {
    const response = await fetch(`${env.grokApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model ?? DEFAULT_MODEL,
        messages,
        temperature: 0.2,
        ...(options?.json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`GROK_HTTP_${response.status}:${body.slice(0, 120)}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('GROK_EMPTY_RESPONSE');
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export function buildVisionMessages(
  system: string,
  text: string,
  imageDataUrl?: string,
): GrokMessage[] {
  const userContent = imageDataUrl
    ? [
        { type: 'text' as const, text },
        { type: 'image_url' as const, image_url: { url: imageDataUrl, detail: 'low' as const } },
      ]
    : text;

  return [
    { role: 'system', content: system },
    { role: 'user', content: userContent },
  ];
}

export { DEFAULT_MODEL, TEXT_MODEL };
