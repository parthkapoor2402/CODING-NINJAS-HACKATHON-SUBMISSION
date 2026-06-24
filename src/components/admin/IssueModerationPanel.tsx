import { useEffect, useState } from 'react';
import { AdminResolutionProofPanel } from '@/components/admin/AdminResolutionProofPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { services } from '@/services/registry';
import type { Report, ResolutionProof, User } from '@/types';
import { canAssignReport } from '@/domain/admin-assignment';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface IssueModerationPanelProps {
  report: Report;
  onReportChange: (report: Report) => void;
}

export function IssueModerationPanel({ report, onReportChange }: IssueModerationPanelProps) {
  const [workers, setWorkers] = useState<User[]>([]);
  const [selectedWorker, setSelectedWorker] = useState('user-worker-1');
  const [assigning, setAssigning] = useState(false);
  const [proof, setProof] = useState<ResolutionProof | null>(null);
  const [proofBusy, setProofBusy] = useState(false);

  useEffect(() => {
    let active = true;
    services.backend.admin.getFieldWorkers().then((data) => {
      if (active) setWorkers(data);
    });
    services.backend.admin.getResolutionProof(report.id).then((data) => {
      if (active) setProof(data);
    });
    return () => {
      active = false;
    };
  }, [report.id]);

  async function handleAssign() {
    setAssigning(true);
    try {
      const updated = await services.backend.admin.assignWorker(report.id, selectedWorker);
      onReportChange(updated);
    } finally {
      setAssigning(false);
    }
  }

  async function handleManualReview() {
    const cases = await services.backend.admin.getSuspiciousCases();
    const linked = cases.find((c) => c.reportId === report.id);
    if (linked) {
      await services.backend.admin.reviewSuspiciousCase(linked.id);
    }
  }

  async function handleOverride() {
    const updated = await services.backend.admin.overrideReportStatus(report.id, 'verified');
    onReportChange(updated);
  }

  async function handleProofReview(proofId: string, action: 'approve' | 'reject') {
    setProofBusy(true);
    try {
      const reviewed = await services.backend.admin.reviewResolutionProof(
        proofId,
        action,
        'user-admin-1',
      );
      setProof(reviewed);
      if (action === 'approve') {
        const refreshed = await services.reports.getById(report.id);
        if (refreshed) onReportChange(refreshed);
      }
    } finally {
      setProofBusy(false);
    }
  }

  return (
    <div data-testid="issue-moderation-panel" className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Assignment
          </h2>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Field crew
            <select
              className="rounded-lg border bg-card px-3 py-2 text-sm"
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.displayName}
                </option>
              ))}
            </select>
          </label>
          <Button
            data-testid="assign-issue-btn"
            className="w-full"
            onClick={handleAssign}
            disabled={assigning || !canAssignReport(report)}
          >
            <UserCheck className="h-4 w-4" />
            Assign field worker
          </Button>
          {report.assignedWorkerId ? (
            <p className="text-xs text-muted-foreground">Currently: {report.assignedWorkerId}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Trust & override
          </h2>
          <Button
            data-testid="manual-review-btn"
            variant="outline"
            className="w-full"
            onClick={handleManualReview}
          >
            Mark for manual review
          </Button>
          <Button
            data-testid="override-status-btn"
            variant="soft"
            className="w-full"
            onClick={handleOverride}
          >
            <ShieldCheck className="h-4 w-4" />
            Override → Verified
          </Button>
        </CardContent>
      </Card>

      {proof ? (
        <Card>
          <CardContent className="p-4">
            <AdminResolutionProofPanel
              proof={proof}
              busy={proofBusy}
              onApprove={(id) => handleProofReview(id, 'approve')}
              onReject={(id) => handleProofReview(id, 'reject')}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
