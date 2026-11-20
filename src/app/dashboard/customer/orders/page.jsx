'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Eye, ShoppingBag, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { OrderTimeline } from '@/components/dashboard/order-timeline';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { api } from '@/lib/api';
import { ORDER_STATUSES } from '@/lib/constants';
import { cn, formatDate, money } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

export default function CustomerOrders() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useApi('/customer/orders', { query: { status, page } });
  const [view, setView] = useState(null);
  const [cancel, setCancel] = useState(null);

  return (
    <>
      <PageHeader title="My orders" description="Track your orders. You can cancel an order while it is still pending." />
      <div className="mb-5 flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} aria-pressed={status === s}
            className={cn('rounded-full border-2 px-4 py-1.5 text-sm font-semibold capitalize transition', status === s ? 'border-ink bg-primary text-primary-foreground' : 'border-border bg-card hover:border-ink/50')}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading your orders…" /> : !data.items.length ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" message="Browse the menu and place your first order." action={<Button asChild><Link href="/menu">Browse menu</Link></Button>} />
      ) : (
        <Card className="overflow-hidden">
          <Table className="min-w-[860px]">
            <THead><TR><TH>Item</TH><TH>Restaurant</TH><TH>Delivery</TH><TH>Requested</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>
              {data.items.map((o) => (
                <TR key={o._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.item?.images?.[0] && <img src={o.item.images[0]} alt="" className="size-12 rounded-lg object-cover" />}
                      <div><p className="max-w-[170px] truncate font-semibold">{o.item?.itemName || 'Item removed'}</p><p className="text-xs text-muted-foreground">{money(o.item?.price)}</p></div>
                    </div>
                  </TD>
                  <TD><p className="font-medium">{o.vendor?.businessName || o.vendor?.name || '—'}</p><p className="text-xs text-muted-foreground">{o.vendor?.email}</p></TD>
                  <TD><p className="font-medium">{formatDate(o.deliveryDate, { dateStyle: 'medium', timeZone: 'UTC' })}</p><p className="max-w-[200px] truncate text-xs text-muted-foreground">{o.deliveryAddress}</p></TD>
                  <TD className="text-muted-foreground">{formatDate(o.createdAt)}</TD>
                  <TD><StatusBadge status={o.status} /></TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setView(o)}><Eye /> Details</Button>
                      {o.status === 'pending' && <Button size="sm" variant="outline" className="text-destructive" onClick={() => setCancel(o)}><XCircle /> Cancel</Button>}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (<>
            <DialogHeader><DialogTitle>{view.item?.itemName || 'Order details'}</DialogTitle><DialogDescription>Ordered {formatDate(view.createdAt)} · <StatusBadge status={view.status} className="align-middle" /></DialogDescription></DialogHeader>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs font-bold uppercase text-muted-foreground">Restaurant</dt><dd>{view.vendor?.businessName || view.vendor?.name} · {view.vendor?.email}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-muted-foreground">Delivery</dt><dd>{formatDate(view.deliveryDate, { dateStyle: 'full', timeZone: 'UTC' })}<br />{view.deliveryAddress}</dd></div>
              <div><dt className="text-xs font-bold uppercase text-muted-foreground">Your message</dt><dd>{view.message || '—'}</dd></div>
            </dl>
            <h4 className="mb-3 mt-6 font-display text-lg font-semibold">Order timeline</h4>
            <OrderTimeline order={view} />
            {view.status === 'accepted' && (
              <Button variant="accent" className="mt-6 w-full" onClick={() => toast.info('Online payment for orders is not part of this demo — pay on delivery.')}><CreditCard /> Pay Now</Button>
            )}
          </>)}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)} destructive title="Cancel this order?" confirmLabel="Yes, cancel order"
        description={`Your order for ${cancel?.item?.itemName || 'this item'} will be cancelled.`}
        onConfirm={async () => {
          try { const r = await api(`/customer/orders/${cancel._id}/cancel`, { method: 'PATCH' }); toast.success(r.message); }
          catch (e) { toast.error(e.message); }
          refetch();
        }} />
    </>
  );
}
