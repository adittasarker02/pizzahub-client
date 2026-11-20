'use client';
import Link from 'next/link';
import { SectionHeading } from '@/components/common/section-heading';
import { Reveal } from '@/components/common/reveal';
import { CATEGORIES } from '@/lib/constants';
import { useApi } from '@/hooks/use-api';
import { Skeleton } from '@/components/ui/skeleton';

export function Categories() {
  const { data, loading } = useApi('/menu/categories', { auth: false });
  const counts = Object.fromEntries((data?.categories || []).map((c) => [c.slug, c.count]));
  return (
    <section className="border-y-2 border-border bg-secondary/50 py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow="Pizza categories" title="Whatever you're craving" lead="Jump straight to the part of the menu you love." />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link
                href={`/menu?category=${c.slug}`}
                className="group flex h-full items-center gap-5 rounded-2xl border-2 border-border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-ink/70 hover:shadow-[5px_5px_0_0_var(--ink)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" className="size-24 shrink-0 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold leading-snug">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  {loading ? (
                    <Skeleton className="mt-2 h-4 w-16" />
                  ) : (
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:underline">
                      {counts[c.slug] ?? 0} {counts[c.slug] === 1 ? 'item' : 'items'} →
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
