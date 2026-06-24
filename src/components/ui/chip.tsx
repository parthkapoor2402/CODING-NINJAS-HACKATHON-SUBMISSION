import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-chip border font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-civic-blue-200 bg-civic-blue-50 text-civic-blue-800',
        category: 'border-transparent text-white shadow-sm',
        outline: 'border-border/80 bg-white/95 text-foreground backdrop-blur-sm',
        verified: 'border-civic-teal-200 bg-civic-teal-50 text-civic-teal-800',
        pending: 'border-civic-amber-300 bg-civic-amber-100 text-civic-amber-900',
        live: 'border-civic-amber-400 bg-civic-amber-500 text-white shadow-sm',
        urgent: 'border-civic-coral-300 bg-civic-coral-50 text-civic-coral-900',
        distance: 'border-civic-blue-200 bg-white/95 font-semibold text-civic-blue-800 backdrop-blur-sm',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  dotColor?: string;
  pulse?: boolean;
}

export function Chip({
  className,
  variant,
  size,
  dotColor,
  pulse,
  children,
  style,
  ...props
}: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, size }), className)} style={style} {...props}>
      {dotColor ? (
        <span
          className={cn('h-2 w-2 shrink-0 rounded-full', pulse && 'status-pulse-dot')}
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      {children}
    </span>
  );
}

export { chipVariants };
