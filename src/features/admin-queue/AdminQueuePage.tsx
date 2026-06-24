import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageShell } from '@/components/layout/PageShell';
import { StatusBadge } from '@/components/StatusBadge';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/states/LoadingState';
import { services } from '@/services/registry';
import type { AdminQueueItem } from '@/types';
import {
  DEFAULT_ADMIN_QUEUE_FILTERS,
  filterAdminQueue,
  type AdminQueueFilters,
} from '@/domain/admin-queue-filters';
import { ROUTES } from '@/lib/constants';
import { categoryLabel } from '@/utils/labels';
import { ArrowUpDown } from 'lucide-react';

export default function AdminQueuePage() {
  const [queue, setQueue] = useState<AdminQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminQueueFilters>(DEFAULT_ADMIN_QUEUE_FILTERS);

  useEffect(() => {
    services.backend.admin.getQueue().then((data) => {
      setQueue(data);
      setLoading(false);
    });
  }, []);

  const visibleQueue = useMemo(() => filterAdminQueue(queue, filters), [queue, filters]);

  return (
    <AdminPageShell
      title="Report queue"
      description="Prioritized by severity, corroboration, and trust signals."
      actions={
        <Button variant="outline" size="sm">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Category
          <select
            data-testid="admin-filter-category"
            className="rounded-lg border bg-card px-3 py-2 text-sm text-foreground"
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value as AdminQueueFilters['category'] }))
            }
          >
            <option value="all">All categories</option>
            <option value="pothole">Pothole</option>
            <option value="water_leak">Water leak</option>
            <option value="streetlight">Streetlight</option>
            <option value="garbage">Garbage</option>
            <option value="sanitation">Sanitation</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Severity
          <select
            data-testid="admin-filter-severity"
            className="rounded-lg border bg-card px-3 py-2 text-sm text-foreground"
            value={filters.severity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, severity: e.target.value as AdminQueueFilters['severity'] }))
            }
          >
            <option value="all">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Status
          <select
            data-testid="admin-filter-status"
            className="rounded-lg border bg-card px-3 py-2 text-sm text-foreground"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value as AdminQueueFilters['status'] }))
            }
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="pending_verification">Pending verification</option>
            <option value="verified">Verified</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In progress</option>
          </select>
        </label>
      </div>

      {loading ? (
        <LoadingState variant="cards" label="Loading queue…" />
      ) : (
        <div
          data-testid="admin-issue-queue"
          className="overflow-hidden rounded-card border bg-card shadow-card"
        >
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground max-md:hidden">
            <span>Issue</span>
            <span>Priority</span>
            <span>Dup. risk</span>
            <span>Status</span>
          </div>
          {visibleQueue.map((item) => (
            <div
              key={item.report.id}
              data-testid={`admin-queue-item-${item.report.id}`}
              className="grid grid-cols-1 items-center gap-3 border-b px-4 py-4 last:border-0 transition-colors hover:bg-muted/30 md:grid-cols-[1fr_auto_auto_auto] md:gap-4"
            >
              <div className="min-w-0">
                <Link
                  to={`${ROUTES.admin.queue}/${item.report.id}`}
                  className="font-semibold hover:text-civic-blue-600"
                >
                  {categoryLabel(item.report.category)}
                </Link>
                <p className="line-clamp-1 text-sm text-muted-foreground">{item.report.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  by {item.reporter.displayName}
                  {item.report.assignedWorkerId ? ` · crew ${item.report.assignedWorkerId}` : ''}
                  {item.slaDueAt ? ' · SLA watch' : ''}
                </p>
              </div>
              <Chip variant="default">{item.priorityScore}</Chip>
              <Chip variant={item.duplicateRisk > 70 ? 'pending' : 'muted'}>
                {item.duplicateRisk}%
              </Chip>
              <StatusBadge status={item.report.status} />
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
