'use client';
import { AlertTriangle, Loader2, PizzaIcon, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Spinner({ className }) {
  return <Loader2 className={cn('size-5 animate-spin text-primary', className)} aria-hidden />;
}

/** Full-area loader for pages / dashboard sections */
export function PageLoader({ label = 'Loading…', className }) {
  return (
    <div role="status" className={cn('flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted-foreground', className)}>
      <div className="relative">
        <PizzaIcon className="size-12 animate-spin text-primary [animation-duration:2.4s]" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, icon: Icon = SearchX, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 py-14 text-center', className)}>
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-7" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, className }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center rounded-2xl border-2 border-destructive/30 bg-destructive/5 px-6 py-12 text-center', className)}>
      <AlertTriangle className="size-9 text-destructive" />
      <h3 className="mt-4 font-display text-lg font-semibold">Something went wrong</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{error?.message || 'We could not load this content.'}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
