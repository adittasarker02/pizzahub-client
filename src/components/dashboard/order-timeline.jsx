import { Check, CircleDashed, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

/** Optional feature: visual order status timeline */
export function OrderTimeline({ order }) {
  const s = order.status;
  const steps = [
    { label: 'Order placed', state: 'done', time: order.createdAt },
    s === 'cancelled'
      ? { label: 'Cancelled by you', state: 'bad', time: order.updatedAt }
      : s === 'rejected'
        ? { label: 'Rejected by restaurant', state: 'bad', time: order.updatedAt }
        : s === 'accepted'
          ? { label: 'Accepted by restaurant', state: 'done', time: order.updatedAt }
          : { label: 'Waiting for restaurant', state: 'current' },
    ...(s === 'accepted' ? [{ label: 'Scheduled for delivery', state: 'current', time: order.deliveryDate, dateOnly: true }] : []),
  ];
  return (
    <ol className="space-y-0">
      {steps.map((st, i) => (
        <li key={st.label} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-border" />}
          <span className={cn('z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2',
            st.state === 'done' && 'border-basil bg-basil text-white', st.state === 'bad' && 'border-destructive bg-destructive text-white', st.state === 'current' && 'border-accent bg-accent/30 text-foreground')}>
            {st.state === 'done' ? <Check className="size-4" /> : st.state === 'bad' ? <X className="size-4" /> : <CircleDashed className="size-4" />}
          </span>
          <div><p className="text-sm font-semibold">{st.label}</p>{st.time && <p className="text-xs text-muted-foreground">{st.dateOnly ? new Date(st.time).toLocaleDateString('en-US', { dateStyle: 'medium', timeZone: 'UTC' }) : formatDateTime(st.time)}</p>}</div>
        </li>
      ))}
    </ol>
  );
}
