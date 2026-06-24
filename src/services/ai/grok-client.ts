const DEFAULT_API_URL = 'https://api.x.ai/v1';
const DEFAULT_MODEL = 'grok-2-vision-1212';
const TEXT_MODEL = 'grok-2-latest';

export interface GrokMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | GrokContentPart[];
}

export interface GrokContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string; detail?: 'low' | 'high' | 'auto' };
}

export function hasGrokApiKey(): boolean {
  const key = import.meta.env.VITE_GROK_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

export function getGrokApiUrl(): string {
  return import.meta.env.VITE_GROK_API_URL ?? DEFAULT_API_URL;
}

export async function grokChatCompletion(
  messages: GrokMessage[],
  options?: { json?: boolean; model?: string; timeoutMs?: number },
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error('Grok API key not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 12_000);

  try {
    const response = await fetch(`${getGrokApiUrl()}/chat/completions`, {
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
      throw new Error(`Grok API error ${response.status}: ${body.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty Grok response');
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export { DEFAULT_MODEL, TEXT_MODEL };
