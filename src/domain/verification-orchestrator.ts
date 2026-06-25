import { listActiveChallenges } from '@/domain/community-challenges';
import {
  countRecentNudges,
  shouldSuppressNudge,
  type NudgeContext,
} from '@/domain/verification-nudges';
import { hasUserSupported } from '@/services/mock/mockCorroboration';
import type { Report, Severity, User } from '@/types';
import {
  DEFAULT_CONFIRMATION_THRESHOLD,
  type VerificationRecommendation,
} from '@shared/verification-orchestrator';

export const USER_ANCHOR = { lat: 12.9716, lng: 77.5946 };
export const CONFIRMATION_THRESHOLD = DEFAULT_CONFIRMATION_THRESHOLD;

const SEVERITY_WEIGHT: Record<Severity, number> = {
  high: 30,
  medium: 18,
  low: 8,
};

const WEIGHTS = {
  proximity: 0.35,
  urgency: 0.2,
  confirmationGap: 0.25,
  timeOpen: 0.1,
  missionRelevance: 0.1,
  trustFit: 0.05,
  fatiguePenalty: 0.15,
};

export interface VerifyOpportunity {
  report: Report;
  distanceKm: number;
  rankScore: number;
  confirmationsNeeded: number;
  unlocksEscalation: boolean;
  daysOpen: number;
  socialProofLabel: string;
  nearYouLabel: string;
  confirmationsLabel: string;
  promptReason: string;
  impactMessage: string;
  suppressed: boolean;
  suppressionReason?: string;
}

export interface OrchestratorContext {
  dismissedIds: string[];
  nudgeContext: NudgeContext;
  supportedReportIds?: Set<string>;
  anchor?: { lat: number; lng: number };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function daysOpen(report: Report): number {
  return Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 86400000);
}

export function isConfidenceSufficient(
  report: Report,
  threshold = CONFIRMATION_THRESHOLD,
): boolean {
  if (report.status === 'verified' || report.status === 'acknowledged' || report.status === 'in_progress') {
    return true;
  }
  return report.corroborationCount >= threshold;
}

export function formatNearYouLabel(distanceKm: number, address?: string): string {
  if (distanceKm < 0.5) return 'Near you';
  if (address) {
    const short = address.split(',')[0]?.trim() ?? address;
    return `Near ${short}`;
  }
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm.toFixed(1)} km away`;
}

export function formatConfirmationsLabel(needed: number): string {
  if (needed <= 0) return 'Ready for crew review';
  if (needed === 1) return 'Needs 1 more confirmation';
  return `Needs ${needed} more confirmations`;
}

export function formatImpactMessage(confirmationsNeeded: number, severity: Severity): string {
  if (confirmationsNeeded === 1) {
    return 'Your verification can help move this forward faster';
  }
  if (severity === 'high') {
    return 'Your verification can help crews prioritize this urgent issue';
  }
  return 'An honest confirm helps neighbors and crews trust this report';
}

function missionRelevanceBoost(category: string): number {
  const challenges = listActiveChallenges();
  const text = challenges.map((c) => `${c.title} ${c.description}`).join(' ').toLowerCase();
  if (text.includes(category.replace('_', ' '))) return 100;
  if (category === 'streetlight' && text.includes('light')) return 80;
  if (category === 'pothole' && text.includes('pothole')) return 80;
  return 0;
}

function rankOpportunity(
  report: Report,
  distanceKm: number,
  user: User | null,
  ctx: OrchestratorContext,
): number {
  const needed = Math.max(0, CONFIRMATION_THRESHOLD - report.corroborationCount);
  const proximity = Math.max(0, 100 - distanceKm * 120) * WEIGHTS.proximity;
  const urgency = SEVERITY_WEIGHT[report.severity] * WEIGHTS.urgency;
  const gap = needed * 25 * WEIGHTS.confirmationGap;
  const age = Math.min(daysOpen(report) * 4, 20) * WEIGHTS.timeOpen;
  const mission = missionRelevanceBoost(report.category) * WEIGHTS.missionRelevance;
  const trustFit = user ? (user.trust.verificationScore / 100) * 50 * WEIGHTS.trustFit : 0;

  const fatigue =
    (ctx.nudgeContext.recentVerifyCount24h * 8 + countRecentNudges(ctx.nudgeContext.history) * 5) *
    WEIGHTS.fatiguePenalty;

  const socialGap = report.corroborationCount === 0 ? 15 : report.corroborationCount === 1 ? 22 : 5;
  return proximity + urgency + gap + age + mission + trustFit + socialGap - fatigue;
}

function socialProof(report: Report): string {
  if (report.corroborationCount === 0) return 'No neighbor confirmations yet';
  if (report.corroborationCount === 1) return '1 neighbor confirmed — one more helps routing';
  return `${report.corroborationCount} neighbors confirmed`;
}

function explainPrompt(
  report: Report,
  distanceKm: number,
  confirmationsNeeded: number,
  user: User | null,
): string {
  const near = formatNearYouLabel(distanceKm, report.location.address);
  const need = formatConfirmationsLabel(confirmationsNeeded);
  const trustNote =
    user && user.trust.verificationScore >= 70
      ? ' — your track record helps crews trust neighbor signal'
      : '';
  return `${near} · ${need}${trustNote}`;
}

export function isVerifiableOpportunity(
  report: Report,
  user: User | null,
  dismissedIds: Set<string>,
  supportedIds?: Set<string>,
): boolean {
  if (isConfidenceSufficient(report)) return false;
  if (report.status !== 'pending_verification') return false;
  if (!user) return false;
  if (report.reporterId === user.id) return false;
  if (dismissedIds.has(report.id)) return false;
  const supported =
    supportedIds?.has(report.id) ?? hasUserSupported(report.id, user.id);
  if (supported) return false;
  return true;
}

export function buildOrchestratedVerifyQueue(
  reports: Report[],
  user: User | null,
  ctx: OrchestratorContext,
): VerifyOpportunity[] {
  const dismissed = new Set(ctx.dismissedIds);
  const anchor = ctx.anchor ?? USER_ANCHOR;
  const supportedIds = ctx.supportedReportIds;

  return reports
    .filter((r) => isVerifiableOpportunity(r, user, dismissed, supportedIds))
    .map((report) => {
      const distanceKm = haversineKm(
        anchor.lat,
        anchor.lng,
        report.location.lat,
        report.location.lng,
      );
      const needed = Math.max(0, CONFIRMATION_THRESHOLD - report.corroborationCount);
      const nudge = shouldSuppressNudge(report.id, ctx.nudgeContext);
      const suppressed = nudge.suppress;

      return {
        report,
        distanceKm,
        rankScore: rankOpportunity(report, distanceKm, user, ctx),
        confirmationsNeeded: needed,
        unlocksEscalation: report.corroborationCount < CONFIRMATION_THRESHOLD,
        daysOpen: daysOpen(report),
        socialProofLabel: socialProof(report),
        nearYouLabel: formatNearYouLabel(distanceKm, report.location.address),
        confirmationsLabel: formatConfirmationsLabel(needed),
        promptReason: explainPrompt(report, distanceKm, needed, user),
        impactMessage: formatImpactMessage(needed, report.severity),
        suppressed,
        suppressionReason: nudge.reason,
      };
    })
    .filter((o) => !o.suppressed)
    .sort((a, b) => b.rankScore - a.rankScore);
}

export function toVerificationRecommendations(
  opportunities: VerifyOpportunity[],
): VerificationRecommendation[] {
  return opportunities.map((o) => ({
    reportId: o.report.id,
    rankScore: o.rankScore,
    distanceKm: o.distanceKm,
    confirmationsNeeded: o.confirmationsNeeded,
    nearYouLabel: o.nearYouLabel,
    confirmationsLabel: o.confirmationsLabel,
    promptReason: o.promptReason,
    impactMessage: o.impactMessage,
    suppressed: o.suppressed,
    suppressionReason: o.suppressionReason,
  }));
}

export function escalationMessage(before: number, after: number): string | null {
  if (before < CONFIRMATION_THRESHOLD && after >= CONFIRMATION_THRESHOLD) {
    return 'You helped move this issue closer to crew review — verification threshold reached.';
  }
  if (after > before) {
    return 'You helped move this issue closer to crew review.';
  }
  return null;
}

export function verifyHeroCopy(count: number): { headline: string; subline: string } {
  if (count === 0) {
    return {
      headline: 'No local reports need your eyes right now',
      subline: 'Check back when you are out in the neighborhood — quick confirms separate signal from noise.',
    };
  }
  const noun = count === 1 ? 'report needs' : 'reports need';
  return {
    headline: `${count} local ${noun} eyes on them`,
    subline:
      'Confirm only what you can see. Your input helps crews trust real issues — and filters noise.',
  };
}

/** Back-compat wrapper used by existing imports */
export function buildVerifyQueue(
  reports: Report[],
  user: User | null,
  dismissedIds: string[] = [],
  anchor = USER_ANCHOR,
): VerifyOpportunity[] {
  return buildOrchestratedVerifyQueue(reports, user, {
    dismissedIds,
    anchor,
    nudgeContext: { history: [], snoozedUntil: {}, recentVerifyCount24h: 0 },
  });
}
