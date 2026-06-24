import { Link } from 'react-router-dom';
import { UserCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useIsGuest } from '@/store/authStore';

export function GuestModeBanner() {
  const isGuest = useIsGuest();
  if (!isGuest) return null;

  return (
    <div
      className="overflow-hidden rounded-xl border border-civic-amber-200 bg-gradient-to-r from-civic-amber-50 via-white to-civic-amber-50/40 px-4 py-3 shadow-sm"
      data-testid="guest-mode-notice"
      role="status"
    >
      <div className="flex items-start gap-3">
        <UserCircle className="mt-0.5 h-5 w-5 shrink-0 text-civic-amber-700" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-amber-950">You&apos;re exploring as a guest</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-950/80">
            Reports and confirmations work locally, but verified impact, rewards, and ward recognition
            need a signed-in civic identity.
          </p>
          <Link
            to={ROUTES.auth}
            className="mt-2.5 inline-flex min-h-touch items-center gap-1.5 rounded-lg bg-civic-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Sign in to save your impact
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
