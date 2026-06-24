import type { Report, Severity } from '@/types';

const SEVERITY_WEIGHT: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_URGENCY: Partial<Record<Report['status'], number>> = {
  pending_verification: 4,
  submitted: 3,
  acknowledged: 2,
  in_progress: 2,
  verified: 1,
};

export interface IssueFeedItem {
  report: Report;
  distanceKm: number;
}

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function urgencyScore(report: Report): number {
  const severity = SEVERITY_WEIGHT[report.severity] ?? 1;
  const status = STATUS_URGENCY[report.status] ?? 0;
  const verificationBoost = report.status === 'pending_verification' ? 2 : 0;
  return severity * 10 + status * 5 + verificationBoost - report.corroborationCount;
}

export function sortIssuesByDistance(items: IssueFeedItem[]): IssueFeedItem[] {
  return [...items].sort((a, b) => a.distanceKm - b.distanceKm);
}

export function sortIssuesByUrgency(reports: Report[]): Report[] {
  return [...reports].sort((a, b) => urgencyScore(b) - urgencyScore(a));
}

export function withDistances(
  reports: Report[],
  userLat: number,
  userLng: number,
): IssueFeedItem[] {
  return reports.map((report) => ({
    report,
    distanceKm: distanceKm(userLat, userLng, report.location.lat, report.location.lng),
  }));
}
