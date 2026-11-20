import { ItemCard, ItemCardSkeleton } from './item-card';
import { EmptyState, ErrorState } from './states';

export const gridClass = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

export function ItemGrid({ items, loading, error, onRetry, skeletons = 6, empty, cols = gridClass }) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (loading && !items?.length) {
    return (
      <div className={cols} aria-busy="true">
        {Array.from({ length: skeletons }).map((_, i) => <ItemCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!items?.length) return empty || <EmptyState title="No menu items found" message="Try changing your search or filters." />;
  return (
    <div className={cols}>
      {items.map((item) => <ItemCard key={item._id} item={item} />)}
    </div>
  );
}
