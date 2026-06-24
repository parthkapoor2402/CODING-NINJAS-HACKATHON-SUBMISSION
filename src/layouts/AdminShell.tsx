import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { useAuthStore, useCurrentUser } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';
import { Bell, Search } from 'lucide-react';

export function AdminShell() {
  const user = useCurrentUser();
  const signOut = useAuthStore((s) => s.signOut);

  if (user && user.role !== 'admin' && user.role !== 'moderator') {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <div className="flex min-h-dvh bg-[#F4F7FA]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-white/90 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-civic-blue-50 text-civic-blue-600 sm:flex">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Operations
              </p>
              <p className="text-sm font-semibold text-foreground">
                {user?.displayName ?? 'Admin'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Alerts">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
