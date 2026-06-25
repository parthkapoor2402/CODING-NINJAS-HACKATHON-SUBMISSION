import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import type { VerifyOpportunity } from '@/domain/verification-orchestrator';

interface HomeVerifyRecommendationProps {
  opportunity: VerifyOpportunity;
}

export function HomeVerifyRecommendation({ opportunity }: HomeVerifyRecommendationProps) {
  return (
    <div
      className="rounded-xl border border-civic-teal-200 bg-civic-teal-50/50 p-4"
      data-testid="home-verify-recommendation"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-civic-teal-700" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{opportunity.nearYouLabel}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{opportunity.confirmationsLabel}</p>
          <p className="mt-2 text-xs leading-relaxed text-foreground/90">
            {opportunity.impactMessage}
          </p>
          <Button variant="teal" size="sm" className="mt-3" asChild>
            <Link to={ROUTES.community}>
              Confirm nearby
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
