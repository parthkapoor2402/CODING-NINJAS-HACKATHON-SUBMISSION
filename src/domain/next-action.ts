import { ShieldCheck, Eye, FileText, Trophy } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { DynamicHeroContent, CivicMission } from '@/domain/home-missions';
import type { User } from '@/types';

export type NextActionUrgency = 'high' | 'medium' | 'calm';

export interface NextActionPrompt {
  id: string;
  title: string;
  detail: string;
  cta: string;
  route: string;
  urgency: NextActionUrgency;
  icon: 'verify' | 'report' | 'track' | 'rewards';
}

const iconMap = {
  verify: Eye,
  report: FileText,
  track: ShieldCheck,
  rewards: Trophy,
};

export function nextActionIcon(icon: NextActionPrompt['icon']) {
  return iconMap[icon];
}

export function computeNextActionPrompt(
  hero: DynamicHeroContent,
  missions: CivicMission[],
  user: User | null,
): NextActionPrompt {
  const activeMission = missions.find((m) => !m.completed);

  if (hero.ctaRoute === ROUTES.community || activeMission?.id === 'verify-nearby') {
    return {
      id: 'verify',
      title: 'Highest impact right now: confirm a nearby issue',
      detail:
        'One honest confirmation helps crews separate real problems from noise — takes under a minute.',
      cta: hero.ctaLabel || 'Open verify queue',
      route: ROUTES.community,
      urgency: 'high',
      icon: 'verify',
    };
  }

  if (hero.ctaRoute === ROUTES.track || activeMission?.id === 'track-resolution') {
    return {
      id: 'track',
      title: 'Your report is moving — stay with the journey',
      detail: 'Follow transparent ward updates until the fix is verified on the ground.',
      cta: 'View your progress',
      route: ROUTES.track,
      urgency: 'medium',
      icon: 'track',
    };
  }

  if (activeMission?.id === 'school-challenge') {
    return {
      id: 'challenge',
      title: 'Join your ward’s community challenge',
      detail: 'Verified participation counts toward shared goals — recognition, not lottery prizes.',
      cta: 'See challenges',
      route: ROUTES.rewards,
      urgency: 'medium',
      icon: 'rewards',
    };
  }

  if (!user || user.trust.contributionScore < 50) {
    return {
      id: 'report',
      title: 'Spot something on your route?',
      detail: 'Photo + location puts your block on the ward map. Quality evidence beats volume.',
      cta: 'Report an issue',
      route: ROUTES.report,
      urgency: 'calm',
      icon: 'report',
    };
  }

  return {
    id: 'rewards',
    title: 'Your verified impact is building',
    detail: 'Check recognition progress — every point ties to confirmed civic work.',
    cta: 'View rewards',
    route: ROUTES.rewards,
    urgency: 'calm',
    icon: 'rewards',
  };
}
