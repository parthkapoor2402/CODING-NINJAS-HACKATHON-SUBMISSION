import type { Report, Severity, User } from '@/types';

/** Demo user anchor (Bengaluru neighborhood center). */
export const USER_ANCHOR = { lat: 12.9716, lng: 77.5946 };

const SEVERITY_WEIGHT: Record<Severity, number> = {
  high: 30,
  medium: 18,
  low: 8,
};

const ESCALATION_THRESHOLD = 2;

export interface VerifyOpportunity {
  report: Report;
  distanceKm: number;
  rankScore: number;
  confirmationsNeeded: number;
  unlocksEscalation: boolean;
  daysOpen: number;
  socialProofLabel: string;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function daysOpen(report: Report): number {
  return Math.floor((Date.now() - new Date(report.createdAt).getTime()) / 86400000);
}

function rankOpportunity(report: Report, distanceKm: number): number {
  const underConfirmed = Math.max(0, ESCALATION_THRESHOLD - report.corroborationCount) * 25;
  const urgency = SEVERITY_WEIGHT[report.severity];
  const proximity = Math.max(0, 100 - distanceKm * 120);
  const age = Math.min(daysOpen(report) * 4, 20);
  const socialGap = report.corroborationCount === 0 ? 15 : report.corroborationCount === 1 ? 22 : 5;
  return proximity + urgency + underConfirmed + age + socialGap;
}

function socialProof(report: Report): string {
  if (report.corroborationCount === 0) return 'No neighbor confirmations yet';
  if (report.corroborationCount === 1) return '1 neighbor confirmed — one more helps routing';
  return `${report.corroborationCount} neighbors confirmed`;
}

export function isVerifiableOpportunity(
  report: Report,
  user: User | null,
  dismissedIds: Set<string>,
): boolean {
  if (report.status !== 'pending_verification') return false;
  if (!user) return false;
  if (report.reporterId === user.id) return false;
  if (dismissedIds.has(report.id)) return false;
  return true;
}

export function buildVerifyQueue(
  reports: Report[],
  user: User | null,
  dismissedIds: string[] = [],
  anchor = USER_ANCHOR,
): VerifyOpportunity[] {
  const dismissed = new Set(dismissedIds);

  return reports
    .filter((r) => isVerifiableOpportunity(r, user, dismissed))
    .map((report) => {
      const distanceKm = haversineKm(
        anchor.lat,
        anchor.lng,
        report.location.lat,
        report.location.lng,
      );
      const needed = Math.max(0, ESCALATION_THRESHOLD - report.corroborationCount);
      return {
        report,
        distanceKm,
        rankScore: rankOpportunity(report, distanceKm),
        confirmationsNeeded: needed,
        unlocksEscalation: report.corroborationCount < ESCALATION_THRESHOLD,
        daysOpen: daysOpen(report),
        socialProofLabel: socialProof(report),
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore);
}

export function escalationMessage(before: number, after: number): string | null {
  if (before < ESCALATION_THRESHOLD && after >= ESCALATION_THRESHOLD) {
    return 'You helped move this issue closer to crew review — verification threshold reached.';
  }
  if (after > before) {
    return 'You helped move this issue closer to crew review.';
  }
  return null;
}

export function verifyHeroCopy(count: number): { headline: string; subline: string } {
  if (count === 0) {
    return {
      headline: 'No local reports need your eyes right now',
      subline: 'Check back when you are out in the neighborhood — quick confirms separate signal from noise.',
    };
  }
  const noun = count === 1 ? 'report needs' : 'reports need';
  return {
    headline: `${count} local ${noun} eyes on them`,
    subline:
      'Confirm only what you can see. Your input helps crews trust real issues — and filters noise.',
  };
}
