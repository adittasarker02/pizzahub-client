import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sticker-style buttons: same look everywhere (home page included)
export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all select-none disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-2 border-ink bg-primary text-primary-foreground shadow-[0_4px_0_0_var(--ink)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--ink)] active:translate-y-1 active:shadow-[0_0_0_0_var(--ink)]',
        accent:
          'border-2 border-ink bg-accent text-accent-foreground shadow-[0_4px_0_0_var(--ink)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--ink)] active:translate-y-1 active:shadow-[0_0_0_0_var(--ink)]',
        outline:
          'border-2 border-ink/80 bg-card text-foreground hover:bg-secondary dark:border-border',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        ghost: 'text-foreground hover:bg-secondary',
        destructive:
          'border-2 border-ink bg-destructive text-white shadow-[0_4px_0_0_var(--ink)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export function Button({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Loader2 className="animate-spin" />}
          {children}
        </>
      )}
    </Comp>
  );
}
