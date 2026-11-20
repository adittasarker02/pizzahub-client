'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { ItemGrid } from '@/components/common/item-grid';
import { Reveal } from '@/components/common/reveal';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';

export function FeaturedItems() {
  const { data, loading, error, refetch } = useApi('/menu/featured', { query: { limit: 6 }, auth: false });
  return (
    <section className="container-page py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Featured menu"
          title="Fresh out of the oven"
          lead="Hand-picked favourites from approved local restaurants. Premium partners get featured first."
        >
          <Button asChild variant="outline">
            <Link href="/menu">View full menu <ArrowRight /></Link>
          </Button>
        </SectionHeading>
      </Reveal>
      <div className="mt-10">
        <ItemGrid items={data?.items} loading={loading} error={error} onRetry={refetch} />
      </div>
    </section>
  );
}
