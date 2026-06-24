export type ChallengeScope = 'school' | 'neighborhood' | 'ward';

export interface CommunityChallenge {
  id: string;
  title: string;
  scope: ChallengeScope;
  description: string;
  goalLabel: string;
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
    goalLabel: '12 verified issues',
    progressPercent: 58,
    optional: true,
    status: 'active',
  },
  {
    id: 'challenge-ward-pothole',
    title: 'Ward 12 pothole sprint',
    scope: 'ward',
    description: 'Support existing pothole reports instead of filing duplicates. Recognition only — no prize lottery.',
    goalLabel: '20 corroborations',
    progressPercent: 72,
    optional: true,
    status: 'active',
  },
  {
    id: 'challenge-neighbor-intro',
    title: 'Neighbor intro week',
    scope: 'neighborhood',
    description: 'Confirm one real issue you can see on your street.',
    goalLabel: '1 verification per household',
    progressPercent: 100,
    optional: true,
    status: 'completed',
  },
];

export function listActiveChallenges(challenges = SEED_CHALLENGES): CommunityChallenge[] {
  return challenges.filter((c) => c.status === 'active');
}
