import { Eye, ShieldCheck } from 'lucide-react';
import { verifyHeroCopy } from '@/domain/verify-queue';

interface VerifyHeroProps {
  opportunityCount: number;
}

export function VerifyHero({ opportunityCount }: VerifyHeroProps) {
  const { headline, subline } = verifyHeroCopy(opportunityCount);

  return (
    <header
      data-testid="verify-hero"
      className="overflow-hidden rounded-card border border-civic-teal-200 bg-gradient-to-br from-civic-teal-600 to-civic-blue-600 p-4 text-white shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
          <Eye className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
            Neighbor verification
          </p>
          <h1 className="mt-1 font-display text-lg font-bold leading-tight">{headline}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">{subline}</p>
          <p className="mt-2 text-[10px] font-medium text-white/65">
            Curated ward queue — confirm only what you can see on the ground.
          </p>
        </div>
        {opportunityCount > 0 ? (
          <div className="flex shrink-0 flex-col items-end gap-1">
            <div
              className="flex h-10 min-w-10 flex-col items-center justify-center rounded-xl bg-white/20 px-2 ring-1 ring-white/25"
              data-testid="verify-hero-count"
            >
              <span className="font-display text-xl font-bold tabular-nums">{opportunityCount}</span>
            </div>
            <span className="rounded-md bg-civic-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Needs eyes
            </span>
          </div>
        ) : (
          <ShieldCheck className="h-8 w-8 shrink-0 text-white/60" aria-hidden />
        )}
      </div>
    </header>
  );
}
