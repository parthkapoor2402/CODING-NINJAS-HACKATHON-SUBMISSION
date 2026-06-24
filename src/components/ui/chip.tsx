import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-chip border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-civic-blue-50 text-civic-blue-700',
        category: 'border-transparent text-white',
        outline: 'border-border bg-background text-foreground',
        verified: 'border-transparent bg-civic-teal-50 text-civic-teal-600',
        pending: 'border-transparent bg-civic-amber-50 text-amber-800',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
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
}

export function Chip({ className, variant, size, dotColor, children, style, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, size }), className)} style={style} {...props}>
      {dotColor ? (
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
      ) : null}
      {children}
    </span>
  );
}

export { chipVariants };
