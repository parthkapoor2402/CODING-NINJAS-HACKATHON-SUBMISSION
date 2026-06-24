import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/layout/AppHeader';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const headerConfig: Record<string, { title?: string; subtitle?: string; showBrand?: boolean; showBack?: boolean }> = {
  [ROUTES.home]: { showBrand: true, subtitle: 'Your neighborhood' },
  [ROUTES.report]: { title: 'Report issue', showBack: true },
  [ROUTES.track]: { title: 'My reports', subtitle: 'Track progress' },
  [ROUTES.community]: { title: 'Verify nearby', subtitle: 'Help confirm issues' },
  [ROUTES.rewards]: { title: 'Rewards', subtitle: 'Verified impact only' },
  [ROUTES.profile]: { title: 'Profile' },
  [ROUTES.nearby]: { title: 'Nearby issues', showBack: true },
  [ROUTES.family]: { title: 'Family mode', subtitle: 'Supervised participation' },
};

export function CitizenShell() {
  const { pathname } = useLocation();
  const issueDetail = pathname.startsWith('/app/issue/');
  const config = issueDetail
    ? { title: 'Issue details', showBack: true }
    : (headerConfig[pathname] ?? { title: 'CivicResolve' });
  const isReport = pathname.startsWith(ROUTES.report);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader
        showBrand={config.showBrand}
        title={config.title}
        subtitle={config.subtitle}
        showBack={config.showBack}
        showNotifications={pathname === ROUTES.home}
      />
      <main
        className={cn(
          'mx-auto w-full max-w-lg flex-1 px-4',
          isReport ? 'pb-6 pt-2' : 'pb-safe-nav pt-4',
        )}
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
