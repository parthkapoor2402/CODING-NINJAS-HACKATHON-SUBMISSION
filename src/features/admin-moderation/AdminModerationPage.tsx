import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageShell } from '@/components/layout/PageShell';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/states/LoadingState';
import { services } from '@/services/registry';
import type { SuspiciousCase } from '@/types';
import { partitionModerationCases } from '@/domain/admin-moderation-queues';
import { ROUTES } from '@/lib/constants';
import { ShieldAlert, GitMerge, Ban, Gift } from 'lucide-react';

export default function AdminModerationPage() {
  const [cases, setCases] = useState<SuspiciousCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [mergeCanonical, setMergeCanonical] = useState('report-001');
  const [mergeDuplicate, setMergeDuplicate] = useState('report-005');
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    services.backend.admin.getSuspiciousCases().then((data) => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  const { suspicious, abuse } = useMemo(() => partitionModerationCases(cases), [cases]);
  const rewardFarming = abuse.filter((c) => c.kind === 'reward_farming');
  const velocityAbuse = abuse.filter((c) => c.kind !== 'reward_farming');

  async function handleReview(caseId: string) {
    const updated = await services.backend.admin.reviewSuspiciousCase(caseId);
    setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
  }

  async function handleDismiss(caseId: string) {
    const updated = await services.backend.admin.dismissSuspiciousCase(caseId);
    setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
  }

  async function handleResolve(caseId: string) {
    const updated = await services.backend.admin.resolveSuspiciousCase(caseId);
    setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
  }

  async function handleMerge() {
    setMerging(true);
    try {
      await services.backend.admin.mergeDuplicateReport(mergeCanonical, mergeDuplicate);
      const refreshed = await services.backend.admin.getSuspiciousCases();
      setCases(refreshed);
    } finally {
      setMerging(false);
    }
  }

  return (
    <AdminPageShell
      title="Moderation"
      description="Transparency controls — duplicates, suspicious media, and reward-farming patterns."
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <ModerationStat icon={ShieldAlert} label="Open reviews" value={cases.filter((c) => c.status === 'open').length} />
        <ModerationStat icon={GitMerge} label="Duplicate clusters" value={suspicious.filter((c) => c.kind === 'duplicate').length} />
        <ModerationStat icon={Ban} label="Abuse flags" value={abuse.filter((c) => c.status !== 'dismissed').length} />
      </div>

      <Card className="mb-6 border-civic-blue-200 bg-civic-blue-50/20">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-civic-blue-700" />
            <p className="font-semibold">Duplicate merge tool</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Merge a duplicate report into a canonical issue — rewards stay on the verified original.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              className="rounded-lg border bg-card px-3 py-2 text-sm"
              value={mergeCanonical}
              onChange={(e) => setMergeCanonical(e.target.value)}
              placeholder="Canonical report ID"
            />
            <input
              className="rounded-lg border bg-card px-3 py-2 text-sm"
              value={mergeDuplicate}
              onChange={(e) => setMergeDuplicate(e.target.value)}
              placeholder="Duplicate report ID"
            />
            <Button size="sm" onClick={handleMerge} disabled={merging}>
              Merge duplicate
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingState variant="cards" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Suspicious reports
            </h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Report-level signals — media quality, duplicate risk before rewards release.
            </p>
            <div data-testid="suspicious-reports-queue" className="space-y-3">
              {suspicious.map((c) => (
                <ModerationCaseCard
                  key={c.id}
                  caseItem={c}
                  onReview={() => handleReview(c.id)}
                  onDismiss={() => handleDismiss(c.id)}
                  onResolve={() => handleResolve(c.id)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Abuse & reward-farming review
            </h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Account-level velocity and farming patterns — freezes redeemable points until cleared.
            </p>
            <div data-testid="abuse-review-queue" className="space-y-3">
              {velocityAbuse.map((c) => (
                <ModerationCaseCard
                  key={c.id}
                  caseItem={c}
                  onReview={() => handleReview(c.id)}
                  onDismiss={() => handleDismiss(c.id)}
                  onResolve={() => handleResolve(c.id)}
                />
              ))}
              {rewardFarming.map((c) => (
                <ModerationCaseCard
                  key={c.id}
                  caseItem={c}
                  icon={Gift}
                  onReview={() => handleReview(c.id)}
                  onDismiss={() => handleDismiss(c.id)}
                  onResolve={() => handleResolve(c.id)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminPageShell>
  );
}

function ModerationCaseCard({
  caseItem,
  onReview,
  onDismiss,
  onResolve,
  icon: Icon = ShieldAlert,
}: {
  caseItem: SuspiciousCase;
  onReview: () => void;
  onDismiss: () => void;
  onResolve: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className={caseItem.riskScore > 70 ? 'border-civic-coral-500/40' : ''}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{caseItem.reason}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {caseItem.reportId ? (
                <Link to={ROUTES.admin.issueDetail(caseItem.reportId)} className="text-civic-blue-600 hover:underline">
                  Report {caseItem.reportId}
                </Link>
              ) : (
                'Account-level'
              )}{' '}
              · {caseItem.status}
              {caseItem.kind ? ` · ${caseItem.kind.replace('_', ' ')}` : ''}
            </p>
          </div>
          <Chip variant={caseItem.riskScore > 70 ? 'pending' : 'muted'}>Risk {caseItem.riskScore}</Chip>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" data-testid="manual-review-btn" onClick={onReview}>
            Review
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button size="sm" variant="soft" onClick={onResolve}>
            Resolve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModerationStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
