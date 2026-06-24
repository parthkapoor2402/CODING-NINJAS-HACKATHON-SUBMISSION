import { NavLink, useLocation } from 'react-router-dom';
import { Home, List, Users, User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const sideTabs = [
  { to: ROUTES.home, label: 'Home', icon: Home },
  { to: ROUTES.track, label: 'Track', icon: List },
  { to: ROUTES.community, label: 'Verify', icon: Users },
  { to: ROUTES.profile, label: 'Profile', icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  const hideOnReport = location.pathname.startsWith(ROUTES.report);

  if (hideOnReport) return null;

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg"
      aria-label="Main navigation"
    >
      <div className="relative mx-auto flex max-w-lg items-end justify-between px-2 pt-1">
        {sideTabs.slice(0, 2).map(({ to, label, icon: Icon }) => (
          <NavTab key={to} to={to} label={label} icon={<Icon className="h-5 w-5" />} />
        ))}

        {/* Center Report CTA — thumb-zone privileged */}
        <NavLink
          to={ROUTES.report}
          className="relative -top-4 flex flex-col items-center"
          aria-label="Report an issue"
        >
          <span
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shadow-fab transition-transform active:scale-95',
              location.pathname === ROUTES.report
                ? 'gradient-civic-hero ring-4 ring-civic-blue-100'
                : 'gradient-civic-hero hover:opacity-95',
            )}
          >
            <Camera className="h-6 w-6 text-white" strokeWidth={2.5} />
          </span>
          <span className="mt-1 text-[11px] font-semibold text-civic-blue-600">Report</span>
        </NavLink>

        {sideTabs.slice(2).map(({ to, label, icon: Icon }) => (
          <NavTab key={to} to={to} label={label} icon={<Icon className="h-5 w-5" />} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex min-h-touch min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
          isActive ? 'text-civic-blue-600' : 'text-muted-foreground',
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
