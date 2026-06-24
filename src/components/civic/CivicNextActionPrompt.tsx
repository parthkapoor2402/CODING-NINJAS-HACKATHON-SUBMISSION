import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { nextActionIcon, type NextActionPrompt } from '@/domain/next-action';
import { cn } from '@/lib/utils';

interface CivicNextActionPromptProps {
  prompt: NextActionPrompt;
  className?: string;
}

const urgencyStyles = {
  high: 'border-civic-amber-300 bg-gradient-to-r from-civic-amber-50 via-white to-civic-amber-50/40 ring-1 ring-civic-amber-200/60',
  medium: 'border-civic-blue-200 bg-gradient-to-r from-civic-blue-50/80 via-white to-civic-teal-50/40',
  calm: 'border-border bg-card',
};

export function CivicNextActionPrompt({ prompt, className }: CivicNextActionPromptProps) {
  const Icon = nextActionIcon(prompt.icon);

  return (
    <Link
      to={prompt.route}
      data-testid="civic-next-action-prompt"
      className={cn(
        'group block rounded-xl border p-3.5 shadow-card transition-all duration-200 active:scale-[0.99] sm:p-4',
        urgencyStyles[prompt.urgency],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
            prompt.urgency === 'high'
              ? 'bg-civic-amber-600 text-white'
              : 'bg-civic-blue-600 text-white',
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-civic-blue-700">
            Your next move
          </p>
          <p className="mt-0.5 text-sm font-bold leading-snug text-foreground">{prompt.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{prompt.detail}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-civic-blue-700 group-hover:gap-1.5">
            {prompt.cta}
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </div>
    </Link>
  );
}
