'use client';
import { useState } from 'react';
import { Lock, Receipt } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/widgets';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/badge';
import { Select } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { formatDateTime, money } from '@/lib/utils';
import { useApi } from '@/hooks/use-api';

export default function AdminTransactions() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useApi('/admin/transactions', { query: { status, page } });
  return (
    <>
      <PageHeader title="Transactions" description="Subscription payments recorded from Stripe.">
        <p className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground"><Lock className="size-3.5" /> Read-only · only Stripe webhooks can change payment records</p>
      </PageHeader>
      <div className="mb-5 max-w-xs">
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Payment status">
          <option value="">All payment statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="expired">Expired</option>
        </Select>
      </div>
      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading transactions…" /> : !data.items.length ? (
        <EmptyState icon={Receipt} title="No transactions" message="Subscription payments will show up here." />
      ) : (
        <Card className="overflow-hidden">
          <Table className="min-w-[820px]">
            <THead><TR><TH>Vendor</TH><TH>Plan</TH><TH>Amount</TH><TH>Payment status</TH><TH>Date</TH><TH>Stripe session</TH></TR></THead>
            <TBody>
              {data.items.map((t) => (
                <TR key={t._id}>
                  <TD><div className="flex items-center gap-3"><UserAvatar name={t.vendor?.name} src={t.vendor?.image} /><div><p className="font-semibold">{t.vendor?.businessName || t.vendor?.name || 'Deleted vendor'}</p><p className="text-xs text-muted-foreground">{t.vendor?.email}</p></div></div></TD>
                  <TD className="capitalize">{t.plan}</TD>
                  <TD className="font-semibold">{money(t.amount)} <span className="text-xs uppercase text-muted-foreground">{t.currency}</span></TD>
                  <TD><StatusBadge status={t.status} /></TD>
                  <TD className="text-muted-foreground">{formatDateTime(t.createdAt)}</TD>
                  <TD><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{String(t.stripeSessionId).slice(0, 22)}…</code></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
      {data && <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />}
    </>
  );
}
