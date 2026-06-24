import { cn } from '@/lib/utils';
import { CivicProgressBar } from '@/components/motion/CivicProgressBar';

interface CitizenPageShellProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  animate?: boolean;
  stagger?: boolean;
  'data-testid'?: string;
}

export function CitizenPageShell({
  children,
  className,
  noPadding = false,
  animate = true,
  stagger = false,
  'data-testid': testId,
}: CitizenPageShellProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        'w-full',
        !noPadding && 'px-0',
        animate && !stagger && 'animate-slide-up',
        stagger && 'motion-stagger',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AdminPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageShell({
  title,
  description,
  children,
  actions,
  className,
}: AdminPageShellProps) {
  return (
    <div className={cn('animate-fade-in space-y-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

interface ReportShellProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title: string;
}

export function ReportShell({ children, step, totalSteps, title }: ReportShellProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col animate-slide-up">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-civic-blue-600">
          Step {step + 1} of {totalSteps}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold">{title}</h2>
        <div className="mt-4">
          <CivicProgressBar
            value={progress}
            variant="default"
            size="md"
            aria-label="Report flow progress"
          />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
