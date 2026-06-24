import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  stepIndex: number;
  totalSteps: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function OnboardingLayout({ stepIndex, totalSteps, children, footer }: OnboardingLayoutProps) {
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-civic-blue-50/40 to-background">
      <header className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-bold text-civic-blue-700">CivicResolve</p>
          <span className="text-xs font-medium text-muted-foreground">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-civic-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>
      </header>

      <main className={cn('flex flex-1 flex-col px-6 py-6 animate-slide-up')}>{children}</main>

      {footer ? (
        <footer className="border-t border-border/60 bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
