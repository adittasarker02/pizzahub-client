'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pagination({ page, totalPages, onChange, total }) {
  if (!totalPages || totalPages <= 1) return total != null ? <p className="mt-6 text-center text-sm text-muted-foreground">{total} result{total === 1 ? '' : 's'}</p> : null;
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">Page {page} of {totalPages}{total != null && ` · ${total} results`}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft /> Prev</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next <ChevronRight /></Button>
      </div>
    </div>
  );
}
