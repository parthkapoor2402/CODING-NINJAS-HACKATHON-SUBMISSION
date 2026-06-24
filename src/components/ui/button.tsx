import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[transform,box-shadow,background-color,opacity,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] active:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-civic-blue-600 text-white shadow-sm hover:bg-civic-blue-700 hover:shadow-md',
        civic: 'gradient-civic-hero text-white shadow-fab hover:opacity-95 hover:shadow-[0_8px_28px_rgba(21,101,192,0.35)]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-2 border-civic-blue-600 bg-transparent text-civic-blue-600 hover:bg-civic-blue-50 active:bg-civic-blue-100/80',
        ghost: 'hover:bg-muted hover:text-foreground active:bg-muted/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        teal: 'bg-civic-teal-500 text-white shadow-sm hover:bg-civic-teal-600 hover:shadow-md',
        soft: 'bg-civic-blue-50 text-civic-blue-700 hover:bg-civic-blue-100 active:bg-civic-blue-100/90',
      },
      size: {
        default: 'h-11 min-h-touch px-5 py-2',
        sm: 'h-9 min-h-[36px] rounded-lg px-3 text-xs',
        lg: 'h-12 min-h-touch rounded-xl px-8 text-base',
        xl: 'h-14 min-h-[56px] rounded-xl px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
