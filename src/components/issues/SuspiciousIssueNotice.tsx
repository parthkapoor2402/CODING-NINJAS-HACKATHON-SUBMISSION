import { Shield } from 'lucide-react';

interface SuspiciousIssueNoticeProps {
  reason: string;
}

export function SuspiciousIssueNotice({ reason }: SuspiciousIssueNoticeProps) {
  return (
    <div
      className="rounded-xl border border-civic-blue-200 bg-civic-blue-50/50 p-3 text-sm"
      data-testid="suspicious-issue-notice"
      role="status"
    >
      <div className="flex gap-2">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-civic-blue-600" aria-hidden />
        <div>
          <p className="font-medium text-civic-blue-900">Protected review in progress</p>
          <p className="mt-1 text-xs leading-relaxed text-civic-blue-800/90">
            This report is held for a quick quality check so crews trust what they see.{' '}
            {reason}
          </p>
          <p className="mt-2 text-xs text-civic-blue-800/80">
            Honest reporters are not penalized — verification unlocks routing and rewards.
          </p>
        </div>
      </div>
    </div>
  );
}
