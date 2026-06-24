import { Link } from 'react-router-dom';
import { CitizenPageShell } from '@/components/layout/PageShell';
import { GuestModeBanner } from '@/components/guest/GuestModeBanner';
import { TrustScoreRing, TrustBadge } from '@/components/trust/TrustScoreRing';
import { RewardsLinkCard } from '@/features/rewards/RewardsPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore, useCurrentUser, useIsAdmin } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';
import { ChevronRight, Users, Shield } from 'lucide-react';

export default function ProfilePage() {
  const user = useCurrentUser();
  const signOut = useAuthStore((s) => s.signOut);
  const isAdmin = useIsAdmin();

  if (!user) return null;

  return (
    <CitizenPageShell className="space-y-4">
      <GuestModeBanner />
      <Card className="shadow-card">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-civic-blue-50 font-display text-xl font-bold text-civic-blue-600">
            {user.displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold">{user.displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <TrustBadge score={user.trust.trustScore} />
          </div>
          <TrustScoreRing score={user.trust.trustScore} size="sm" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trust breakdown
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <TrustRow label="Trust score" value={user.trust.trustScore} />
            <TrustRow label="Contributions" value={user.trust.contributionScore} />
            <TrustRow label="Verification" value={user.trust.verificationScore} />
          </ul>
        </CardContent>
      </Card>

      <RewardsLinkCard />

      <Link to={ROUTES.family}>
        <Card className="transition-shadow hover:shadow-elevated">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-amber-50 text-civic-amber-600">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Family & youth mode</p>
              <p className="text-xs text-muted-foreground">Supervised civic participation</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      {isAdmin ? (
        <Button asChild variant="outline" className="w-full">
          <Link to={ROUTES.admin.dashboard}>
            <Shield className="h-4 w-4" />
            Open admin dashboard
          </Link>
        </Button>
      ) : null}

      <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => signOut()}>
        Sign out
      </Button>
    </CitizenPageShell>
  );
}

function TrustRow({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
