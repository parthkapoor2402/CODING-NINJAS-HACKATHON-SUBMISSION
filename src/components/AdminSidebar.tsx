import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart3, Shield, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, APP_NAME } from '@/lib/constants';

const links = [
  { to: ROUTES.admin.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.admin.queue, label: 'Queue', icon: ListTodo },
  { to: ROUTES.admin.hotspots, label: 'Hotspots', icon: Map },
  { to: ROUTES.admin.analytics, label: 'Analytics', icon: BarChart3 },
  { to: ROUTES.admin.moderation, label: 'Moderation', icon: Shield },
] as const;

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-white md:flex">
      <div className="border-b border-border/60 px-5 py-5">
        <p className="font-display text-base font-bold text-civic-blue-600">{APP_NAME}</p>
        <p className="text-xs text-muted-foreground">Municipal operations</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-civic-blue-50 text-civic-blue-700 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border/60 p-4">
        <p className="text-xs text-muted-foreground">Demo mode · Mock data</p>
      </div>
    </aside>
  );
}
