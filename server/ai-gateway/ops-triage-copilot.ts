import { buildAdminQueue } from '../../src/domain/admin-queue-build.ts';
import { computeWardHotspots } from '../../src/domain/admin-hotspots.ts';
import { getOpenReportsForAnalysis } from '../data/open-reports.ts';
import { getUserById } from '../../src/services/mock/seed/users.ts';
import { seedSuspiciousCases } from '../../src/services/mock/seed/admin.ts';
import type { OpsTriagePayload, OpsTriageResult } from '../../shared/ops-triage-copilot.ts';
import {
  triageIssueFromQueueItem,
  triageQueueExplanations,
} from '../../src/domain/ops-triage-scoring.ts';

export function suggestOpsTriageCore(payload: OpsTriagePayload): OpsTriageResult {
  const reports = getOpenReportsForAnalysis();
  const queue = buildAdminQueue(reports, getUserById);
  const hotspots = computeWardHotspots(reports);
  const suspiciousReportIds = new Set(seedSuspiciousCases.map((c) => c.reportId));

  const queueExplanations = triageQueueExplanations(queue);

  if (!payload.reportId) {
    return { queueExplanations };
  }

  const idx = queue.findIndex((q) => q.report.id === payload.reportId);
  if (idx < 0) {
    return { queueExplanations };
  }

  const item = queue[idx]!;
  const wardId = item.report.location.wardId;
  const hotspot = hotspots.find((h) => h.wardId === wardId);
  const hotspotRising = payload.hotspotRising ?? hotspot?.trend === 'rising';
  const duplicateRisk = payload.duplicateRisk ?? item.duplicateRisk;

  const issue = triageIssueFromQueueItem(
    { ...item, duplicateRisk },
    idx + 1,
    hotspotRising,
    suspiciousReportIds.has(item.report.id),
  );

  return { issue, queueExplanations };
}

export async function heuristicOpsTriageSuggest(
  payload: OpsTriagePayload,
): Promise<{ data: Record<string, unknown>; confidence: number; model: string }> {
  const result = suggestOpsTriageCore(payload);
  const confidence =
    result.issue != null
      ? Math.min(1, (result.issue.confidenceScore + result.issue.urgencyScore) / 200)
      : 0.6;
  return {
    data: result as unknown as Record<string, unknown>,
    confidence,
    model: 'mock-rules',
  };
}
