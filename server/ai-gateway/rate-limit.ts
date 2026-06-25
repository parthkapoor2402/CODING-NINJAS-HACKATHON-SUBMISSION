import { getServerEnv } from './env.ts';

interface Bucket {
  count: number;
  windowStartMs: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
}

export function checkRateLimit(key: string, limitPerMinute?: number): RateLimitResult {
  const env = getServerEnv();
  const limit = limitPerMinute ?? env.rateLimitPerMinute;
  const now = Date.now();
  const windowMs = 60_000;

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStartMs >= windowMs) {
    buckets.set(key, { count: 1, windowStartMs: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    const retryAfterSec = Math.ceil((windowMs - (now - bucket.windowStartMs)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

/** Test hook */
export function resetRateLimits(): void {
  buckets.clear();
}

export function buildRateLimitKey(actorId: string, agent: string, action: string): string {
  return `${actorId}:${agent}:${action}`;
}
