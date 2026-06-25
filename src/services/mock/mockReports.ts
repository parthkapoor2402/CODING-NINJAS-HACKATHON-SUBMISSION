import type { CreateReportInput, ReportRepository } from '@/services/types/reports';
import type { Report } from '@/types';
import { cloneSeedReports } from '@/services/mock/seed';
import {
  applyCorroborationToReport,
  recordSupport,
  validateCorroboration,
} from '@/services/mock/mockCorroboration';
import { appendIssueUpdate } from '@/services/mock/mockIssueUpdates';
import { delay } from '@/utils/format';

const reports: Report[] = cloneSeedReports();

/** Reset in-memory reports to seed data (tests). */
export function resetMockReports(): void {
  reports.length = 0;
  reports.push(...cloneSeedReports());
}

/** Snapshot of in-memory reports for admin queue building. */
export function getMockReportsSnapshot(): Report[] {
  return reports;
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const mockReportRepository: ReportRepository = {
  async list() {
    await delay(150);
    return reports.filter((r) => r.status !== 'merged');
  },

  async getById(id: string) {
    await delay(100);
    return reports.find((r) => r.id === id) ?? null;
  },

  async findNearby(lat: number, lng: number, radiusM: number) {
    await delay(150);
    return reports.filter(
      (r) =>
        r.status !== 'merged' &&
        haversineM(lat, lng, r.location.lat, r.location.lng) <= radiusM,
    );
  },

  async findByReporter(reporterId: string) {
    await delay(100);
    return reports.filter((r) => r.reporterId === reporterId);
  },

  async create(input: CreateReportInput) {
    await delay(200);
    const now = new Date().toISOString();
    const report: Report = {
      id: `report-${Date.now()}`,
      reporterId: input.reporterId,
      category: input.category,
      description: input.description,
      severity: input.severity,
      status: 'submitted',
      location: input.location,
      mediaIds: input.mediaIds ?? [],
      corroborationCount: 0,
      createdAt: now,
      updatedAt: now,
      aiMetadata: input.aiMetadata,
    };
    reports.push(report);
    return report;
  },

  async updateStatus(id: string, status: Report['status']) {
    await delay(150);
    const report = reports.find((r) => r.id === id);
    if (!report) throw new Error(`Report ${id} not found`);
    report.status = status;
    report.updatedAt = new Date().toISOString();
    if (status === 'resolved') report.resolvedAt = report.updatedAt;
    return report;
  },

  async merge(canonicalId: string, duplicateIds: string[]) {
    await delay(200);
    for (const dupId of duplicateIds) {
      const dup = reports.find((r) => r.id === dupId);
      if (dup) {
        dup.status = 'merged';
        dup.duplicateOfId = canonicalId;
        dup.updatedAt = new Date().toISOString();
      }
    }
  },

  async corroborate(reportId: string, userId: string) {
    await delay(120);
    const report = reports.find((r) => r.id === reportId) ?? null;
    const validation = validateCorroboration(report, userId);
    if (!validation.ok || !report) {
      return validation;
    }
    recordSupport(reportId, userId);
    const updated = applyCorroborationToReport(report);
    await appendIssueUpdate(reportId, {
      kind: 'community',
      message: `A neighbor confirmed this issue (${updated.corroborationCount} total confirmations).`,
      createdAt: new Date().toISOString(),
      actorLabel: 'Community',
    });
    return { ok: true, report: updated, trustBonus: validation.trustBonus };
  },

  async reopen(reportId: string, userId: string) {
    await delay(120);
    const report = reports.find((r) => r.id === reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);
    if (report.reporterId !== userId) throw new Error('Only the reporter can reopen');
    if (report.status !== 'resolved') throw new Error('Only resolved reports can be reopened');
    report.status = 'acknowledged';
    report.resolvedAt = undefined;
    report.reopenedAt = new Date().toISOString();
    report.updatedAt = report.reopenedAt;
    await appendIssueUpdate(reportId, {
      kind: 'system',
      message: 'Reporter reopened — fix did not hold. Issue returned to ward queue.',
      createdAt: report.reopenedAt,
      actorLabel: 'CivicResolve',
    });
    return report;
  },
};
