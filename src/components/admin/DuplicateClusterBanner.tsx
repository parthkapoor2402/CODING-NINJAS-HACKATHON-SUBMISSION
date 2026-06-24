import { Link } from 'react-router-dom';
import { GitMerge } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface DuplicateClusterBannerProps {
  duplicateOfId?: string;
  duplicateRisk?: number;
}

export function DuplicateClusterBanner({
  duplicateOfId,
  duplicateRisk,
}: DuplicateClusterBannerProps) {
  if (!duplicateOfId && (duplicateRisk ?? 0) < 70) return null;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-civic-amber-200 bg-civic-amber-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
      data-testid="duplicate-cluster-banner"
    >
      <div className="flex items-start gap-2">
        <GitMerge className="mt-0.5 h-4 w-4 text-civic-amber-700" />
        <div>
          <p className="text-sm font-semibold text-civic-amber-900">Duplicate cluster signal</p>
          <p className="text-xs text-civic-amber-800/90">
            {duplicateOfId
              ? `Merged into canonical report ${duplicateOfId}.`
              : `Duplicate risk ${duplicateRisk}% — review before routing rewards.`}
          </p>
        </div>
      </div>
      {duplicateOfId ? (
        <Link
          to={ROUTES.admin.issueDetail(duplicateOfId)}
          className="text-xs font-semibold text-civic-blue-600 hover:underline"
        >
          View canonical →
        </Link>
      ) : null}
    </div>
  );
}
