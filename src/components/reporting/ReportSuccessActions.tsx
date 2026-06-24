import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { shouldShowFamilyChallenge } from '@/domain/report-success';
import type { UserRole } from '@/types';
import { ChevronRight, ClipboardList, GraduationCap, ShieldCheck } from 'lucide-react';

interface ReportSuccessActionsProps {
  reportId: string;
  userRole?: UserRole;
  hasFamilyHub?: boolean;
  onDone: () => void;
}

export function ReportSuccessActions({
  reportId,
  userRole,
  hasFamilyHub,
  onDone,
}: ReportSuccessActionsProps) {
  const showFamily = shouldShowFamilyChallenge(userRole, hasFamilyHub);

  return (
    <div data-testid="report-success-actions" className="space-y-2">
      <Button variant="civic" className="h-11 w-full justify-between" asChild onClick={onDone}>
        <Link to={ROUTES.track} data-testid="success-track-report">
          <span className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" aria-hidden />
            Track this report
          </span>
          <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
        </Link>
      </Button>

      <Button variant="outline" className="h-11 w-full justify-between" asChild onClick={onDone}>
        <Link to={ROUTES.community} data-testid="success-verify-nearby">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Verify nearby issues
          </span>
          <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
        </Link>
      </Button>

      {showFamily ? (
        <Button variant="outline" className="h-11 w-full justify-between" asChild onClick={onDone}>
          <Link to={ROUTES.family} data-testid="success-family-challenge">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Share with family challenge
            </span>
            <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
          </Link>
        </Button>
      ) : null}

      <Button variant="ghost" className="w-full text-muted-foreground" asChild onClick={onDone}>
        <Link to={ROUTES.home}>Back to home</Link>
      </Button>

      <p className="pt-1 text-center text-[10px] text-muted-foreground">
        Reference <span className="font-mono">{reportId}</span>
      </p>
    </div>
  );
}
