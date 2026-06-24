import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-civic-blue-600 text-white shadow-sm',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        outline: 'border-border bg-background text-foreground',
        verified: 'border-transparent bg-civic-teal-600 text-white shadow-sm',
        pending: 'border-civic-amber-300 bg-civic-amber-100 text-civic-amber-900',
        rejected: 'border-civic-coral-500 bg-civic-coral-50 text-civic-coral-900',
        progress: 'border-civic-blue-200 bg-civic-blue-50 text-civic-blue-800',
        acknowledged: 'border-civic-blue-300 bg-civic-blue-100 text-civic-blue-900',
        resolved: 'border-civic-teal-300 bg-civic-teal-50 text-civic-teal-800',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
