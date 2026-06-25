import type { DuplicateTrustPayload } from '../../shared/duplicate-trust.ts';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s*:\s*/i,
  /you\s+are\s+now\s+/i,
  /<script/i,
];

export interface TrustSignalResult {
  signals: string[];
  suspicious: boolean;
  velocitySpike: boolean;
  duplicateAbuse: boolean;
  promptInjection: boolean;
  lowSignal: boolean;
}

export function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

export function assessTrustSignals(payload: DuplicateTrustPayload): TrustSignalResult {
  const signals: string[] = [];
  const fullText = `${payload.title ?? ''} ${payload.description}`.trim();

  if (detectPromptInjection(fullText)) {
    signals.push('Unusual instruction-like text detected — sanitized for review');
  }

  const reportsToday = payload.reportsToday ?? 0;
  if (reportsToday >= 3) {
    signals.push(`${reportsToday} reports from this account today`);
  }
  if (reportsToday >= 5) {
    signals.push('High submission velocity');
  }

  const dupAttempts = payload.duplicateAttemptsToday ?? 0;
  if (dupAttempts >= 2) {
    signals.push('Multiple nearby duplicate checks today');
  }

  if (payload.lowQualityEvidence) {
    signals.push('Low-resolution or weak evidence');
  }

  if (payload.textOnlyFallback && !payload.mediaFingerprints?.length) {
    signals.push('Text-only report without photo or video');
  }

  if (fullText.trim().length < 20) {
    signals.push('Very short description');
  }

  const fingerprints = payload.mediaFingerprints ?? [];
  const names = fingerprints.map((f) => `${f.fileName}:${f.sizeBytes}`);
  if (names.length !== new Set(names).size) {
    signals.push('Repeated identical media fingerprints in draft');
  }

  const velocitySpike = reportsToday >= 5;
  const duplicateAbuse = dupAttempts >= 3;
  const promptInjection = detectPromptInjection(fullText);
  const lowSignal =
    payload.lowQualityEvidence ||
    (payload.textOnlyFallback && fingerprints.length === 0) ||
    fullText.length < 15;

  return {
    signals,
    suspicious: velocitySpike || duplicateAbuse || promptInjection || lowSignal,
    velocitySpike,
    duplicateAbuse,
    promptInjection,
    lowSignal,
  };
}
