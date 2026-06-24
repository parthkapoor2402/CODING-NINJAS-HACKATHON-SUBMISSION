import type { HeroAccent } from '@/domain/home-missions';
import type { IssueCategory } from '@/types';
import {
  Building2,
  CircleDot,
  Droplets,
  Lightbulb,
  MapPin,
  Trash2,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { categoryColors } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

/** Shared card surface roles — intentional contrast between module types */
export const cardSurfaces = {
  heroContext: {
    teal: 'border-civic-teal-300/70 bg-gradient-to-br from-civic-teal-100/80 via-white to-civic-blue-50 shadow-elevated',
    blue: 'border-civic-blue-300/70 bg-gradient-to-br from-civic-blue-100 via-white to-civic-teal-50/40 shadow-elevated',
    amber: 'border-civic-amber-300/70 bg-gradient-to-br from-civic-amber-100/90 via-white to-civic-amber-50 shadow-elevated',
  } satisfies Record<HeroAccent, string>,

  heroIcon: {
    teal: 'bg-civic-teal-600 text-white shadow-sm ring-2 ring-civic-teal-200',
    blue: 'bg-civic-blue-600 text-white shadow-sm ring-2 ring-civic-blue-200',
    amber: 'bg-civic-amber-600 text-white shadow-sm ring-2 ring-civic-amber-200',
  } satisfies Record<HeroAccent, string>,

  missionFeatured:
    'border-2 border-civic-blue-300/80 bg-gradient-to-br from-civic-blue-50 via-white to-civic-teal-50/30 shadow-elevated',
  missionDefault: 'border-border bg-card shadow-card hover:border-civic-blue-200',
  missionCompact: 'border-border/80 bg-muted/30 shadow-none hover:bg-card hover:shadow-card',
  missionDone: 'border-civic-teal-300/60 bg-gradient-to-r from-civic-teal-50 to-civic-teal-50/20',

  issueDefault: 'border-border bg-card',
  issueHighlighted: 'border-civic-blue-300/70 bg-gradient-to-br from-civic-blue-50/50 to-white shadow-elevated',
  issueLive:
    'border-2 border-civic-amber-400/60 bg-gradient-to-br from-civic-amber-50/50 via-white to-civic-teal-50/30 shadow-elevated ring-1 ring-civic-amber-200/40',
  issueDuplicate: 'border-l-[5px] border-l-civic-amber-500 border-border bg-civic-amber-50/20',
  issueResolved:
    'border-t-[4px] border-t-civic-teal-500 bg-gradient-to-b from-civic-teal-50/50 via-white to-card',

  badgeEarned:
    'border-civic-teal-300/80 bg-gradient-to-br from-civic-teal-50 via-white to-civic-teal-50/30 shadow-sm',
  badgeLocked: 'border-2 border-dashed border-muted-foreground/20 bg-muted/25',

  leaderboardYou: 'bg-gradient-to-r from-civic-blue-50 to-civic-teal-50/40 border-l-4 border-l-civic-blue-500',
  leaderboardTop: 'bg-gradient-to-r from-civic-amber-50/80 to-white',

  summaryHero:
    'border-civic-blue-200/80 bg-gradient-to-br from-civic-blue-600 via-civic-blue-700 to-civic-teal-600 shadow-elevated',
  summaryMetric: 'rounded-xl bg-white/12 p-2.5 backdrop-blur-sm ring-1 ring-white/15 sm:p-3',

  challengeHeader: {
    school: 'from-violet-600 to-purple-700',
    neighborhood: 'from-civic-teal-600 to-civic-blue-700',
    ward: 'from-civic-amber-600 to-orange-700',
  },
} as const;

export const categoryIcons: Record<IssueCategory, LucideIcon> = {
  pothole: CircleDot,
  water_leak: Droplets,
  streetlight: Lightbulb,
  garbage: Trash2,
  sanitation: Waves,
  infrastructure: Building2,
  other: MapPin,
};

export function categoryAccent(category: IssueCategory) {
  const color = categoryColors[category] ?? categoryColors.other;
  return { color, Icon: categoryIcons[category] ?? MapPin };
}

export function severityRail(severity: 'high' | 'medium' | 'low') {
  return cn(
    severity === 'high' && 'border-l-[5px] border-l-civic-amber-500',
    severity === 'medium' && 'border-l-[5px] border-l-civic-blue-400',
    severity === 'low' && 'border-l-[5px] border-l-border',
  );
}

export const rankMedalStyles: Record<number, string> = {
  1: 'bg-gradient-to-br from-civic-amber-400 to-civic-amber-600 text-white shadow-sm ring-2 ring-civic-amber-200',
  2: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm',
  3: 'bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-sm',
};
