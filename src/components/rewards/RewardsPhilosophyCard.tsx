import { Info } from 'lucide-react';
import { explainVerificationValue } from '@/domain/reward-explanations';

export function RewardsPhilosophyCard() {
  return (
    <div className="rounded-xl border border-civic-blue-100 bg-civic-blue-50/40 p-4 text-sm">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-civic-blue-600" aria-hidden />
        <div className="space-y-2">
          <p className="font-medium text-civic-blue-900">Recognition with guardrails</p>
          <p className="text-xs leading-relaxed text-civic-blue-900/85">
            Points, badges, and partner perks follow verified civic impact — never report volume.
            Duplicates and low-signal filings stay locked until cleared.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{explainVerificationValue()}</p>
        </div>
      </div>
    </div>
  );
}
