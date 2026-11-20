'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pause, Pencil, Pizza, Play, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { api } from '@/lib/api';
import { categoryName, ITEM_STATUSES } from '@/lib/constants';
import { formatDate, money } from '@/lib/utils';
import { useApi, useDebounce } from '@/hooks/use-api';

export default function VendorItems() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  const { data, loading, error, refetch } = useApi('/vendor/items', { query: { status, search: dSearch, page } });
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  async function toggle(item) {
    try {
      const res = await api(`/vendor/items/${item._id}/availability`, { method: 'PATCH', body: { available: item.status === 'inactive' } });
      toast.success(res.message);
      refetch();
    } catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="My menu items" description="Only you can see rejected and pending items. Approved items are live for customers.">
        <Button asChild><Link href="/dashboard/vendor/items/new"><Plus /> Add item</Link></Button>
      </PageHeader>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input placeholder="Search your items…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search items" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          {ITEM_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </Select>
      </div>

      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading your menu…" /> : !data.items.length ? (
        <EmptyState icon={Pizza} title="No menu items yet" message="Add your first pizza and submit it for admin approval." action={<Button asChild><Link href="/dashboard/vendor/items/new">Add menu item</Link></Button>} />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <THead><TR><TH>Item</TH><TH>Category</TH><TH>Price</TH><TH>Status</TH><TH>Added</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>
              {data.items.map((it) => (
                <TR key={it._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.images?.[0]} alt="" className="size-12 rounded-lg object-cover" />
                      <div className="min-w-0"><p className="max-w-[200px] truncate font-semibold">{it.itemName}</p><p className="text-xs text-muted-foreground">{it.location}</p></div>
                    </div>
                  </TD>
                  <TD className="text-muted-foreground">{categoryName(it.category)}</TD>
                  <TD className="font-semibold">{money(it.price)}</TD>
                  <TD><StatusBadge status={it.status} /></TD>
                  <TD className="text-muted-foreground">{formatDate(it.createdAt)}</TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setView(it)} aria-label="View details"><Eye /></Button>
                      <Button size="icon" variant="ghost" asChild aria-label="Edit"><Link href={`/dashboard/vendor/items/${it._id}/edit`}><Pencil /></Link></Button>
                      {(it.status === 'approved' || it.status === 'inactive') && (
                        <Button size="icon" variant="ghost" onClick={() => toggle(it)} aria-label={it.status === 'inactive' ? 'Make available' : 'Pause item'} title={it.status === 'inactive' ? 'Make available' : 'Pause item'}>
                          {it.status === 'inactive' ? <Play /> : <Pause />}
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setDel(it)} aria-label="Delete"><Trash2 /></Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}
      {data && <div className="px-1"><Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} /></div>}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (<>
            <DialogHeader><DialogTitle>{view.itemName}</DialogTitle><DialogDescription>{categoryName(view.category)} · {view.location}</DialogDescription></DialogHeader>
            <div className="grid grid-cols-3 gap-2">{/* eslint-disable-next-line @next/next/no-img-element */}
              {view.images.map((u) => <img key={u} src={u} alt="" className="aspect-square rounded-lg object-cover" />)}</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{view.description}</p>
            <div className="mt-4 flex items-center justify-between"><span className="font-display text-2xl font-bold text-primary">{money(view.price)}</span><StatusBadge status={view.status} /></div>
            {view.status === 'rejected' && <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">An admin rejected this item. Edit it and it will be re-submitted for review.</p>}
          </>)}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive title="Delete this menu item?" confirmLabel="Delete item"
        description={`"${del?.itemName}" will be permanently removed.`}
        onConfirm={async () => {
          try { const r = await api(`/vendor/items/${del._id}`, { method: 'DELETE' }); toast.success(r.message); refetch(); }
          catch (e) { toast.error(e.message); }
        }} />
    </>
  );
}
