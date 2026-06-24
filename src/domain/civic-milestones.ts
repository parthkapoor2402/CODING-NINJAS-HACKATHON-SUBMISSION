export interface CivicMilestone {
  id: string;
  label: string;
  description: string;
  target: number;
  current: number;
  achieved: boolean;
}

export interface MilestoneInput {
  verifiedReportCount: number;
  corroborationCount: number;
  streakDays: number;
  resolvedFollowed: number;
}

export function buildMilestones(input: MilestoneInput): CivicMilestone[] {
  const defs = [
    {
      id: 'm-first-verify',
      label: 'First verified impact',
      description: 'One report confirmed by the community.',
      target: 1,
      current: input.verifiedReportCount,
    },
    {
      id: 'm-community-voice',
      label: 'Community voice',
      description: 'Five neighbor confirmations (support or verify).',
      target: 5,
      current: input.corroborationCount,
    },
    {
      id: 'm-streak-3',
      label: 'Three-day streak',
      description: 'Three consecutive days of civic participation.',
      target: 3,
      current: input.streakDays,
    },
    {
      id: 'm-resolution',
      label: 'Fix followed through',
      description: 'Track an issue through to resolution.',
      target: 1,
      current: input.resolvedFollowed,
    },
  ];

  return defs.map((d) => ({
    ...d,
    achieved: d.current >= d.target,
  }));
}
