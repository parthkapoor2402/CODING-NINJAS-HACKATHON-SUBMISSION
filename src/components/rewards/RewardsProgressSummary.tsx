import { getCurrentLadderTier, getNextLadderTier, ladderProgress } from '@/domain/civic-ladder';

import { CivicProgressBar } from '@/components/motion/CivicProgressBar';

import { AnimatedMetric } from '@/components/motion/AnimatedMetric';

import { cardSurfaces } from '@/lib/card-surfaces';

import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';



interface RewardsProgressSummaryProps {

  verifiedImpact: number;

  pendingPoints: number;

  trustScore: number;

  contributionUnits: number;

  nextUnlockTitle?: string;

  className?: string;

}



export function RewardsProgressSummary({

  verifiedImpact,

  pendingPoints,

  trustScore,

  contributionUnits,

  nextUnlockTitle,

  className,

}: RewardsProgressSummaryProps) {

  const currentRank = getCurrentLadderTier(contributionUnits);

  const nextRank = getNextLadderTier(contributionUnits);

  const rankProgress = ladderProgress(contributionUnits);



  return (

    <section

      data-testid="rewards-progress-summary"

      className={cn(
        'overflow-hidden rounded-card border p-3.5 text-white sm:p-4',
        cardSurfaces.summaryHero,
        className,
      )}

    >

      <div className="flex items-center gap-2">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">

          <TrendingUp className="h-4 w-4" aria-hidden />

        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">

          Recognition & progression

        </p>

      </div>



      <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">

        <MetricCell

          icon={Sparkles}

          label="Verified impact"

          value={verifiedImpact}

          testId="verified-points-total"

        />

        <MetricCell icon={ShieldCheck} label="Trust score" value={trustScore} suffix="/ 100" />

        <div className={cn('col-span-2', cardSurfaces.summaryMetric)}>

          <div className="flex items-center justify-between gap-2">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">Civic rank</p>

              <p className="font-display text-lg font-bold">{currentRank.label}</p>

            </div>

            {nextRank ? (

              <div className="text-right">

                <p className="text-[10px] text-white/75">Next rank</p>

                <p className="text-sm font-bold">{nextRank.label}</p>

              </div>

            ) : null}

          </div>

          <CivicProgressBar

            value={rankProgress}

            variant="white"

            size="md"

            trackClassName="bg-white/20"

            aria-label="Rank progress"

          />

          <p className="mt-1 text-[10px] text-white/80">{rankProgress}% toward next tier</p>

        </div>

      </div>



      {nextUnlockTitle ? (

        <div className="mt-2.5 rounded-lg border border-white/25 bg-white/12 px-3 py-2 sm:mt-3">

          <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">Next unlock</p>

          <p className="mt-0.5 text-sm font-semibold">{nextUnlockTitle}</p>

        </div>

      ) : null}



      {pendingPoints > 0 ? (

        <p className="mt-2.5 text-xs text-white/90 sm:mt-3">

          +{pendingPoints} pending — unlocks when verified

        </p>

      ) : null}

    </section>

  );

}



function MetricCell({

  icon: Icon,

  label,

  value,

  suffix,

  testId,

}: {

  icon: typeof Sparkles;

  label: string;

  value: number;

  suffix?: string;

  testId?: string;

}) {

  return (

    <div className={cardSurfaces.summaryMetric}>

      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-white/75">

        <Icon className="h-3 w-3" aria-hidden />

        {label}

      </div>

      <p className="font-display text-xl font-bold tabular-nums sm:text-2xl" data-testid={testId}>

        <AnimatedMetric value={value} />

        {suffix ? <span className="text-sm font-medium text-white/75">{suffix}</span> : null}

      </p>

    </div>

  );

}


