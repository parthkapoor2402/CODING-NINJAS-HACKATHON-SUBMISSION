import type { User } from '../../src/types/index.ts';
import { getOpenReportsForAnalysis, haversineM } from '../data/open-reports.ts';
import { seedUsers } from '../../src/services/mock/seed/users.ts';
import type {
  VerificationInviteCandidate,
  VerificationOrchestratorResult,
  VerificationPlanPayload,
  VerificationRecommendPayload,
} from '../../shared/verification-orchestrator.ts';
import {
  DEFAULT_CONFIRMATION_THRESHOLD,
  type VerificationRecommendation,
} from '../../shared/verification-orchestrator.ts';

const BASE = { lat: 12.9716, lng: 77.5946 };

/** Demo resident anchors for invite planning */
const CANDIDATE_ANCHORS: Record<string, { lat: number; lng: number }> = {
  'user-parent-1': { lat: BASE.lat + 0.001, lng: BASE.lng - 0.0015 },
  'user-youth-1': { lat: BASE.lat + 0.0005, lng: BASE.lng - 0.001 },
  'user-moderator-1': { lat: BASE.lat - 0.0008, lng: BASE.lng + 0.001 },
};

const INVITE_ROLES = new Set(['citizen', 'parent', 'youth', 'moderator']);

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return haversineM(lat1, lng1, lat2, lng2) / 1000;
}

function formatNearYou(distanceKm: number, address?: string): string {
  if (distanceKm < 0.5) return 'Near you';
  if (address) return `Near ${address.split(',')[0]?.trim() ?? address}`;
  return `${Math.round(distanceKm * 1000)}m away`;
}

function formatConfirmations(needed: number): string {
  if (needed <= 0) return 'Ready for crew review';
  if (needed === 1) return 'Needs 1 more confirmation';
  return `Needs ${needed} more confirmations`;
}

function isConfidenceSufficient(
  corroborationCount: number,
  status: string,
  threshold = DEFAULT_CONFIRMATION_THRESHOLD,
): boolean {
  if (['verified', 'acknowledged', 'in_progress'].includes(status)) return true;
  return corroborationCount >= threshold;
}

export function recommendVerificationCore(
  payload: VerificationRecommendPayload,
): VerificationOrchestratorResult {
  const reports = getOpenReportsForAnalysis();
  const threshold = DEFAULT_CONFIRMATION_THRESHOLD;
  const anchor = {
    lat: payload.lat ?? BASE.lat,
    lng: payload.lng ?? BASE.lng,
  };
  const dismissed = new Set(payload.dismissedReportIds ?? []);
  const snoozed = new Set(payload.snoozedReportIds ?? []);
  const supported = new Set(payload.supportedReportIds ?? []);

  const recommendations: VerificationRecommendation[] = [];

  for (const report of reports) {
    if (report.status !== 'pending_verification') continue;
    if (isConfidenceSufficient(report.corroborationCount, report.status, threshold)) continue;
    if (report.reporterId === payload.userId) continue;
    if (dismissed.has(report.id) || snoozed.has(report.id) || supported.has(report.id)) continue;

    const dist = distanceKm(
      anchor.lat,
      anchor.lng,
      report.location.lat,
      report.location.lng,
    );
    const needed = Math.max(0, threshold - report.corroborationCount);
    const proximity = Math.max(0, 100 - dist * 120) * 0.35;
    const urgency =
      (report.severity === 'high' ? 30 : report.severity === 'medium' ? 18 : 8) * 0.2;
    const gap = needed * 25 * 0.25;
    const age = Math.min(
      Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 86400000) * 4,
      20,
    ) * 0.1;
    const fatigue =
      ((payload.recentVerifyCount24h ?? 0) * 8 + (payload.recentNudges24h ?? 0) * 5) * 0.15;

    recommendations.push({
      reportId: report.id,
      rankScore: proximity + urgency + gap + age - fatigue,
      distanceKm: dist,
      confirmationsNeeded: needed,
      nearYouLabel: formatNearYou(dist, report.location.address),
      confirmationsLabel: formatConfirmations(needed),
      promptReason: `${formatNearYou(dist, report.location.address)} · ${formatConfirmations(needed)}`,
      impactMessage:
        needed === 1
          ? 'Your verification can help move this forward faster'
          : 'An honest confirm helps neighbors and crews trust this report',
      suppressed: false,
    });
  }

  recommendations.sort((a, b) => b.rankScore - a.rankScore);

  const confidenceSufficientCount = reports.filter((r) =>
    isConfidenceSufficient(r.corroborationCount, r.status, threshold),
  ).length;

  return {
    recommendations,
    topRecommendation: recommendations[0],
    capsApplied: { wardDaily: 5, perReport: 3 },
    confidenceSufficientCount,
  };
}

export function planVerificationInvitesCore(
  payload: VerificationPlanPayload,
): VerificationOrchestratorResult {
  const reports = getOpenReportsForAnalysis();
  const report = reports.find((r) => r.id === payload.reportId);
  const threshold = payload.threshold ?? DEFAULT_CONFIRMATION_THRESHOLD;
  const perReportCap = 3;

  if (!report || isConfidenceSufficient(report.corroborationCount, report.status, threshold)) {
    return {
      recommendations: [],
      invitations: [],
      capsApplied: { wardDaily: 5, perReport: perReportCap },
      confidenceSufficientCount: 0,
    };
  }

  const candidates = seedUsers
    .filter((u) => INVITE_ROLES.has(u.role))
    .filter((u) => u.id !== report.reporterId);

  const invitations: VerificationInviteCandidate[] = candidates
    .map((user: User) => {
      const anchor = CANDIDATE_ANCHORS[user.id] ?? BASE;
      const dist = distanceKm(
        anchor.lat,
        anchor.lng,
        report.location.lat,
        report.location.lng,
      );
      const proximity = Math.max(0, 100 - dist * 120) * 0.35;
      const streak = Math.min(user.trust.verificationScore / 100, 1) * 100 * 0.25;
      const gap = Math.max(0, threshold - report.corroborationCount) * 25 * 0.25;
      const score = Math.round(proximity + streak + gap);
      const verifiedCount = Math.floor(user.trust.verificationScore / 20);
      const reason = `${formatNearYou(dist, report.location.address)} · verified ${verifiedCount} issues this month`;
      return {
        userId: user.id,
        score,
        reason,
        deepLink: `/app/community?reportId=${report.id}`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, perReportCap);

  return {
    recommendations: [],
    invitations,
    capsApplied: { wardDaily: 5, perReport: perReportCap },
    confidenceSufficientCount: 0,
  };
}

export async function heuristicVerificationOrchestrate(
  action: string,
  payload: VerificationRecommendPayload | VerificationPlanPayload,
): Promise<{ data: Record<string, unknown>; confidence: number; model: string }> {
  const result =
    action === 'plan'
      ? planVerificationInvitesCore(payload as VerificationPlanPayload)
      : recommendVerificationCore(payload as VerificationRecommendPayload);
  return {
    data: result as unknown as Record<string, unknown>,
    confidence: result.topRecommendation ? result.topRecommendation.rankScore / 100 : 0.5,
    model: 'mock-rules',
  };
}
