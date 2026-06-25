import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { duplicateTrustFromDraft } from '@/domain/duplicate-trust-local';
import { hasLowQualityWarning } from '@/features/reporting/report-media';
import { DuplicateTrustCard } from '@/features/reporting/components/DuplicateTrustCard';
import { submitReportDraft } from '@/features/reporting/submit-report';
import {
  analyzeDuplicateTrust,
  duplicateTrustToDraftUpdates,
} from '@/services/ai/duplicate-trust-agent';
import { services } from '@/services/registry';
import { useAuthStore } from '@/store/authStore';
import { selectCanSubmit, useReportDraftStore } from '@/store/reportDraftStore';

export function ReviewStep() {
  const draft = useReportDraftStore((s) => s.draft);
  const canSubmit = useReportDraftStore(selectCanSubmit);
  const setStep = useReportDraftStore((s) => s.setStep);
  const setDuplicateWarning = useReportDraftStore((s) => s.setDuplicateWarning);
  const updateDraft = useReportDraftStore((s) => s.updateDraft);
  const userId = useAuthStore((s) => s.session?.user.id);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const showLowQuality = hasLowQualityWarning(draft.mediaAttachments);

  useEffect(() => {
    if (!draft.location || !draft.category) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    setChecking(true);

    const runChecks = async () => {
      const recentReports = userId
        ? await services.reports.findByReporter(userId)
        : [];
      if (cancelled) return;

      const today = new Date().toDateString();
      const recentToday = recentReports.filter(
        (r) => new Date(r.createdAt).toDateString() === today,
      ).length;

      const payload = duplicateTrustFromDraft(draft, {
        reporterId: userId,
        reportsToday: recentToday,
        duplicateAttemptsToday: draft.duplicateTrust ? 1 : 0,
      });

      const result = await analyzeDuplicateTrust(payload, { actorId: userId });
      if (cancelled) return;

      const updates = duplicateTrustToDraftUpdates(result);
      if (updates.duplicateWarning) {
        setDuplicateWarning(updates.duplicateWarning);
      } else {
        setDuplicateWarning(undefined);
      }

      updateDraft({
        duplicateTrust: result,
        suspiciousFlag: updates.suspiciousFlag,
        rewardEligible: updates.rewardEligible,
      });
      setChecking(false);
    };

    void runChecks().catch(() => {
      if (!cancelled) setChecking(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, draft.location?.lat, draft.location?.lng, draft.category]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await submitReportDraft();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="report-review-step">
      <div className="rounded-xl border bg-card p-4 text-sm">
        <p className="font-semibold">{draft.title}</p>
        <p className="mt-1 text-muted-foreground">{draft.description}</p>
        <p className="mt-2 text-xs capitalize text-muted-foreground">
          {draft.category?.replace('_', ' ')} · {draft.severity} severity ·{' '}
          {draft.mediaAttachments.length} evidence file(s)
        </p>
      </div>

      {checking ? (
        <p className="text-xs text-muted-foreground">Checking for nearby matches and trust signals…</p>
      ) : null}

      {draft.duplicateTrust && !checking ? (
        <DuplicateTrustCard result={draft.duplicateTrust} />
      ) : null}

      {showLowQuality ? (
        <div
          className="rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 p-3 text-sm"
          data-testid="low-quality-warning"
          role="status"
        >
          <p className="font-medium text-amber-900">Low-quality evidence detected</p>
          <p className="mt-1 text-xs text-amber-900/80">
            A clearer photo helps verification — you may still submit.
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        variant="civic"
        className="w-full"
        size="lg"
        data-testid="report-submit-btn"
        disabled={!canSubmit || submitting || checking}
        onClick={handleSubmit}
      >
        {submitting ? 'Submitting…' : 'Submit report'}
      </Button>

      <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>
        Back
      </Button>
    </div>
  );
}
