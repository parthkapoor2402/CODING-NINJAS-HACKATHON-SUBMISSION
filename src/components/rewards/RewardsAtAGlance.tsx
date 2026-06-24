import type { ReactNode } from 'react';
import { Gift, Lock, Sparkles } from 'lucide-react';

interface RewardsAtAGlanceProps {
  verifiedPoints: number;
  pendingPoints: number;
}

/** One-screen explainer — judges should grok rewards in under 10 seconds. */
export function RewardsAtAGlance({ verifiedPoints, pendingPoints }: RewardsAtAGlanceProps) {
  return (
    <div
      className="rounded-xl border border-civic-teal-200 bg-gradient-to-br from-civic-teal-50/70 to-white p-4"
      data-testid="rewards-at-a-glance"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-civic-teal-700">
        How rewards work
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <GlanceItem
          icon={<Sparkles className="h-4 w-4 text-civic-amber-600" />}
          title="Earn on verified impact"
          body="Points unlock when neighbors or crews confirm your report was useful."
        />
        <GlanceItem
          icon={<Lock className="h-4 w-4 text-civic-blue-600" />}
          title="Duplicates earn nothing"
          body="Support existing issues instead — corroboration counts, spam does not."
        />
        <GlanceItem
          icon={<Gift className="h-4 w-4 text-civic-teal-600" />}
          title="Redeem with trust"
          body={`You have ${verifiedPoints} redeemable pts${pendingPoints > 0 ? ` (+${pendingPoints} pending)` : ''}.`}
        />
      </div>
    </div>
  );
}

function GlanceItem({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg bg-white/70 p-3 text-left shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-semibold text-foreground">{title}</p>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
