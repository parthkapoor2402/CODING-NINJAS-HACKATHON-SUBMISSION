import type { Report } from '@/types';
import { VERIFICATION_SUPPORT_BONUS } from '@/domain/trust-updates';

export type CorroborationError = 'already_supported' | 'own_report' | 'not_found' | 'merged';

export interface CorroborationResult {
  ok: boolean;
  error?: CorroborationError;
  report?: Report;
  trustBonus?: number;
}

/** reportId → set of userIds who supported */
const supportByReport = new Map<string, Set<string>>();

export function hasUserSupported(reportId: string, userId: string): boolean {
  return supportByReport.get(reportId)?.has(userId) ?? false;
}

export function recordSupport(reportId: string, userId: string): void {
  const set = supportByReport.get(reportId) ?? new Set<string>();
  set.add(userId);
  supportByReport.set(reportId, set);
}

export function resetMockCorroboration(): void {
  supportByReport.clear();
}

export function validateCorroboration(
  report: Report | null,
  userId: string,
): CorroborationResult {
  if (!report) return { ok: false, error: 'not_found' };
  if (report.status === 'merged') return { ok: false, error: 'merged' };
  if (report.reporterId === userId) return { ok: false, error: 'own_report' };
  if (hasUserSupported(report.id, userId)) return { ok: false, error: 'already_supported' };
  return { ok: true, trustBonus: VERIFICATION_SUPPORT_BONUS };
}

export function applyCorroborationToReport(report: Report): Report {
  report.corroborationCount += 1;
  report.updatedAt = new Date().toISOString();
  if (report.status === 'pending_verification' && report.corroborationCount >= 2) {
    report.status = 'verified';
  } else if (report.status === 'submitted') {
    report.status = 'pending_verification';
  }
  return report;
}
