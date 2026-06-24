export type ChallengeScope = 'school' | 'neighborhood' | 'ward';

export interface CommunityChallenge {
  id: string;
  title: string;
  scope: ChallengeScope;
  description: string;
  goalLabel: string;
  goalTarget: number;
  currentCount: number;
  momentumLabel: string;
  progressPercent: number;
  optional: boolean;
  status: 'upcoming' | 'active' | 'completed';
}

export const SEED_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'challenge-school-clean',
    title: 'School block walk-through',
    scope: 'school',
    description: 'Students and families verify sidewalk and lighting issues near campus — supervised proposals only for youth.',
    goalLabel: 'verified issues near campus',
    goalTarget: 12,
    currentCount: 7,
    momentumLabel: '+3 verified this week',
    progressPercent: 58,
    optional: true,
    status: 'active',
  },
  {
    id: 'challenge-ward-pothole',
    title: 'Ward 12 pothole sprint',
    scope: 'ward',
    description: 'Support existing pothole reports instead of filing duplicates. Recognition only — no prize lottery.',
    goalLabel: 'corroborations on pothole reports',
    goalTarget: 20,
    currentCount: 14,
    momentumLabel: '+5 confirmations today',
    progressPercent: 72,
    optional: true,
    status: 'active',
  },
  {
    id: 'challenge-neighbor-intro',
    title: 'Neighbor intro week',
    scope: 'neighborhood',
    description: 'Confirm one real issue you can see on your street.',
    goalLabel: 'verifications per household',
    goalTarget: 48,
    currentCount: 48,
    momentumLabel: 'Completed last week',
    progressPercent: 100,
    optional: true,
    status: 'completed',
  },
];

export function listActiveChallenges(challenges = SEED_CHALLENGES): CommunityChallenge[] {
  return challenges.filter((c) => c.status === 'active');
}
