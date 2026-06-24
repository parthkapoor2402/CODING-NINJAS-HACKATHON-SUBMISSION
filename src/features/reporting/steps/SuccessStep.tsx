import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  duplicateAcknowledgment,
  impactVisibilityMessage,
  pendingRecognitionMessage,
  successHeadline,
  successSubheadline,
} from '@/domain/report-success';
import { NeighborhoodQueueStep } from '@/components/reporting/NeighborhoodQueueStep';
import { ReportSuccessGuidance } from '@/components/reporting/ReportSuccessGuidance';
import { ReportSuccessActions } from '@/components/reporting/ReportSuccessActions';
import { useReportDraftStore } from '@/store/reportDraftStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export function SuccessStep() {
  const draft = useReportDraftStore((s) => s.draft);
  const resetDraft = useReportDraftStore((s) => s.resetDraft);
  const user = useAuthStore((s) => s.session?.user);

  const reportId = draft.submittedReportId;
  if (!reportId) return null;

  const duplicateNote = duplicateAcknowledgment(draft.duplicateWarning);

  return (
    <div
      className="mx-auto w-full max-w-md animate-slide-up pb-8"
      data-testid="report-success"
    >
      <div className="overflow-hidden rounded-2xl border border-civic-teal-100 bg-card shadow-elevated">
        <div className="gradient-civic-hero px-5 pb-6 pt-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-2 ring-white/25 success-icon-enter">
            <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={2.25} />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight animate-slide-up">
            {successHeadline(draft.category)}
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/90 animate-slide-up">
            {successSubheadline(reportId)}
          </p>
        </div>

        <div className="space-y-4 p-4">
          <div
            data-testid="impact-visibility-feedback"
            className="flex items-start gap-2.5 rounded-xl border border-civic-teal-200 bg-civic-teal-50/50 px-3 py-2.5"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-civic-teal-600" aria-hidden />
            <p className="text-xs font-medium leading-relaxed text-civic-teal-900">
              {impactVisibilityMessage()}
            </p>
          </div>

          <div
            data-testid="pending-recognition-note"
            className="flex items-start gap-2.5 rounded-xl border border-civic-amber-200 bg-civic-amber-50/50 px-3 py-2.5"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-civic-amber-700" aria-hidden />
            <p className="text-xs font-medium leading-relaxed text-civic-amber-950">
              {pendingRecognitionMessage()}
            </p>
          </div>

          <NeighborhoodQueueStep />

          {duplicateNote ? (
            <div
              data-testid="duplicate-avoidance-note"
              className={cn(
                'flex items-start gap-2.5 rounded-xl border px-3 py-2.5',
                duplicateNote.tone === 'positive'
                  ? 'border-civic-blue-200 bg-civic-blue-50/50'
                  : 'border-civic-amber-200 bg-civic-amber-50/60',
              )}
            >
              {duplicateNote.tone === 'positive' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-civic-blue-600" aria-hidden />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-civic-amber-700" aria-hidden />
              )}
              <div>
                <p className="text-xs font-semibold text-foreground">{duplicateNote.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {duplicateNote.detail}
                </p>
              </div>
            </div>
          ) : null}

          <ReportSuccessGuidance />

          {draft.rewardEligible === false ? (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Rewards unlock after community verification — quality checks protect everyone who
              reports honestly.
            </p>
          ) : (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Verified impact earns trust recognition — never volume for its own sake.
            </p>
          )}

          <ReportSuccessActions
            reportId={reportId}
            userRole={user?.role}
            hasFamilyHub={Boolean(user?.familyHubId)}
            onDone={resetDraft}
          />
        </div>
      </div>
    </div>
  );
}
