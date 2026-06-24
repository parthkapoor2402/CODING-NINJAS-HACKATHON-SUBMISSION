import type { DuplicateWarning } from '@/types/reporting';
import type { IssueCategory, UserRole } from '@/types';
import { categoryLabel } from '@/utils/labels';

const HIGH_DUPLICATE_THRESHOLD = 70;

export interface ReportSuccessContext {
  reportId: string;
  category?: IssueCategory;
  rewardEligible?: boolean;
  duplicateWarning?: DuplicateWarning;
  userRole?: UserRole;
  hasFamilyHub?: boolean;
}

export function successHeadline(category?: IssueCategory): string {
  if (category) {
    return `You started real momentum on ${categoryLabel(category).toLowerCase()}`;
  }
  return 'You started real civic momentum';
}

export function successSubheadline(reportId: string): string {
  return `Report ${reportId} is live in your neighborhood queue — the first step toward a verified fix.`;
}

export function impactVisibilityMessage(): string {
  return 'Neighbors on your block can now confirm what they see — that community proof is what moves crews to act.';
}

export function pendingRecognitionMessage(): string {
  return 'Recognition unlocks after verification — your honest report protects everyone from reward farming.';
}

export function duplicateAcknowledgment(
  duplicateWarning?: DuplicateWarning,
): { title: string; detail: string; tone: 'positive' | 'caution' } | null {
  if (!duplicateWarning) {
    return {
      title: 'Distinct report — queue stays clean',
      detail:
        'No high-confidence duplicate was detected nearby. You added signal without repeating an open report.',
      tone: 'positive',
    };
  }

  if (duplicateWarning.score >= HIGH_DUPLICATE_THRESHOLD) {
    return {
      title: 'Similar report already open nearby',
      detail:
        'You filed separately — that is okay. If both are real, ward ops may merge them. Verifying the existing report also helps crews.',
      tone: 'caution',
    };
  }

  return {
    title: 'Low duplicate risk detected',
    detail: 'Your report looks sufficiently distinct. Neighbors will confirm before routing.',
    tone: 'positive',
  };
}

export function shouldShowFamilyChallenge(role?: UserRole, hasFamilyHub?: boolean): boolean {
  if (!hasFamilyHub) return false;
  return role === 'youth' || role === 'parent';
}

export const GUIDANCE_SECTIONS = [
  {
    id: 'why-verify',
    title: 'Why verification matters',
    body: 'Neighbors confirm what they can see on the ground. Verified reports reach crews with higher confidence — and protect honest reporters from noise.',
  },
  {
    id: 'what-next',
    title: 'What happens next',
    body: 'Nearby residents may confirm your report. Ward ops review the signal, assign crews when warranted, and post official updates you can follow transparently.',
  },
  {
    id: 'verify-instead',
    title: 'Verify nearby instead of duplicating',
    body: 'If you spot an issue already on the map, confirm it instead of filing again. Useful verification earns trust — duplicate filings do not.',
  },
] as const;

export const QUEUE_STEPS = [
  { id: 'submitted', label: 'You reported', status: 'complete' as const },
  { id: 'queue', label: 'Neighborhood queue', status: 'active' as const },
  { id: 'verify', label: 'Community proof', status: 'upcoming' as const },
  { id: 'route', label: 'Ward routing', status: 'upcoming' as const },
];
