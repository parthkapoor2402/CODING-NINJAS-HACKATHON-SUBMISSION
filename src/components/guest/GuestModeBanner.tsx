import { Link } from 'react-router-dom';
import { UserCircle, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useIsGuest } from '@/store/authStore';

export function GuestModeBanner() {
  const isGuest = useIsGuest();
  if (!isGuest) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-civic-amber-200 bg-civic-amber-50/60 px-4 py-3"
      data-testid="guest-mode-notice"
      role="status"
    >
      <UserCircle className="mt-0.5 h-5 w-5 shrink-0 text-civic-amber-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-900">Guest mode</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-900/80">
          Limited reports and local-only trust. Sign in to save progress and unlock rewards.
        </p>
        <Link
          to={ROUTES.auth}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-civic-blue-600"
        >
          Sign in for full access
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
