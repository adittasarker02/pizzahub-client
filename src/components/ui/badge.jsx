import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/12 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        success: 'border-transparent bg-basil/15 text-basil',
        warning: 'border-transparent bg-accent/25 text-[#8a4a05] dark:text-accent',
        danger: 'border-transparent bg-destructive/12 text-destructive',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const STATUS_VARIANT = {
  pending: 'warning',
  approved: 'success',
  accepted: 'success',
  paid: 'success',
  active: 'success',
  rejected: 'danger',
  failed: 'danger',
  blocked: 'danger',
  cancelled: 'muted',
  inactive: 'muted',
  expired: 'muted',
};

export function StatusBadge({ status, className }) {
  return (
    <Badge variant={STATUS_VARIANT[status] || 'secondary'} className={className}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
