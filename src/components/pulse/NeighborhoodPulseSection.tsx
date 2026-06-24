import {
  buildNeighborhoodPulse,
  enrichActiveResidents,
  type PulseSurface,
} from '@/domain/neighborhood-pulse';
import { seedUsers } from '@/services/mock/seed/users';
import type { Report, User } from '@/types';
import { NeighborhoodPulseModule, type PulseModuleVariant } from './NeighborhoodPulseModule';
import { YourWardImpactNugget } from './YourWardImpactNugget';

interface NeighborhoodPulseSectionProps {
  reports: Report[];
  user: User | null;
  surface: PulseSurface;
  verifyActionsThisWeek?: number;
  variant?: PulseModuleVariant;
  showImpactNugget?: boolean;
  className?: string;
}

export function NeighborhoodPulseSection({
  reports,
  user,
  surface,
  verifyActionsThisWeek = 0,
  variant = 'full',
  showImpactNugget = true,
  className,
}: NeighborhoodPulseSectionProps) {
  const base = buildNeighborhoodPulse({
    reports,
    user,
    surface,
    verifyActionsThisWeek,
  });

  const snapshot = enrichActiveResidents(base, seedUsers, reports);

  return (
    <div className={className} data-testid={`neighborhood-pulse-${surface}`}>
      <NeighborhoodPulseModule
        metrics={snapshot.metrics}
        microcopy={snapshot.microcopy}
        variant={variant}
      />
      {showImpactNugget && snapshot.wardImpact ? (
        <YourWardImpactNugget nugget={snapshot.wardImpact} className="mt-2.5" />
      ) : null}
    </div>
  );
}
