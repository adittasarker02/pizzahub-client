'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { ItemGrid } from '@/components/common/item-grid';
import { Pagination } from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants';
import { useApi, useDebounce } from '@/hooks/use-api';
import { cn } from '@/lib/utils';

const LIMIT = 9;

export function MenuBrowser() {
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get('search') || '');
  const [category, setCategory] = useState(sp.get('category') || '');
  const [location, setLocation] = useState(sp.get('location') || '');
  const [sort, setSort] = useState(sp.get('sort') || 'featured');
  const [minPrice, setMinPrice] = useState(sp.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(sp.get('maxPrice') || '');
  const [page, setPage] = useState(Number(sp.get('page')) || 1);
  const [showAdvanced, setShowAdvanced] = useState(!!(sp.get('minPrice') || sp.get('maxPrice')));

  const dSearch = useDebounce(search, 400);
  const dMin = useDebounce(minPrice, 500);
  const dMax = useDebounce(maxPrice, 500);

  const query = useMemo(
    () => ({ search: dSearch.trim(), category, location, sort, minPrice: dMin, maxPrice: dMax, page, limit: LIMIT }),
    [dSearch, category, location, sort, dMin, dMax, page],
  );

  const { data, loading, error, refetch } = useApi('/menu', { query, auth: false });
  const { data: locData } = useApi('/menu/locations', { auth: false });

  // keep the URL shareable without triggering a navigation
  useEffect(() => {
    if (window.location.pathname !== '/menu') return; // never fight an in-flight navigation
    const p = new URLSearchParams();
    Object.entries({ ...query, limit: '' }).forEach(([k, v]) => v && v !== 'featured' && !(k === 'page' && v === 1) && p.set(k, v));
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `/menu?${qs}` : '/menu');
  }, [query]);

  const resetPage = (setter) => (v) => { setter(v); setPage(1); };
  const hasFilters = search || category || location || minPrice || maxPrice || sort !== 'featured';
  function clearAll() {
    setSearch(''); setCategory(''); setLocation(''); setSort('featured'); setMinPrice(''); setMaxPrice(''); setPage(1);
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading eyebrow="Browse menu" title="Find your perfect pizza" lead="Search every approved menu on PizzaHub — filter by category and area, then sort by price." />

      <div className="mt-8 rounded-2xl border-2 border-border bg-card p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => resetPage(setSearch)(e.target.value)}
              placeholder="Search pizza, restaurant or area…"
              className="pl-11 pr-10"
              aria-label="Search menu"
            />
            {search && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground" onClick={() => resetPage(setSearch)('')} aria-label="Clear search">
                <X className="size-4" />
              </button>
            )}
          </div>
          <Select value={location} onChange={(e) => resetPage(setLocation)(e.target.value)} aria-label="Filter by location">
            <option value="">All locations</option>
            {(locData?.locations || []).map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Select value={sort} onChange={(e) => resetPage(setSort)(e.target.value)} aria-label="Sort items">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Button variant="outline" onClick={() => setShowAdvanced((s) => !s)} aria-expanded={showAdvanced}>
            <SlidersHorizontal /> Price
          </Button>
        </div>

        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-md">
            <Input type="number" min="0" inputMode="decimal" placeholder="Min price ($)" value={minPrice} onChange={(e) => resetPage(setMinPrice)(e.target.value)} aria-label="Minimum price" />
            <Input type="number" min="0" inputMode="decimal" placeholder="Max price ($)" value={maxPrice} onChange={(e) => resetPage(setMaxPrice)(e.target.value)} aria-label="Maximum price" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Categories">
          {[{ slug: '', name: 'All items' }, ...CATEGORIES].map((c) => (
            <button
              key={c.slug}
              onClick={() => resetPage(setCategory)(c.slug)}
              aria-pressed={category === c.slug}
              className={cn(
                'rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition',
                category === c.slug ? 'border-ink bg-primary text-primary-foreground shadow-[2px_2px_0_0_var(--ink)]' : 'border-border bg-background hover:border-ink/50',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex min-h-8 items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">{loading ? 'Searching…' : data ? `${data.total} item${data.total === 1 ? '' : 's'} found` : ''}</p>
        {hasFilters && (
          <button onClick={clearAll} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            <RotateCcw className="size-3.5" /> Reset filters
          </button>
        )}
      </div>

      <div className="mt-4">
        <ItemGrid
          items={data?.items}
          loading={loading}
          error={error}
          onRetry={refetch}
          skeletons={LIMIT}
          empty={
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 py-16 text-center">
              <p className="text-5xl">🍕</p>
              <h3 className="mt-4 font-display text-xl font-semibold">No pizza matches that search</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try a different keyword, or clear your filters.</p>
              <Button className="mt-6" variant="outline" onClick={clearAll}>Clear filters</Button>
            </div>
          }
        />
      </div>
      <Pagination page={data?.page || 1} totalPages={data?.totalPages} total={data?.total} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}
