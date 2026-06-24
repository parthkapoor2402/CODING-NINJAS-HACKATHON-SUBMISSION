import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { services } from '@/services/registry';
import { applyTrustUpdate } from '@/store/authStore';
import { hasUserSupported } from '@/services/mock/mockCorroboration';
import type { Report } from '@/types';
import { CheckCircle2, HandHeart } from 'lucide-react';

interface SupportExistingActionProps {
  report: Report;
  userId: string;
  testId?: string;
  className?: string;
  onSupported?: (report: Report) => void;
}

export function SupportExistingAction({
  report,
  userId,
  testId = 'support-existing-btn',
  className,
  onSupported,
}: SupportExistingActionProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [localReport, setLocalReport] = useState(report);

  const alreadySupported = hasUserSupported(localReport.id, userId);
  const isOwn = localReport.reporterId === userId;
  const closed = localReport.status === 'resolved' || localReport.status === 'merged';

  if (isOwn || closed) {
    return null;
  }

  async function handleSupport() {
    if (alreadySupported) return;
    setLoading(true);
    setMessage(null);
    const result = await services.reports.corroborate(localReport.id, userId);
    if (result.ok && result.report) {
      setLocalReport(result.report);
      applyTrustUpdate();
      setMessage('Thanks — your confirmation strengthens this report for crews.');
      onSupported?.(result.report);
    } else if (result.error === 'already_supported') {
      setMessage('You already supported this report. No extra credit — by design.');
    }
    setLoading(false);
  }

  return (
    <div className={className}>
      {alreadySupported ? (
        <div className="flex items-center gap-2 rounded-xl border border-civic-teal-200 bg-civic-teal-50/50 px-3 py-2 text-sm text-civic-teal-900">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          You supported this report. Duplicate confirmations do not earn rewards.
        </div>
      ) : (
        <Button
          variant="teal"
          className="w-full gap-2"
          data-testid={testId}
          disabled={loading}
          onClick={handleSupport}
        >
          <HandHeart className="h-4 w-4" aria-hidden />
          {loading ? 'Recording…' : 'Support this report'}
        </Button>
      )}
      {message ? (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        First-class civic action: confirm only if you can see the issue. One confirmation per person.
      </p>
    </div>
  );
}
