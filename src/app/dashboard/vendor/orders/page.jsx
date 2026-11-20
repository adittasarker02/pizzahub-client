'use client';
import { useState } from 'react';
import { Check, ListOrdered, X } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { api } from '@/lib/api';
import { ORDER_STATUSES } from '@/lib/constants';
import { cn, formatDate, money } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

export default function VendorOrders() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useApi('/vendor/orders', { query: { status, page } });
  const [confirm, setConfirm] = useState(null); // {order, decision}

  return (
    <>
      <PageHeader title="Customer orders" description="Accept or reject incoming orders. A decision can only be made once." />
      <div className="mb-5 flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} aria-pressed={status === s}
            className={cn('rounded-full border-2 px-4 py-1.5 text-sm font-semibold capitalize transition', status === s ? 'border-ink bg-primary text-primary-foreground' : 'border-border bg-card hover:border-ink/50')}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading orders…" /> : !data.items.length ? (
        <EmptyState icon={ListOrdered} title="No orders here" message="Orders from customers will appear here." />
      ) : (
        <Card className="overflow-hidden">
          <Table className="min-w-[900px]">
            <THead><TR><TH>Customer</TH><TH>Item</TH><TH>Delivery</TH><TH>Message</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>
              {data.items.map((o) => (
                <TR key={o._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={o.customer?.name} src={o.customer?.image} />
                      <div className="min-w-0"><p className="font-semibold">{o.customer?.name || 'Unknown'}</p><p className="max-w-[170px] truncate text-xs text-muted-foreground">{o.customer?.email}</p></div>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.item?.images?.[0] && <img src={o.item.images[0]} alt="" className="size-11 rounded-lg object-cover" />}
                      <div><p className="max-w-[160px] truncate font-semibold">{o.item?.itemName || 'Removed item'}</p><p className="text-xs text-muted-foreground">{money(o.item?.price)}</p></div>
                    </div>
                  </TD>
                  <TD>
                    <p className="font-medium">{formatDate(o.deliveryDate)}</p>
                    <p className="max-w-[210px] text-xs text-muted-foreground">{o.deliveryAddress}</p>
                  </TD>
                  <TD className="max-w-[180px] text-sm text-muted-foreground">{o.message || '—'}</TD>
                  <TD><StatusBadge status={o.status} /></TD>
                  <TD>
                    {o.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => setConfirm({ order: o, decision: 'accepted' })}><Check /> Accept</Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => setConfirm({ order: o, decision: 'rejected' })}><X /> Reject</Button>
                      </div>
                    ) : <p className="text-right text-xs text-muted-foreground">Decided</p>}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}

      <ConfirmDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)} destructive={confirm?.decision === 'rejected'}
        title={confirm?.decision === 'accepted' ? 'Accept this order?' : 'Reject this order?'} confirmLabel={confirm?.decision === 'accepted' ? 'Accept order' : 'Reject order'}
        description="This cannot be changed afterwards."
        onConfirm={async () => {
          try { const r = await api(`/vendor/orders/${confirm.order._id}/status`, { method: 'PATCH', body: { status: confirm.decision } }); toast.success(r.message); }
          catch (e) { toast.error(e.message); }
          refetch();
        }} />
    </>
  );
}
