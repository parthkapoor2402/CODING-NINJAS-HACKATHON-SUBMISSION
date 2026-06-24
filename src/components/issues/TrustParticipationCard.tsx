import { ShieldCheck, Sparkles } from 'lucide-react';
import { VERIFICATION_SUPPORT_BONUS } from '@/domain/trust-updates';

interface TrustParticipationCardProps {
  variant?: 'compact' | 'full';
}

export function TrustParticipationCard({ variant = 'full' }: TrustParticipationCardProps) {
  if (variant === 'compact') {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        Confirm only what you can see. Useful verification earns trust (+{VERIFICATION_SUPPORT_BONUS}{' '}
        verification pts). Spam and duplicates reduce rewards.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-civic-teal-100 bg-gradient-to-br from-civic-teal-50/80 to-white p-4 text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-civic-teal-100 text-civic-teal-700">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div className="space-y-2">
          <p className="font-display font-semibold text-foreground">Community signal, not noise</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your confirmations help crews prioritize real problems. Verified, useful participation
            increases your trust score. Repeat or duplicate reports do not earn points and may lower
            rewards.
          </p>
          <p className="inline-flex items-center gap-1 text-xs font-medium text-civic-teal-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            +{VERIFICATION_SUPPORT_BONUS} verification pts per confirmed issue you did not report
          </p>
        </div>
      </div>
    </div>
  );
}
