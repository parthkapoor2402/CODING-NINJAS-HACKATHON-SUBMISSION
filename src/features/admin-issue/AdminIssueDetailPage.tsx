import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminPageShell } from '@/components/layout/PageShell';
import { DuplicateClusterBanner } from '@/components/admin/DuplicateClusterBanner';
import { DuplicateTrustRationalePanel } from '@/components/admin/DuplicateTrustRationalePanel';
import { OpsTriagePanel } from '@/components/admin/OpsTriagePanel';
import { FieldWorkerTimeline } from '@/components/admin/FieldWorkerTimeline';
import { IssueModerationPanel } from '@/components/admin/IssueModerationPanel';
import { IssueTimeline } from '@/components/issues/IssueTimeline';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/states/LoadingState';
import { services } from '@/services/registry';
import type { FieldWorkerUpdate, IssueUpdate, Report } from '@/types';
import { categoryLabel } from '@/utils/labels';
import { MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AdminIssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const adminId = useAuthStore((s) => s.session?.user.id ?? 'user-admin-1');
  const [report, setReport] = useState<Report | null>(null);
  const [updates, setUpdates] = useState<IssueUpdate[]>([]);
  const [workerUpdates, setWorkerUpdates] = useState<FieldWorkerUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicateRisk, setDuplicateRisk] = useState(0);

  useEffect(() => {
    if (!id) return;
    let active = true;
    Promise.all([
      services.reports.getById(id),
      services.issueUpdates.getForReport(id),
      services.backend.admin.getFieldWorkerUpdates(id),
      services.backend.admin.getQueue(),
    ]).then(([reportData, issueUpdates, fwUpdates, queue]) => {
      if (!active) return;
      setReport(reportData);
      setUpdates(issueUpdates);
      setWorkerUpdates(fwUpdates);
      const queueItem = queue.find((q) => q.report.id === id);
      setDuplicateRisk(queueItem?.duplicateRisk ?? 0);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AdminPageShell title="Issue detail" description="Loading…">
        <LoadingState variant="cards" />
      </AdminPageShell>
    );
  }

  if (!report) {
    return (
      <AdminPageShell title="Issue detail" description="Report not found.">
        <p className="text-sm text-muted-foreground">No report matches this ID.</p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title={categoryLabel(report.category)}
      description={report.location.address ?? 'Ward issue'}
    >
      <DuplicateClusterBanner
        duplicateOfId={report.duplicateOfId}
        duplicateRisk={duplicateRisk}
      />

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={report.status} />
                <span className="text-xs text-muted-foreground capitalize">{report.severity} severity</span>
              </div>
              <p className="text-sm leading-relaxed">{report.description}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {report.corroborationCount} confirmations · {report.location.wardId}
              </p>
              <IssueTimeline report={report} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Activity log
              </h2>
              <ol className="space-y-2 text-sm">
                {updates.map((u) => (
                  <li key={u.id} className="rounded-lg border bg-muted/20 px-3 py-2">
                    <span className="text-xs font-medium uppercase text-muted-foreground">{u.kind}</span>
                    <p>{u.message}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Field crew updates
              </h2>
              <FieldWorkerTimeline updates={workerUpdates} />
            </CardContent>
          </Card>
        </div>

        <IssueModerationPanel report={report} onReportChange={setReport} />
        <OpsTriagePanel
          report={report}
          adminId={adminId}
          duplicateRisk={duplicateRisk}
          onReportChange={setReport}
        />
        <DuplicateTrustRationalePanel report={report} />
      </div>
    </AdminPageShell>
  );
}
