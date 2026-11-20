'use client';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root className={cn('mb-1.5 block text-sm font-semibold text-foreground', className)} {...props} />
  );
}

/** Label + control + error message wrapper */
export function Field({ label, htmlFor, error, hint, children, className }) {
  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
