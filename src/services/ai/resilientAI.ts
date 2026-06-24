import type { AIService } from '@/services/ai/types';

/**
 * Wraps a primary AI service with automatic fallback on any failure.
 * Ensures reporting never blocks when Grok is down or misconfigured.
 */
export function createResilientAIService(primary: AIService, fallback: AIService): AIService {
  async function withFallback<T>(primaryFn: () => Promise<T>, fallbackFn: () => Promise<T>): Promise<T> {
    try {
      return await primaryFn();
    } catch {
      return await fallbackFn();
    }
  }

  return {
    categorize: (input) =>
      withFallback(
        () => primary.categorize(input),
        () => fallback.categorize(input),
      ),
    estimateSeverity: (input) =>
      withFallback(
        () => primary.estimateSeverity(input),
        () => fallback.estimateSeverity(input),
      ),
    detectDuplicateRisk: (input) =>
      withFallback(
        () => primary.detectDuplicateRisk(input),
        () => fallback.detectDuplicateRisk(input),
      ),
    summarize: (description) =>
      withFallback(
        () => primary.summarize(description),
        () => fallback.summarize(description),
      ),
  };
}
