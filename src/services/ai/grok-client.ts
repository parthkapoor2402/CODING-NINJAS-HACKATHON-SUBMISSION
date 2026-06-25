/**
 * @deprecated Grok API keys are server-only. Use the secure AI gateway via `services.ai`.
 * This module retains file helpers only; direct model calls are blocked in the browser.
 */

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

/** Always false in the browser — keys live on the server (`GROK_API_KEY`). */
export function hasGrokApiKey(): boolean {
  return false;
}

export function getGrokApiUrl(): string {
  return DEFAULT_API_URL;
}

export async function grokChatCompletion(
  _messages: GrokMessage[],
  _options?: { json?: boolean; model?: string; timeoutMs?: number },
): Promise<string> {
  throw new Error(
    'Direct Grok calls are disabled in the client. Route requests through /api/agents/invoke.',
  );
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
