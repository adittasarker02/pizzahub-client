'use client';
import { useState } from 'react';
import { Ban, Check, Trash2, UtensilsCrossed, X } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/widgets';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { EmptyState, ErrorState, PageLoader } from '@/components/common/states';
import { Pagination } from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { api } from '@/lib/api';
import { categoryName, CATEGORIES, ITEM_STATUSES } from '@/lib/constants';
import { formatDate, money } from '@/lib/utils';
import { useApi, useDebounce } from '@/hooks/use-api';

export default function AdminItems() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  const { data, loading, error, refetch } = useApi('/admin/items', { query: { search: dSearch, status, category, page } });
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  async function setItemStatus(item, next) {
    try { const r = await api(`/admin/items/${item._id}/status`, { method: 'PATCH', body: { status: next } }); toast.success(r.message); refetch(); }
    catch (e) { toast.error(e.message); }
  }

  return (
    <>
      <PageHeader title="Manage menu items" description="Review pending items, change the status of published ones or delete inappropriate content." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_220px]">
        <Input placeholder="Search by name or location…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search items" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status filter">
          <option value="">All statuses</option>{ITEM_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} aria-label="Category filter">
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </Select>
      </div>

      {error ? <ErrorState error={error} onRetry={refetch} /> : loading && !data ? <PageLoader label="Loading items…" /> : !data.items.length ? (
        <EmptyState icon={UtensilsCrossed} title="No items match" message="Try different filters." />
      ) : (
        <Card className="overflow-hidden">
          <Table className="min-w-[860px]">
            <THead><TR><TH>Item</TH><TH>Vendor</TH><TH>Category</TH><TH>Price</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>
              {data.items.map((it) => (
                <TR key={it._id}>
                  <TD>
                    <button className="flex items-center gap-3 text-left" onClick={() => setView(it)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.images?.[0]} alt="" className="size-12 rounded-lg object-cover" />
                      <div><p className="max-w-[190px] truncate font-semibold hover:underline">{it.itemName}</p><p className="text-xs text-muted-foreground">{formatDate(it.createdAt)}</p></div>
                    </button>
                  </TD>
                  <TD><p className="font-medium">{it.vendor?.businessName || it.vendor?.name}</p><p className="text-xs text-muted-foreground">{it.location}</p></TD>
                  <TD className="text-muted-foreground">{categoryName(it.category)}</TD>
                  <TD className="font-semibold">{money(it.price)}</TD>
                  <TD><StatusBadge status={it.status} /></TD>
                  <TD>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {it.status === 'pending' && (<>
                        <Button size="sm" onClick={() => setItemStatus(it, 'approved')}><Check /> Approve</Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => setItemStatus(it, 'rejected')}><X /> Reject</Button>
                      </>)}
                      {it.status === 'approved' && <Button size="sm" variant="outline" onClick={() => setItemStatus(it, 'inactive')}><Ban /> Deactivate</Button>}
                      {(it.status === 'inactive' || it.status === 'rejected') && <Button size="sm" variant="outline" onClick={() => setItemStatus(it, 'approved')}><Check /> Approve</Button>}
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDel(it)} aria-label="Delete"><Trash2 /></Button>
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
            <DialogHeader><DialogTitle>{view.itemName}</DialogTitle><DialogDescription>{categoryName(view.category)} · {view.location} · by {view.vendor?.businessName || view.vendor?.name}</DialogDescription></DialogHeader>
            <div className="grid grid-cols-3 gap-2">{/* eslint-disable-next-line @next/next/no-img-element */}
              {view.images.map((u) => <img key={u} src={u} alt="" className="aspect-square rounded-lg object-cover" />)}</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{view.description}</p>
            <div className="mt-4 flex items-center justify-between"><span className="font-display text-2xl font-bold text-primary">{money(view.price)}</span><StatusBadge status={view.status} /></div>
          </>)}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive title="Delete this menu item?" confirmLabel="Delete item"
        description={`"${del?.itemName}" will be removed permanently and its pending orders cancelled.`}
        onConfirm={async () => { try { const r = await api(`/admin/items/${del._id}`, { method: 'DELETE' }); toast.success(r.message); refetch(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
