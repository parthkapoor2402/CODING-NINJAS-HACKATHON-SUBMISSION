import { CheckCircle2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { useReportDraftStore } from '@/store/reportDraftStore';

export function SuccessStep() {
  const reportId = useReportDraftStore((s) => s.draft.submittedReportId);
  const rewardEligible = useReportDraftStore((s) => s.draft.rewardEligible);
  const resetDraft = useReportDraftStore((s) => s.resetDraft);

  return (
    <div className="flex flex-col items-center py-8 text-center" data-testid="report-success">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-civic-teal-100">
        <CheckCircle2 className="h-10 w-10 text-civic-teal-600" />
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
        You spoke up for your block
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Reference <span className="font-mono text-xs">{reportId}</span>. Neighbors can confirm what
        you saw — verified reports reach crews faster than noise.
      </p>

      <div className="mt-6 w-full max-w-sm space-y-2 text-left">
        <div className="flex gap-3 rounded-xl border bg-card p-3 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-civic-blue-600" />
          <div>
            <p className="font-medium">Community verification</p>
            <p className="text-xs text-muted-foreground">
              Nearby residents strengthen your report before dispatch — that is how trust scales.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl border bg-card p-3 text-sm">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-civic-teal-600" />
          <div>
            <p className="font-medium">Transparent tracking</p>
            <p className="text-xs text-muted-foreground">
              Follow every status change from submitted to resolved — accountability built in.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-xl border bg-card p-3 text-sm">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-civic-amber-600" />
          <div>
            <p className="font-medium">Responsible recognition</p>
            <p className="text-xs text-muted-foreground">
              {rewardEligible !== false
                ? 'Verified impact earns trust points — never volume for its own sake.'
                : 'Rewards unlock after verification. Quality checks protect everyone who reports honestly.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
        <Button variant="civic" className="w-full" asChild onClick={() => resetDraft()}>
          <Link to={ROUTES.track}>Track my report</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild onClick={() => resetDraft()}>
          <Link to={ROUTES.community}>Help verify nearby issues</Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild onClick={() => resetDraft()}>
          <Link to={ROUTES.home}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
