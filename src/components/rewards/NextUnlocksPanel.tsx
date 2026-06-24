import { CivicProgressBar } from '@/components/motion/CivicProgressBar';
import { ArrowRight, Gift, Medal, Sparkles } from 'lucide-react';
import type { NextUnlockItem } from '@/domain/rewards-progress';
import { cn } from '@/lib/utils';



interface NextUnlocksPanelProps {

  items: NextUnlockItem[];

  className?: string;

}



const kindConfig = {

  badge: { icon: Medal, surface: 'border-civic-teal-200 bg-gradient-to-br from-civic-teal-50/60 to-white' },

  perk: { icon: Gift, surface: 'border-civic-blue-200 bg-gradient-to-br from-civic-blue-50/60 to-white' },

  rank: { icon: Sparkles, surface: 'border-civic-amber-200 bg-gradient-to-br from-civic-amber-50/60 to-white' },

};



export function NextUnlocksPanel({ items, className }: NextUnlocksPanelProps) {

  return (

    <section data-testid="next-unlocks-panel" className={cn('space-y-2.5 sm:space-y-3', className)}>

      <div>

        <h2 className="font-display text-base font-bold">Your next unlocks</h2>

        <p className="text-xs text-muted-foreground">

          Progress toward recognition — every step tied to verified impact

        </p>

      </div>



      {items.length === 0 ? (

        <div className="rounded-xl border border-civic-teal-300 bg-gradient-to-r from-civic-teal-50 to-civic-teal-50/30 px-3.5 py-3 text-sm font-medium text-civic-teal-900 sm:px-4">

          You&apos;ve cleared current milestones. Keep verifying and reporting to climb ranks.

        </div>

      ) : (

        <div className="space-y-2">

          {items.map((item, index) => {

            const config = kindConfig[item.kind];

            const Icon = config.icon;

            const isNearest = index === 0;



            return (

              <div

                key={item.id}

                data-testid={`next-unlock-${item.id}`}

                className={cn(

                  'rounded-xl border p-3 shadow-card animate-slide-up',

                  config.surface,

                  isNearest && 'ring-1 ring-civic-blue-200',

                )}

                style={{ animationDelay: `${index * 50}ms` }}

              >

                <div className="flex items-start gap-3">

                  <div

                    className={cn(

                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',

                      item.kind === 'badge' && 'bg-civic-teal-600 text-white',

                      item.kind === 'perk' && 'bg-civic-blue-600 text-white',

                      item.kind === 'rank' && 'bg-civic-amber-600 text-white',

                    )}

                  >

                    <Icon className="h-5 w-5" aria-hidden />

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-bold">{item.title}</p>

                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold tabular-nums text-civic-teal-800 ring-1 ring-civic-teal-200">

                        {item.progressPercent}%

                      </span>

                    </div>

                    <p className="mt-0.5 text-xs text-muted-foreground">{item.howToUnlock}</p>

                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-civic-blue-700">

                      <ArrowRight className="h-3 w-3" aria-hidden />

                      {item.gapLabel}

                    </p>

                    <CivicProgressBar value={item.progressPercent} variant="unlock" className="mt-2" />

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>

  );

}


