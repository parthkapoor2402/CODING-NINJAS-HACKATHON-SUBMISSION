import type { RewardEvent, UserRole } from '@/types';
import { YOUTH_MAX_CORROBORATION_POINTS } from '@/domain/reward-eligibility';

const SUPERVISED_ROLES: UserRole[] = ['youth'];

export function isSupervisedRole(role: UserRole): boolean {
  return SUPERVISED_ROLES.includes(role);
}

export function canYouthRedeem(role: UserRole): boolean {
  return !isSupervisedRole(role);
}

export function getYouthPointCap(role: UserRole): number | null {
  return isSupervisedRole(role) ? YOUTH_MAX_CORROBORATION_POINTS : null;
}

export interface FamilyContributionView {
  id: string;
  label: string;
  points: number;
  verified: boolean;
}

/** Family hub view — no report IDs or sensitive metadata for youth-facing lists. */
export function toFamilySafeContributions(
  events: RewardEvent[],
  viewerRole: UserRole,
): FamilyContributionView[] {
  return events.map((e) => ({
    id: e.id,
    label: isSupervisedRole(viewerRole)
      ? safeLabelForYouth(e.type)
      : `${e.type.replace(/_/g, ' ')}`,
    points: e.verified ? e.points : 0,
    verified: e.verified,
  }));
}

function safeLabelForYouth(type: string): string {
  const map: Record<string, string> = {
    verified_report: 'Community report (verified)',
    corroboration: 'Helped confirm an issue',
    support_existing: 'Supported a neighbor report',
    resolution: 'Issue marked fixed',
    submitted_report: 'Report pending review',
  };
  return map[type] ?? 'Civic contribution';
}
