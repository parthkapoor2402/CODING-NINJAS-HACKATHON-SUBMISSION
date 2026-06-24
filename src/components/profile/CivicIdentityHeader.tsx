import type { ReactNode } from 'react';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { AnimatedMetric } from '@/components/motion/AnimatedMetric';
import { TrustScoreRing, TrustBadge } from '@/components/trust/TrustScoreRing';
import { cardSurfaces } from '@/lib/card-surfaces';
import { cn } from '@/lib/utils';
import type { CivicIdentitySnapshot } from '@/domain/civic-identity';
import type { User } from '@/types';
import { Award, Flame, MapPin, Sparkles } from 'lucide-react';

interface CivicIdentityHeaderProps {
  user: User;
  snapshot: CivicIdentitySnapshot;
}

export function CivicIdentityHeader({ user, snapshot }: CivicIdentityHeaderProps) {
  return (
    <section
      data-testid="civic-identity-header"
      className={cn(
        'overflow-hidden rounded-2xl border p-4 text-white sm:p-5',
        cardSurfaces.summaryHero,
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="rounded-full bg-white/15 p-1 backdrop-blur-sm ring-2 ring-white/20">
          <TrustScoreRing score={user.trust.trustScore} size="lg" variant="on-dark" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            Civic identity
          </p>
          <h1 className="truncate font-display text-xl font-bold">{user.displayName}</h1>
          <div className="mt-2">
            <TrustBadge score={user.trust.trustScore} />
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {snapshot.neighborhood}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4">
        <StatPill icon={Award} label="Civic rank" value={snapshot.civicRank} />
        <StatPill
          icon={Sparkles}
          label="Verified impact"
          value={<AnimatedMetric value={snapshot.verifiedImpact} />}
          testId="profile-verified-impact"
          highlight
        />
        <StatPill
          icon={Flame}
          label="Streak"
          value={snapshot.streakDays > 0 ? `${snapshot.streakDays}d` : '—'}
        />
      </div>

      <div className={cn('mt-3', cardSurfaces.summaryMetric)}>
        <div className="flex items-center justify-between text-[10px] font-semibold text-white/85">
          <span>Progress to next rank</span>
          <span className="font-bold">{snapshot.rankProgress}%</span>
        </div>
        <div className="mt-1.5">
          <CivicProgressBar
            value={snapshot.rankProgress}
            variant="white"
            size="sm"
            trackClassName="bg-white/20"
          />
        </div>
      </div>

      {snapshot.verifiedImpact > 0 ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-white/90 sm:mt-3">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Your verified impact is visible to neighbors and ward ops.
        </p>
      ) : null}
    </section>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  testId,
  highlight,
}: {
  icon: typeof Award;
  label: string;
  value: ReactNode;
  testId?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl px-2 py-2 text-center backdrop-blur-sm sm:py-2.5',
        highlight ? 'bg-white/18 ring-1 ring-white/25' : 'bg-white/10',
      )}
    >
      <Icon className="mx-auto h-3.5 w-3.5 text-white/75" aria-hidden />
      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/70">{label}</p>
      <p className="mt-0.5 font-display text-sm font-bold tabular-nums" data-testid={testId}>
        {value}
      </p>
    </div>
  );
}
