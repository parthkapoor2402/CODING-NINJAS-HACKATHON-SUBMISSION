const HTML_TAG = /<[^>]*>/g;
const SCRIPT_BLOCK = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Strip unsafe HTML and normalize whitespace for model-bound text. */
export function sanitizePlainText(value: unknown, maxLength = 4000): string {
  if (value === null || value === undefined) return '';
  const raw = String(value);
  return raw
    .replace(SCRIPT_BLOCK, '')
    .replace(HTML_TAG, '')
    .replace(CONTROL_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Redact image data from audit/log summaries. */
export function redactImageFields(payload: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...payload };
  if (typeof copy.imageUrl === 'string' && copy.imageUrl.startsWith('data:')) {
    copy.imageUrl = '[image:redacted]';
  }
  if (typeof copy.imageDataUrl === 'string' && copy.imageDataUrl.startsWith('data:')) {
    copy.imageDataUrl = '[image:redacted]';
  }
  return copy;
}

export function summarizePayload(payload: Record<string, unknown>, maxLength = 500): string {
  const safe = redactImageFields(payload);
  try {
    const json = JSON.stringify(safe);
    return json.length > maxLength ? `${json.slice(0, maxLength)}…` : json;
  } catch {
    return '[unserializable payload]';
  }
}

export async function hashPayload(payload: Record<string, unknown>): Promise<string> {
  const text = summarizePayload(payload, 10_000);
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
