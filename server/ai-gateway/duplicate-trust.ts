import type {
  DuplicateClassification,
  DuplicateTrustAction,
  DuplicateTrustPayload,
  DuplicateTrustResult,
  RewardEligibilityTier,
} from '../../shared/duplicate-trust.ts';
import {
  countReporterReportsToday,
  getOpenReportsForAnalysis,
} from '../data/open-reports.ts';
import { findNearbyMatches, type ScoredMatch } from './duplicate-scoring.ts';
import { assessTrustSignals } from './trust-signals.ts';
import { grokChatCompletion, TEXT_MODEL } from './grok-provider.ts';
import { parseModelJson } from './validator.ts';
import type { ModelExecutionResult } from './mock-provider.ts';

function classifyFromScore(topScore: number, trustSuspicious: boolean): DuplicateClassification {
  if (trustSuspicious && topScore < 50) return 'suspicious_low_signal';
  if (topScore >= 75) return 'high_confidence_duplicate';
  if (topScore >= 50) return 'possible_duplicate';
  if (trustSuspicious) return 'suspicious_low_signal';
  return 'likely_unique';
}

function resolveAction(
  classification: DuplicateClassification,
  trust: ReturnType<typeof assessTrustSignals>,
  hasMatch: boolean,
): DuplicateTrustAction {
  if (trust.velocitySpike || trust.duplicateAbuse || trust.promptInjection) return 'manual_review';
  if (classification === 'high_confidence_duplicate' && hasMatch) return 'support_existing';
  if (classification === 'possible_duplicate' && hasMatch) return 'support_existing';
  if (classification === 'suspicious_low_signal') {
    return trust.velocitySpike ? 'hold_reward_eligibility' : 'submit_needs_verification';
  }
  return 'submit_normally';
}

function resolveRewardEligibility(
  action: DuplicateTrustAction,
  classification: DuplicateClassification,
): RewardEligibilityTier {
  if (action === 'hold_reward_eligibility' || action === 'manual_review') return 'hold';
  if (classification === 'high_confidence_duplicate') return 'reduced';
  if (classification === 'suspicious_low_signal') return 'none';
  if (classification === 'possible_duplicate') return 'reduced';
  return 'full';
}

function buildUserMessage(
  classification: DuplicateClassification,
  topMatch: ScoredMatch | undefined,
): string {
  switch (classification) {
    case 'high_confidence_duplicate':
      return topMatch
        ? `A similar report is already open nearby (${topMatch.title}). Supporting it helps crews respond faster — your voice still matters.`
        : 'A similar open report may already exist nearby. Consider supporting it before filing again.';
    case 'possible_duplicate':
      return 'This might overlap with a nearby open report. Supporting the existing issue can be faster than starting a new thread.';
    case 'suspicious_low_signal':
      return 'We need a bit more detail or evidence before routing this for full rewards. You can still submit — extra verification may apply.';
    default:
      return 'This looks like a new issue for your ward. Submit when you are ready.';
  }
}

function buildAdminRationale(
  classification: DuplicateClassification,
  action: DuplicateTrustAction,
  matches: ScoredMatch[],
  trust: ReturnType<typeof assessTrustSignals>,
  riskScore: number,
): string[] {
  const lines = [
    `Classification: ${classification.replace(/_/g, ' ')}`,
    `Risk score: ${riskScore}/100`,
    `Recommended action: ${action.replace(/_/g, ' ')}`,
  ];
  if (matches[0]) {
    lines.push(
      `Top match: ${matches[0].reportId} (${matches[0].score}% score, ${matches[0].distanceM}m, ${matches[0].category})`,
    );
  }
  for (const s of trust.signals) {
    lines.push(`Trust signal: ${s}`);
  }
  return lines;
}

async function narrateMatches(
  matches: ScoredMatch[],
  description: string,
): Promise<string | undefined> {
  if (matches.length === 0) return undefined;
  try {
    const matchJson = JSON.stringify(
      matches.map((m) => ({
        reportId: m.reportId,
        title: m.title,
        score: m.score,
        distanceM: m.distanceM,
        category: m.category,
      })),
    );
    const raw = await grokChatCompletion(
      [
        {
          role: 'system',
          content: `You compare civic issue reports. Return JSON only: {"narrative":"2 sentences max, calm and non-accusatory"}
Only reference report IDs present in MATCHES_JSON. Never invent IDs.`,
        },
        {
          role: 'user',
          content: `New report: ${description.slice(0, 300)}
MATCHES_JSON: ${matchJson}
Explain how the new report relates to nearby open issues.`,
        },
      ],
      { json: true, model: TEXT_MODEL },
    );
    const parsed = parseModelJson(raw);
    return typeof parsed.narrative === 'string' ? parsed.narrative.slice(0, 400) : undefined;
  } catch {
    return undefined;
  }
}

function buildHeuristicNarrative(matches: ScoredMatch[]): string | undefined {
  if (!matches[0]) return undefined;
  const m = matches[0];
  return `Nearby open report "${m.title}" (${m.distanceM}m away, ${m.score}% similarity) may describe the same issue.`;
}

export function analyzeDuplicateTrustCore(
  payload: DuplicateTrustPayload,
  openReports = getOpenReportsForAnalysis(),
): DuplicateTrustResult {
  const description = `${payload.title ?? ''} ${payload.description}`.trim();
  const reportsToday = Math.max(
    payload.reportsToday ?? 0,
    countReporterReportsToday(payload.reporterId, openReports),
  );
  const trust = assessTrustSignals({ ...payload, reportsToday });

  const matches = findNearbyMatches(
    description,
    payload.category,
    payload.lat,
    payload.lng,
    openReports,
  );

  const topScore = matches[0]?.score ?? 0;
  const riskScore = Math.max(topScore, trust.velocitySpike ? 60 : 0, trust.duplicateAbuse ? 70 : 0);
  const classification = classifyFromScore(topScore, trust.suspicious);
  const recommendedAction = resolveAction(classification, trust, matches.length > 0);
  const rewardEligibility = resolveRewardEligibility(recommendedAction, classification);

  return {
    classification,
    recommendedAction,
    riskScore,
    matches: matches.map((m) => ({
      reportId: m.reportId,
      title: m.title,
      score: m.score,
      distanceM: m.distanceM,
      category: m.category,
      status: m.status,
    })),
    trustSignals: trust.signals,
    userMessage: buildUserMessage(classification, matches[0]),
    adminRationale: buildAdminRationale(classification, recommendedAction, matches, trust, riskScore),
    rewardEligibility,
    supportExistingReportId:
      recommendedAction === 'support_existing' ? matches[0]?.reportId : undefined,
  };
}

export async function analyzeDuplicateTrustWithNarrative(
  payload: DuplicateTrustPayload,
  useLiveNarrative: boolean,
): Promise<ModelExecutionResult> {
  const core = analyzeDuplicateTrustCore(payload);
  let comparisonNarrative = buildHeuristicNarrative(
    core.matches.map((m) => ({
      ...m,
      description: '',
    })) as ScoredMatch[],
  );

  if (useLiveNarrative && core.matches.length > 0) {
    const scored = findNearbyMatches(
      `${payload.title ?? ''} ${payload.description}`.trim(),
      payload.category,
      payload.lat,
      payload.lng,
      getOpenReportsForAnalysis(),
    );
    const live = await narrateMatches(scored, payload.description);
    if (live) comparisonNarrative = live;
  }

  const data = {
    ...core,
    comparisonNarrative,
    matches: core.matches.map((m) => ({
      ...m,
      comparisonSummary: comparisonNarrative,
    })),
  };

  return {
    data: data as unknown as Record<string, unknown>,
    confidence: core.riskScore / 100,
    model: useLiveNarrative ? 'grok-text' : 'mock-rules',
  };
}

export async function heuristicDuplicateTrustAnalyze(
  payload: DuplicateTrustPayload,
): Promise<ModelExecutionResult> {
  return analyzeDuplicateTrustWithNarrative(payload, false);
}

export async function grokDuplicateTrustAnalyze(
  payload: DuplicateTrustPayload,
): Promise<ModelExecutionResult> {
  return analyzeDuplicateTrustWithNarrative(payload, true);
}
