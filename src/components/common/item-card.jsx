import Link from 'next/link';
import { ArrowRight, BadgeCheck, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/ui/avatar';
import { categoryName } from '@/lib/constants';
import { money } from '@/lib/utils';

/** All cards share the same height: fixed image ratio, clamped text, footer pinned to the bottom */
export function ItemCard({ item }) {
  const vendorName = item.vendor?.businessName || item.vendor?.name || 'Local pizzeria';
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-ink/70 hover:shadow-[5px_5px_0_0_var(--ink)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images?.[0]}
          alt={item.itemName}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge variant="secondary" className="absolute left-3 top-3 border border-ink/15 bg-card/95 backdrop-blur normal-case">
          {categoryName(item.category)}
        </Badge>
        {item.vendor?.isPremium && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border-2 border-ink bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_var(--ink)]">
            <Star className="size-3 fill-current" /> Premium
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-lg font-semibold leading-snug">{item.itemName}</h3>
          <p className="shrink-0 font-display text-lg font-bold text-primary">{money(item.price)}</p>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[2.8rem] text-sm text-muted-foreground">{item.description}</p>

        <div className="mt-4 flex items-center gap-2.5 text-sm">
          <UserAvatar name={vendorName} src={item.vendor?.image} className="size-7" />
          <span className="flex min-w-0 items-center gap-1 font-medium">
            <span className="truncate">{vendorName}</span>
            {item.vendor?.isPremium && <BadgeCheck className="size-4 shrink-0 text-basil" aria-label="Premium vendor" />}
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{item.location}</span>
        </p>

        <Button asChild size="sm" className="mt-5 w-full">
          <Link href={`/menu/${item._id}`}>
            View Details <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}
