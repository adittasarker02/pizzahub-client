import { cn } from '@/lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border-2 border-border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  );
}
export const CardHeader = ({ className, ...p }) => <div className={cn('flex flex-col gap-1.5 p-5 pb-2', className)} {...p} />;
export const CardTitle = ({ className, ...p }) => (
  <h3 className={cn('font-display text-lg font-semibold leading-snug', className)} {...p} />
);
export const CardDescription = ({ className, ...p }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...p} />
);
export const CardContent = ({ className, ...p }) => <div className={cn('p-5 pt-3', className)} {...p} />;
export const CardFooter = ({ className, ...p }) => <div className={cn('flex items-center p-5 pt-0', className)} {...p} />;
