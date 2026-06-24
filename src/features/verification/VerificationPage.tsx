import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { ActionFeedbackToast, type ActionFeedback } from '@/components/home/ActionFeedbackToast';
import { CivicAccountabilityStrip } from '@/components/civic/CivicAccountabilityStrip';
import { VerifyHero } from '@/components/verification/VerifyHero';
import { NeighborhoodPulseSection } from '@/components/pulse/NeighborhoodPulseSection';
import { VerificationStreakBar } from '@/components/verification/VerificationStreakBar';
import { VerifyOpportunityCard } from '@/components/verification/VerifyOpportunityCard';
import { LoadingState } from '@/components/states/LoadingState';
import { EmptyState } from '@/components/states/EmptyState';
import {
  buildVerifyQueue,
  escalationMessage,
  type VerifyOpportunity,
} from '@/domain/verify-queue';
import {
  TRUST_SCORE_PER_VERIFICATION,
  VERIFICATION_SUPPORT_BONUS,
} from '@/domain/trust-updates';
import { ROUTES } from '@/lib/constants';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import { applyTrustUpdate, useAuthStore, useCurrentUser } from '@/store/authStore';
import { useVerifyActivityStore } from '@/store/verifyActivityStore';
import type { Report } from '@/types';

export default function VerificationPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);

  const dismissedIds = useVerifyActivityStore((s) => s.dismissedIds);
  const activityDates = useVerifyActivityStore((s) => s.activityDates);
  const recordUsefulVerification = useVerifyActivityStore((s) => s.recordUsefulVerification);
  const dismissOpportunity = useVerifyActivityStore((s) => s.dismissOpportunity);
  const getVerificationStreak = useVerifyActivityStore((s) => s.getVerificationStreak);
  const isStreakActiveToday = useVerifyActivityStore((s) => s.isStreakActiveToday);

  useEffect(() => {
    services.reports.list().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const t = window.setTimeout(() => setFeedback(null), 5000);
    return () => window.clearTimeout(t);
  }, [feedback]);

  const queue = useMemo(
    () => buildVerifyQueue(reports, user, dismissedIds),
    [reports, user, dismissedIds],
  );

  const streak = getVerificationStreak();
  const activeToday = isStreakActiveToday();

  const verifyActionsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return activityDates.filter((d) => new Date(d).getTime() >= weekAgo).length;
  }, [activityDates]);

  const handleConfirm = useCallback(
    async (opportunity: VerifyOpportunity) => {
      const sessionUserId = useAuthStore.getState().session?.user.id;
      if (!sessionUserId) {
        navigate(ROUTES.auth);
        return;
      }

      const beforeCount = opportunity.report.corroborationCount;
      setConfirmingId(opportunity.report.id);

      const result = await services.reports.corroborate(opportunity.report.id, sessionUserId);

      if (result.ok && result.report) {
        const updated = result.report;
        setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        applyTrustUpdate();
        recordUsefulVerification();
        dismissOpportunity(opportunity.report.id);
        setCompletedId(opportunity.report.id);

        const escalation = escalationMessage(beforeCount, updated.corroborationCount);
        setFeedback({
          id: `verify-${updated.id}`,
          title: escalation ?? 'Confirmed — you strengthened neighborhood signal',
          detail: `${updated.corroborationCount} neighbors now back this issue.`,
          variant: escalation ? 'escalation' : 'verification',
          metrics: [
            { label: 'contribution', value: `+${VERIFICATION_SUPPORT_BONUS}` },
            { label: 'trust', value: `+${TRUST_SCORE_PER_VERIFICATION}` },
          ],
        });

        window.setTimeout(() => setCompletedId(null), 1400);
      } else if (result.error === 'already_supported') {
        setFeedback({
          id: 'already',
          title: 'You already confirmed this issue',
          detail: 'One confirmation per person keeps rewards fair.',
        });
        dismissOpportunity(opportunity.report.id);
      }

      setConfirmingId(null);
    },
    [dismissOpportunity, navigate, recordUsefulVerification],
  );

  const handleNotEnoughEvidence = useCallback(
    (opportunity: VerifyOpportunity) => {
      dismissOpportunity(opportunity.report.id);
      setFeedback({
        id: `decline-${opportunity.report.id}`,
        title: 'Quality check recorded',
        detail: 'Thanks — filtering weak evidence protects crews and honest reporters.',
      });
    },
    [dismissOpportunity],
  );

  const handlePossiblyDuplicate = useCallback(
    (opportunity: VerifyOpportunity) => {
      dismissOpportunity(opportunity.report.id);
      setFeedback({
        id: `dup-${opportunity.report.id}`,
        title: 'Flagged as possible duplicate',
        detail: 'Support an existing report instead — corroboration beats repeat filings.',
      });
      const duplicateTarget = reports.find(
        (r) =>
          r.id !== opportunity.report.id &&
          r.category === opportunity.report.category &&
          r.status !== 'merged' &&
          r.status !== 'resolved',
      );
      if (duplicateTarget) {
        window.setTimeout(() => {
          navigate(ROUTES.issueDetail(duplicateTarget.id));
        }, 800);
      }
    },
    [dismissOpportunity, navigate, reports],
  );

  return (
    <CitizenPageShell className="motion-stagger space-y-4" data-testid="community-verify-page" stagger>
      <VerifyHero opportunityCount={queue.length} />

      <NeighborhoodPulseSection
        reports={reports}
        user={user}
        surface="verify"
        verifyActionsThisWeek={verifyActionsThisWeek}
        variant="compact"
      />

      <VerificationStreakBar
        streak={streak}
        activeToday={activeToday}
        usefulVerifications={activityDates.length}
      />

      <ActionFeedbackToast feedback={feedback} testId="verify-feedback" />

      {loading ? (
        <LoadingState variant="cards" label="Loading verification opportunities…" />
      ) : queue.length === 0 ? (
        <EmptyState
          variant="civic"
          testId="verify-empty-state"
          icon={<ShieldCheck className="h-7 w-7" />}
          title="All caught up nearby"
          description="No reports need your confirmation right now. When you are out in the neighborhood, a quick confirm helps crews act on real issues."
        />
      ) : (
        <div className="space-y-4" data-testid="verify-opportunity-queue">
          {queue.map((opportunity) => {
            const media = seedMedia.find((m) => m.reportId === opportunity.report.id);
            return (
              <VerifyOpportunityCard
                key={opportunity.report.id}
                opportunity={opportunity}
                mediaUrl={media?.thumbnailUrl}
                detailHref={ROUTES.issueDetail(opportunity.report.id)}
                confirming={confirmingId === opportunity.report.id}
                completed={completedId === opportunity.report.id}
                onConfirm={() => void handleConfirm(opportunity)}
                onNotEnoughEvidence={() => handleNotEnoughEvidence(opportunity)}
                onPossiblyDuplicate={() => handlePossiblyDuplicate(opportunity)}
              />
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Prefer more context?{' '}
        <Link to={ROUTES.nearby} className="font-medium text-civic-blue-600">
          Browse nearby issues
        </Link>
      </p>

      <CivicAccountabilityStrip compact />
    </CitizenPageShell>
  );
}
