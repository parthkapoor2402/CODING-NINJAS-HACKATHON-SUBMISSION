import { MapPin, ShieldCheck } from 'lucide-react';
import type { VerifyOpportunity } from '@/domain/verification-orchestrator';

interface VerificationRecommendationBannerProps {
  opportunity: VerifyOpportunity;
  onSnooze?: () => void;
}

export function VerificationRecommendationBanner({
  opportunity,
  onSnooze,
}: VerificationRecommendationBannerProps) {
  return (
    <div
      className="rounded-xl border border-civic-teal-200 bg-gradient-to-br from-civic-teal-50/90 to-white p-4 shadow-sm"
      data-testid="verification-recommendation-banner"
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-civic-teal-100">
          <ShieldCheck className="h-5 w-5 text-civic-teal-700" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-civic-teal-800">
            Recommended for you
          </p>
          <p className="text-sm font-medium leading-snug">{opportunity.promptReason}</p>
          <p className="text-xs text-muted-foreground">{opportunity.impactMessage}</p>
          <p className="inline-flex items-center gap-1 text-xs font-medium text-civic-teal-700">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {opportunity.nearYouLabel}
            <span className="text-muted-foreground">·</span>
            {opportunity.confirmationsLabel}
          </p>
        </div>
      </div>
      {onSnooze ? (
        <button
          type="button"
          className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
          data-testid="verification-snooze-btn"
          onClick={onSnooze}
        >
          Not now — remind me later
        </button>
      ) : null}
    </div>
  );
}
