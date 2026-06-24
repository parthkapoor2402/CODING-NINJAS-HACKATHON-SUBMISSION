import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { assessSuspiciousReport } from '@/domain/suspicious-report';
import { findLocalDuplicateMatches, isHighDuplicateRisk } from '@/domain/duplicate-detection';
import { hasLowQualityWarning } from '@/features/reporting/report-media';
import { submitReportDraft } from '@/features/reporting/submit-report';
import { ROUTES } from '@/lib/constants';
import { reportDisplayName } from '@/lib/report-display';
import { getSeedReportById } from '@/services/mock/seed/reports';
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
      const fullDescription = `${draft.title} ${draft.description}`.trim();
      const duplicateInput = {
        description: fullDescription,
        category: draft.category!,
        lat: draft.location!.lat,
        lng: draft.location!.lng,
      };

      const [localMatches, recentReports] = await Promise.all([
        findLocalDuplicateMatches(duplicateInput),
        userId ? services.reports.findByReporter(userId) : Promise.resolve([]),
      ]);

      if (cancelled) return;

      const localRisk = localMatches[0]?.score ?? 0;
      if (isHighDuplicateRisk({ riskScore: localRisk, matches: localMatches }) && localMatches[0]) {
        setDuplicateWarning({
          reportId: localMatches[0].reportId,
          score: localRisk,
        });
      }

      const today = new Date().toDateString();
      const recentToday = recentReports.filter(
        (r) => new Date(r.createdAt).toDateString() === today,
      ).length;

      const suspicious = assessSuspiciousReport(draft, {
        recentReportCount: recentToday,
        duplicateRiskScore: localRisk,
      });

      updateDraft({
        suspiciousFlag: suspicious,
        rewardEligible: suspicious.rewardEligible && localRisk < 70,
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

  const suspicious = draft.suspiciousFlag;
  const duplicateMatch = draft.duplicateWarning
    ? getSeedReportById(draft.duplicateWarning.reportId)
    : undefined;
  const duplicateLabel = duplicateMatch
    ? reportDisplayName(duplicateMatch)
    : 'a nearby report';

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

      {draft.duplicateWarning ? (
        <div
          className="rounded-xl border border-civic-amber-300 bg-civic-amber-50/70 p-3 text-sm"
          data-testid="duplicate-warning"
          role="status"
        >
          <p className="font-medium text-amber-900">
            Neighbors may already be on this
          </p>
          <p className="mt-1 text-xs text-amber-900/80">
            <strong>{duplicateLabel}</strong> is open nearby ({draft.duplicateWarning.score}% match).
            Strengthen that report instead of filing again — crews prioritize confirmed signal, and
            your trust score benefits from useful corroboration.
          </p>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link
              to={ROUTES.issueDetail(draft.duplicateWarning.reportId)}
              data-testid="support-existing-report"
            >
              View &amp; support existing report
            </Link>
          </Button>
        </div>
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

      {suspicious?.flagged ? (
        <div
          className="rounded-xl border border-civic-blue-200 bg-civic-blue-50/50 p-3 text-sm"
          data-testid="suspicious-warning"
          role="status"
        >
          <p className="font-medium text-civic-blue-900">Extra care before routing</p>
          <p className="mt-1 text-xs text-civic-blue-800/90">
            We protect neighborhood signal quality — this helps honest reporters, not penalties.
          </p>
          <ul className="mt-2 space-y-1 text-xs text-civic-blue-800/90">
            {suspicious.reasons.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
          {!suspicious.rewardEligible ? (
            <p className="mt-2 text-xs text-civic-blue-800">
              Rewards unlock after community or admin verification.
            </p>
          ) : null}
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
