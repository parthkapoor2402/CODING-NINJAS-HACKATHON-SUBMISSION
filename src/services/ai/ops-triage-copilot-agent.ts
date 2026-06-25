import type { AdminQueueItem } from '@/types';
import type { OpsTriageMetadata, OpsTriagePayload } from '@/types/ops-triage-copilot';
import { triageIssueFromQueueItem, triageQueueExplanations } from '@/domain/ops-triage-scoring';
import { computeWardHotspots } from '@/domain/admin-hotspots';
import { invokeAgent } from '@/services/ai/agent-client';
import { isAiGatewayEnabled } from '@/services/ai/gateway-config';

function mapGatewayData(
  data: Record<string, unknown>,
  meta: { auditId: string; requestId: string; model: string; fallbackUsed: boolean },
): OpsTriageMetadata {
  const issue = data.issue as OpsTriageMetadata['issue'] | undefined;
  const queueExplanations = Array.isArray(data.queueExplanations)
    ? (data.queueExplanations as OpsTriageMetadata['queueExplanations'])
    : [];
  return {
    issue,
    queueExplanations,
    auditId: meta.auditId,
    requestId: meta.requestId,
    model: meta.model,
    fallbackUsed: meta.fallbackUsed,
    analyzedAt: new Date().toISOString(),
  };
}

export function suggestOpsTriageLocally(
  payload: OpsTriagePayload,
  queue: AdminQueueItem[],
  options?: { hotspotRising?: boolean; suspiciousReportIds?: Set<string> },
): OpsTriageMetadata {
  const hotspots = computeWardHotspots(queue.map((q) => q.report));
  const queueExplanations = triageQueueExplanations(queue);

  if (!payload.reportId) {
    return {
      queueExplanations,
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
    };
  }

  const idx = queue.findIndex((q) => q.report.id === payload.reportId);
  if (idx < 0) {
    return {
      queueExplanations,
      model: 'mock-rules',
      fallbackUsed: false,
      analyzedAt: new Date().toISOString(),
    };
  }

  const item = queue[idx]!;
  const wardId = item.report.location.wardId;
  const hotspot = hotspots.find((h) => h.wardId === wardId);
  const hotspotRising = options?.hotspotRising ?? payload.hotspotRising ?? hotspot?.trend === 'rising';
  const duplicateRisk = payload.duplicateRisk ?? item.duplicateRisk;

  const issue = triageIssueFromQueueItem(
    { ...item, duplicateRisk },
    idx + 1,
    hotspotRising,
    options?.suspiciousReportIds?.has(item.report.id) ?? false,
  );

  return {
    issue,
    queueExplanations,
    model: 'mock-rules',
    fallbackUsed: false,
    analyzedAt: new Date().toISOString(),
  };
}

/** Ops Triage Copilot — decision support via secure gateway or local heuristics. */
export async function suggestOpsTriage(
  payload: OpsTriagePayload,
  queue: AdminQueueItem[],
  options?: { suspiciousReportIds?: Set<string> },
): Promise<OpsTriageMetadata> {
  const local = suggestOpsTriageLocally(payload, queue, options);

  if (!isAiGatewayEnabled()) {
    return local;
  }

  try {
    const response = await invokeAgent<Record<string, unknown>>(
      'ops_triage_copilot',
      'suggest',
      {
        adminId: payload.adminId,
        reportId: payload.reportId,
        wardId: payload.wardId,
        duplicateRisk: payload.duplicateRisk,
        hotspotRising: payload.hotspotRising,
      },
      { trigger: 'admin_issue_detail', actor: { id: payload.adminId, role: 'admin' } },
    );

    if (!response.data) return local;
    return mapGatewayData(response.data, {
      auditId: response.auditId,
      requestId: response.requestId,
      model: response.model,
      fallbackUsed: response.fallbackUsed,
    });
  } catch {
    return local;
  }
}
