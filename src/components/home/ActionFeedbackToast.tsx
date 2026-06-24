import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionFeedback {
  id: string;
  title: string;
  detail?: string;
  variant?: 'default' | 'verification' | 'escalation';
  metrics?: { label: string; value: string }[];
}

interface ActionFeedbackToastProps {
  feedback: ActionFeedback | null;
  className?: string;
  testId?: string;
}

export function ActionFeedbackToast({ feedback, className, testId }: ActionFeedbackToastProps) {
  if (!feedback) return null;

  const variant = feedback.variant ?? 'default';
  const isEscalation = variant === 'escalation';
  const isVerification = variant === 'verification' || isEscalation;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={testId ?? 'action-feedback-toast'}
      className={cn(
        'animate-scale-in overflow-hidden rounded-xl border shadow-elevated',
        isEscalation
          ? 'border-civic-amber-300 bg-gradient-to-br from-civic-amber-50 via-white to-civic-teal-50/40'
          : isVerification
            ? 'border-civic-teal-300 bg-gradient-to-br from-civic-teal-50 via-white to-civic-blue-50/30'
            : 'border-civic-teal-200 bg-civic-teal-50',
        className,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div
          className={cn(
            'success-icon-enter flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm',
            isEscalation ? 'bg-civic-amber-600' : 'bg-civic-teal-600',
          )}
        >
          {isEscalation ? (
            <TrendingUp className="h-4 w-4" aria-hidden />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{feedback.title}</p>
          {feedback.detail ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{feedback.detail}</p>
          ) : null}
        </div>
        <Sparkles className="h-4 w-4 shrink-0 text-civic-teal-600 opacity-80" aria-hidden />
      </div>

      {feedback.metrics && feedback.metrics.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 border-t border-black/5 bg-white/50 px-4 py-2">
          {feedback.metrics.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-1 rounded-full border border-civic-teal-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-civic-teal-900"
            >
              <ShieldCheck className="h-3 w-3 opacity-70" aria-hidden />
              {m.value} {m.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
