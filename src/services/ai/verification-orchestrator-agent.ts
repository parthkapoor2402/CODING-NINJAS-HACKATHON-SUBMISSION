import type { ActorRole } from '@shared/agent-contract';
import type { VerificationOrchestratorMetadata } from '@/types/verification-orchestrator';
import type { VerificationRecommendPayload } from '@shared/verification-orchestrator';
import { invokeAgent } from '@/services/ai/agent-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';
import {
  buildOrchestratedVerifyQueue,
  toVerificationRecommendations,
  type OrchestratorContext,
  type VerifyOpportunity,
} from '@/domain/verification-orchestrator';
import type { Report, User } from '@/types';

function toActorRole(role: User['role']): ActorRole {
  if (role === 'admin' || role === 'moderator') return role === 'admin' ? 'admin' : 'mod';
  if (role === 'field_worker') return 'system';
  return 'citizen';
}

function mapGatewayData(
  data: Record<string, unknown>,
  meta: { auditId: string; requestId: string; model: string; fallbackUsed: boolean },
): VerificationOrchestratorMetadata {
  const recommendations = Array.isArray(data.recommendations)
    ? (data.recommendations as Record<string, unknown>[]).map((r) => ({
        reportId: String(r.reportId),
        rankScore: Number(r.rankScore ?? 0),
        distanceKm: Number(r.distanceKm ?? 0),
        confirmationsNeeded: Number(r.confirmationsNeeded ?? 0),
        nearYouLabel: String(r.nearYouLabel ?? ''),
        confirmationsLabel: String(r.confirmationsLabel ?? ''),
        promptReason: String(r.promptReason ?? ''),
        impactMessage: String(r.impactMessage ?? ''),
        suppressed: Boolean(r.suppressed),
        suppressionReason:
          typeof r.suppressionReason === 'string' ? r.suppressionReason : undefined,
      }))
    : [];

  const top = data.topRecommendation as Record<string, unknown> | undefined;

  return {
    recommendations,
    topRecommendation: top
      ? {
          reportId: String(top.reportId),
          rankScore: Number(top.rankScore ?? 0),
          distanceKm: Number(top.distanceKm ?? 0),
          confirmationsNeeded: Number(top.confirmationsNeeded ?? 0),
          nearYouLabel: String(top.nearYouLabel ?? ''),
          confirmationsLabel: String(top.confirmationsLabel ?? ''),
          promptReason: String(top.promptReason ?? ''),
          impactMessage: String(top.impactMessage ?? ''),
          suppressed: Boolean(top.suppressed),
        }
      : recommendations[0],
    capsApplied: (data.capsApplied as VerificationOrchestratorMetadata['capsApplied']) ?? {
      wardDaily: 5,
      perReport: 3,
    },
    confidenceSufficientCount: Number(data.confidenceSufficientCount ?? 0),
    auditId: meta.auditId,
    requestId: meta.requestId,
    model: meta.model,
    fallbackUsed: meta.fallbackUsed,
    analyzedAt: new Date().toISOString(),
  };
}

export function buildVerifyQueueLocally(
  reports: Report[],
  user: User | null,
  ctx: OrchestratorContext,
): VerifyOpportunity[] {
  return buildOrchestratedVerifyQueue(reports, user, ctx);
}

/** Verification Orchestrator — ranked recommendations via gateway or local heuristics. */
export async function recommendVerification(
  payload: VerificationRecommendPayload,
  reports: Report[],
  user: User | null,
  ctx: OrchestratorContext,
): Promise<{ queue: VerifyOpportunity[]; metadata: VerificationOrchestratorMetadata }> {
  const localQueue = buildOrchestratedVerifyQueue(reports, user, ctx);
  const localMeta: VerificationOrchestratorMetadata = {
    recommendations: toVerificationRecommendations(localQueue),
    topRecommendation: toVerificationRecommendations(localQueue)[0],
    capsApplied: { wardDaily: 5, perReport: 3 },
    confidenceSufficientCount: reports.filter(
      (r) => r.corroborationCount >= 2 || r.status === 'verified',
    ).length,
    model: 'mock-rules',
    fallbackUsed: false,
    analyzedAt: new Date().toISOString(),
  };

  if (!isAiGatewayEnabled() || !user) {
    return { queue: localQueue, metadata: localMeta };
  }

  try {
    const response = await invokeAgent<Record<string, unknown>>(
      'verification_orchestrator',
      'recommend',
      {
        userId: payload.userId,
        wardId: payload.wardId,
        lat: payload.lat,
        lng: payload.lng,
        dismissedReportIds: payload.dismissedReportIds,
        snoozedReportIds: payload.snoozedReportIds,
        recentVerifyCount24h: payload.recentVerifyCount24h,
        recentNudges24h: payload.recentNudges24h,
        supportedReportIds: payload.supportedReportIds,
      },
      { trigger: 'verify_tab_load', actor: { id: user.id, role: toActorRole(user.role) } },
    );

    if (!response.data) {
      return { queue: localQueue, metadata: localMeta };
    }

    const metadata = mapGatewayData(response.data, {
      auditId: response.auditId,
      requestId: response.requestId,
      model: response.model,
      fallbackUsed: response.fallbackUsed,
    });

    const order = metadata.recommendations.map((r) => r.reportId);
    const byId = new Map(localQueue.map((o) => [o.report.id, o]));
    const queue = order
      .map((id) => byId.get(id))
      .filter((o): o is VerifyOpportunity => o != null);
    for (const o of localQueue) {
      if (!queue.find((q) => q.report.id === o.report.id)) queue.push(o);
    }

    return { queue, metadata };
  } catch {
    return { queue: localQueue, metadata: localMeta };
  }
}
