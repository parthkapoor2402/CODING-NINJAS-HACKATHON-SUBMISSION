import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageShell } from '@/components/layout/PageShell';
import { StatCard } from '@/components/cards/StatCard';
import { MapPreviewCard } from '@/components/cards/MapPreviewCard';
import { IssueCard } from '@/components/cards/IssueCard';
import { Card, CardContent } from '@/components/ui/card';
import { services } from '@/services/registry';
import { seedMedia } from '@/services/mock/seed';
import type { AdminDashboardSnapshot, AdminQueueItem, Report } from '@/types';
import { ROUTES } from '@/lib/constants';
import { Activity, Clock, ShieldAlert, CheckCircle, AlertTriangle, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const [snapshot, setSnapshot] = useState<AdminDashboardSnapshot | null>(null);
  const [priorityQueue, setPriorityQueue] = useState<AdminQueueItem[]>([]);
  const [pinCount, setPinCount] = useState(0);

  useEffect(() => {
    Promise.all([
      services.backend.admin.getDashboardSnapshot(),
      services.backend.admin.getQueue(),
      services.backend.admin.getOpenIssuePinCount(),
    ]).then(([dash, queue, pins]) => {
      setSnapshot(dash);
      setPriorityQueue(queue.slice(0, 3));
      setPinCount(pins);
    });
  }, []);

  const recent: Report[] = priorityQueue.map((item) => item.report);

  return (
    <AdminPageShell
      title="Operations overview"
      description="Accountability pulse — queue depth, trust signals, and crew throughput across wards."
    >
      <div data-testid="admin-dashboard-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open queue"
          value={snapshot?.openQueue ?? '—'}
          icon={<Activity className="h-4 w-4" />}
          trend="up"
          trendLabel="Efficiency: triage open items"
          accent="blue"
        />
        <StatCard
          label="Avg. time to verify"
          value={snapshot ? `${snapshot.medianVerifyHours}h` : '—'}
          icon={<Clock className="h-4 w-4" />}
          trend="down"
          trendLabel="Transparency: faster neighbor confirmation"
          accent="teal"
        />
        <StatCard
          label="Suspicious cases"
          value={snapshot?.suspiciousOpen ?? '—'}
          icon={<ShieldAlert className="h-4 w-4" />}
          accent="coral"
        />
        <StatCard
          label="Resolved (7d)"
          value={snapshot?.resolvedLast7d ?? '—'}
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
          trendLabel="Accountability: verified closures"
          accent="teal"
        />
      </div>

      {snapshot && (snapshot.slaAtRisk > 0 || snapshot.duplicateClusters > 0) ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {snapshot.slaAtRisk > 0 ? (
            <Card className="border-civic-coral-200 bg-civic-coral-50/30">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertTriangle className="h-5 w-5 text-civic-coral-600" />
                <div>
                  <p className="text-sm font-semibold">{snapshot.slaAtRisk} high-severity unassigned</p>
                  <p className="text-xs text-muted-foreground">SLA risk — assign crew before breach</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
          {snapshot.duplicateClusters > 0 ? (
            <Card className="border-civic-amber-200 bg-civic-amber-50/30">
              <CardContent className="flex items-center gap-3 p-4">
                <ShieldAlert className="h-5 w-5 text-civic-amber-700" />
                <div>
                  <p className="text-sm font-semibold">{snapshot.duplicateClusters} duplicate signals</p>
                  <Link to={ROUTES.admin.moderation} className="text-xs font-medium text-civic-blue-600 hover:underline">
                    Review moderation queue →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Crew active"
          value={snapshot?.assignedInProgress ?? 0}
          icon={<Users className="h-4 w-4" />}
          accent="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MapPreviewCard
          pinCount={pinCount}
          label="Ward activity"
          wardName="Live open issues · accountability map"
          className="min-h-[220px]"
        />
        <div className="space-y-3">
          <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Priority items
          </h2>
          {recent.map((report) => {
            const media = seedMedia.find((m) => m.reportId === report.id);
            return (
              <IssueCard
                key={report.id}
                report={report}
                mediaUrl={media?.thumbnailUrl}
                showActions={false}
                className="shadow-sm"
              />
            );
          })}
        </div>
      </div>
    </AdminPageShell>
  );
}
