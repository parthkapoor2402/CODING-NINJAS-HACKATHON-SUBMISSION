import { buildSeedReports } from '../../src/services/mock/seed/reports.ts';
import type { Report } from '../../src/types/index.ts';

const OPEN_STATUSES = new Set([
  'submitted',
  'acknowledged',
  'pending_verification',
  'verified',
  'in_progress',
]);

export function getOpenReportsForAnalysis(): Report[] {
  return buildSeedReports().filter((r) => OPEN_STATUSES.has(r.status));
}

export function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function countReporterReportsToday(reporterId: string | undefined, reports: Report[]): number {
  if (!reporterId) return 0;
  const today = new Date().toDateString();
  return reports.filter(
    (r) => r.reporterId === reporterId && new Date(r.createdAt).toDateString() === today,
  ).length;
}
