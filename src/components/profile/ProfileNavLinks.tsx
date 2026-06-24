import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import { featureFlags } from '@/lib/feature-flags';
import { familyModeCopy } from '@/domain/civic-identity';
import type { User } from '@/types';
import {
  ChevronRight,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

interface ProfileNavLinksProps {
  user: User;
}

export function ProfileNavLinks({ user }: ProfileNavLinksProps) {
  const family = familyModeCopy(user.role);
  const showFamily =
    featureFlags.youthMode && (user.familyHubId || user.role === 'parent' || user.role === 'youth');

  const links = [
    {
      id: 'rewards',
      to: ROUTES.rewards,
      icon: Trophy,
      title: 'Rewards & recognition',
      subtitle: 'Badges, ranks, and verified impact',
      testId: 'profile-nav-rewards',
      show: true,
    },
    {
      id: 'track',
      to: ROUTES.track,
      icon: ClipboardList,
      title: 'Track your reports',
      subtitle: 'Resolution journeys you started',
      testId: 'profile-nav-track',
      show: true,
    },
    {
      id: 'verify',
      to: ROUTES.community,
      icon: ShieldCheck,
      title: 'Verify nearby',
      subtitle: 'Confirm what you can see on the ground',
      testId: 'profile-nav-verify',
      show: true,
    },
    {
      id: 'family',
      to: ROUTES.family,
      icon: GraduationCap,
      title: family.title,
      subtitle: family.subtitle,
      testId: 'profile-nav-family',
      show: showFamily,
    },
  ];

  return (
    <section data-testid="profile-nav-links" className="space-y-2">
      <h2 className="font-display text-sm font-bold">Continue your civic work</h2>
      {links
        .filter((l) => l.show)
        .map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.id} to={link.to} data-testid={link.testId}>
              <Card className="card-interactive transition-shadow hover:shadow-elevated">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-blue-50 text-civic-blue-600">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.subtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
    </section>
  );
}
