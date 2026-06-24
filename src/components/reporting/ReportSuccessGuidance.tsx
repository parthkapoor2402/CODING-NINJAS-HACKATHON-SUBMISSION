import { GUIDANCE_SECTIONS } from '@/domain/report-success';
import { Eye, GitBranch, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const sectionIcons = {
  'why-verify': ShieldCheck,
  'what-next': GitBranch,
  'verify-instead': Eye,
};

export function ReportSuccessGuidance() {
  return (
    <section data-testid="report-success-guidance" className="space-y-2 text-left">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        How civic signal works
      </p>
      {GUIDANCE_SECTIONS.map((section, index) => {
        const Icon = sectionIcons[section.id];
        return (
          <div
            key={section.id}
            className={cn(
              'flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm animate-slide-up',
            )}
            style={{ animationDelay: `${120 + index * 80}ms` }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-civic-blue-50 text-civic-blue-700">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">{section.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
