export interface LadderTier {
  id: string;
  label: string;
  minContribution: number;
  description: string;
}

export const CIVIC_LADDER: LadderTier[] = [
  {
    id: 'neighbor',
    label: 'Neighbor',
    minContribution: 0,
    description: 'Getting started — report and confirm what you see.',
  },
  {
    id: 'block-voice',
    label: 'Block Voice',
    minContribution: 40,
    description: 'Consistent verified contributions in your ward.',
  },
  {
    id: 'ward-helper',
    label: 'Ward Helper',
    minContribution: 100,
    description: 'Trusted neighbor with repeated verified impact.',
  },
  {
    id: 'civic-champion',
    label: 'Civic Champion',
    minContribution: 200,
    description: 'Top-tier civic signal — recognition, not gimmicks.',
  },
];

export function getCurrentLadderTier(contributionUnits: number): LadderTier {
  let current = CIVIC_LADDER[0];
  for (const tier of CIVIC_LADDER) {
    if (contributionUnits >= tier.minContribution) current = tier;
  }
  return current;
}

export function getNextLadderTier(contributionUnits: number): LadderTier | null {
  const idx = CIVIC_LADDER.findIndex((t) => t.id === getCurrentLadderTier(contributionUnits).id);
  return CIVIC_LADDER[idx + 1] ?? null;
}

export function ladderProgress(contributionUnits: number): number {
  const current = getCurrentLadderTier(contributionUnits);
  const next = getNextLadderTier(contributionUnits);
  if (!next) return 100;
  const span = next.minContribution - current.minContribution;
  const progress = contributionUnits - current.minContribution;
  return Math.min(100, Math.round((progress / span) * 100));
}
