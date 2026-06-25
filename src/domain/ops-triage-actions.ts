import type { OpsTriageAction } from '@shared/ops-triage-copilot';
import { services } from '@/services/registry';
import type { Report } from '@/types';

export async function applyOpsTriageAction(
  action: OpsTriageAction,
  reportId: string,
  draftPayload: Record<string, unknown>,
  reason: string,
): Promise<Report | null> {
  const notePrefix = reason.trim() ? `Admin note (${reason.trim()}): ` : 'Triage action: ';

  switch (action) {
    case 'review_now': {
      const cases = await services.backend.admin.getSuspiciousCases();
      const linked = cases.find((c) => c.reportId === reportId);
      if (linked) {
        await services.backend.admin.reviewSuspiciousCase(linked.id);
      }
      await services.backend.admin.recordModerationNote(
        reportId,
        `${notePrefix}Marked for manual review`,
      );
      return services.reports.getById(reportId);
    }
    case 'request_verification': {
      await services.backend.admin.recordModerationNote(
        reportId,
        `${notePrefix}Requested additional neighbor verification before crew routing`,
      );
      return services.reports.getById(reportId);
    }
    case 'merge_candidate_review': {
      const canonicalId = String(draftPayload.canonicalHint ?? 'report-001');
      await services.backend.admin.recordModerationNote(
        reportId,
        `${notePrefix}Merge review opened against canonical ${canonicalId}`,
      );
      return services.reports.getById(reportId);
    }
    case 'assign_field_crew': {
      const workerId = String(draftPayload.workerId ?? 'user-worker-1');
      return services.backend.admin.assignWorker(reportId, workerId, reason.trim() || undefined);
    }
    case 'monitor': {
      await services.backend.admin.recordModerationNote(
        reportId,
        `${notePrefix}Monitoring crew progress — no status change`,
      );
      return services.reports.getById(reportId);
    }
    default:
      return null;
  }
}
