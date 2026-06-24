import type { SuspiciousCase } from '@/types';
import { applyAssignment } from '@/domain/admin-assignment';
import { computeCategoryTrends, duplicateRedirectRatePct } from '@/domain/admin-analytics-compute';
import { computeDashboardSnapshot } from '@/domain/admin-dashboard-metrics';
import { computeWardHotspots, openIssuePinCount } from '@/domain/admin-hotspots';
import { buildAdminQueue } from '@/domain/admin-queue-build';
import {
  dismissSuspiciousCase,
  resolveSuspiciousCase,
  startSuspiciousReview,
} from '@/domain/moderation-actions';
import { getUserById, seedUsers } from '@/services/mock/seed/users';
import { seedSuspiciousCases } from '@/services/mock/seed/admin';
import { seedPredictiveInsights, seedResponseTimeMetrics, seedRewardAbuseFlags } from '@/services/mock/seed/admin-analytics';
import { appendFieldWorkerUpdate, getFieldWorkerUpdatesForReport } from '@/services/mock/mockFieldWorkerUpdates';
import {
  getResolutionProofForReport,
  reviewResolutionProof,
} from '@/services/mock/mockResolutionProofs';
import { appendIssueUpdate } from '@/services/mock/mockIssueUpdates';
import { getMockReportsSnapshot, mockReportRepository } from '@/services/mock/mockReports';
import { delay } from '@/utils/format';

let suspiciousCases: SuspiciousCase[] = seedSuspiciousCases.map((c) => ({ ...c }));

export function resetMockAdmin(): void {
  suspiciousCases = seedSuspiciousCases.map((c) => ({ ...c }));
}

export const mockAdminService = {
  async getQueue() {
    await delay(150);
    return buildAdminQueue(getMockReportsSnapshot(), getUserById);
  },

  async getDashboardSnapshot() {
    await delay(100);
    const queue = buildAdminQueue(getMockReportsSnapshot(), getUserById);
    return computeDashboardSnapshot(queue, suspiciousCases, getMockReportsSnapshot());
  },

  async getSuspiciousCases() {
    await delay(150);
    return suspiciousCases.map((c) => ({ ...c }));
  },

  async getFieldWorkers() {
    await delay(50);
    return seedUsers.filter((u) => u.role === 'field_worker');
  },

  async assignWorker(reportId: string, workerId: string) {
    await delay(120);
    const report = await mockReportRepository.getById(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);
    const updated = applyAssignment(report, workerId);
    Object.assign(getMockReportsSnapshot().find((r) => r.id === reportId)!, updated);

    const worker = getUserById(workerId);
    await appendIssueUpdate(reportId, {
      kind: 'crew',
      message: `Assigned to ${worker?.displayName ?? 'field crew'} — work order opened.`,
      createdAt: new Date().toISOString(),
      actorLabel: 'Ward ops',
    });
    await appendFieldWorkerUpdate({
      reportId,
      workerId,
      message: 'Assignment received — crew dispatched.',
      createdAt: new Date().toISOString(),
      kind: 'status',
    });

    return updated;
  },

  async reviewSuspiciousCase(caseId: string) {
    await delay(100);
    const idx = suspiciousCases.findIndex((c) => c.id === caseId);
    if (idx < 0) throw new Error(`Case ${caseId} not found`);
    suspiciousCases[idx] = startSuspiciousReview(suspiciousCases[idx]);
    return { ...suspiciousCases[idx] };
  },

  async dismissSuspiciousCase(caseId: string) {
    await delay(100);
    const idx = suspiciousCases.findIndex((c) => c.id === caseId);
    if (idx < 0) throw new Error(`Case ${caseId} not found`);
    suspiciousCases[idx] = dismissSuspiciousCase(suspiciousCases[idx]);
    return { ...suspiciousCases[idx] };
  },

  async resolveSuspiciousCase(caseId: string) {
    await delay(100);
    const idx = suspiciousCases.findIndex((c) => c.id === caseId);
    if (idx < 0) throw new Error(`Case ${caseId} not found`);
    suspiciousCases[idx] = resolveSuspiciousCase(suspiciousCases[idx]);
    return { ...suspiciousCases[idx] };
  },

  async mergeDuplicateReport(canonicalId: string, duplicateId: string) {
    await delay(150);
    await mockReportRepository.merge(canonicalId, [duplicateId]);
    const dupCase = suspiciousCases.find((c) => c.reportId === duplicateId);
    if (dupCase) {
      const idx = suspiciousCases.findIndex((c) => c.id === dupCase.id);
      suspiciousCases[idx] = resolveSuspiciousCase(suspiciousCases[idx]);
    }
    await appendIssueUpdate(canonicalId, {
      kind: 'moderation',
      message: `Duplicate report merged into canonical issue ${canonicalId}.`,
      createdAt: new Date().toISOString(),
      actorLabel: 'Moderation',
    });
    return mockReportRepository.getById(canonicalId);
  },

  async overrideReportStatus(reportId: string, status: 'verified' | 'rejected' | 'acknowledged') {
    await delay(120);
    const updated = await mockReportRepository.updateStatus(reportId, status);
    await appendIssueUpdate(reportId, {
      kind: 'moderation',
      message: `Admin override — status set to ${status.replace('_', ' ')}.`,
      createdAt: new Date().toISOString(),
      actorLabel: 'Ops Admin',
    });
    return updated;
  },

  async getResponseTimeMetrics() {
    await delay(80);
    const snapshot = computeDashboardSnapshot(
      buildAdminQueue(getMockReportsSnapshot(), getUserById),
      suspiciousCases,
      getMockReportsSnapshot(),
    );
    return seedResponseTimeMetrics.map((m) =>
      m.label === 'Median verify time'
        ? { ...m, value: `${snapshot.medianVerifyHours}h` }
        : m,
    );
  },

  async getCategoryTrends() {
    await delay(80);
    return computeCategoryTrends(getMockReportsSnapshot());
  },

  async getRewardAbuseFlags() {
    await delay(80);
    return seedRewardAbuseFlags;
  },

  async getPredictiveInsights() {
    await delay(80);
    return seedPredictiveInsights;
  },

  async getHotspotInsights(categoryFilter: 'all' | 'water' | 'roads' = 'all') {
    await delay(80);
    return computeWardHotspots(getMockReportsSnapshot(), categoryFilter);
  },

  async getOpenIssuePinCount() {
    await delay(40);
    return openIssuePinCount(getMockReportsSnapshot());
  },

  async getDuplicateRedirectRate() {
    await delay(40);
    return duplicateRedirectRatePct(getMockReportsSnapshot());
  },

  async getResolutionProof(reportId: string) {
    return getResolutionProofForReport(reportId);
  },

  async reviewResolutionProof(proofId: string, action: 'approve' | 'reject', adminId: string) {
    const proof = await reviewResolutionProof(proofId, action, adminId);
    if (action === 'approve') {
      const report = getMockReportsSnapshot().find((r) => r.id === proof.reportId);
      if (report && report.status === 'in_progress') {
        await mockReportRepository.updateStatus(proof.reportId, 'resolved');
      }
    }
    return proof;
  },

  async getFieldWorkerUpdates(reportId: string) {
    return getFieldWorkerUpdatesForReport(reportId);
  },
};