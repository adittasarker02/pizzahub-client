'use client';
import { use } from 'react';
import { PageHeader } from '@/components/dashboard/widgets';
import { ItemForm } from '@/components/dashboard/item-form';
import { ErrorState, PageLoader } from '@/components/common/states';
import { useApi } from '@/hooks/use-api';

export default function EditItemPage({ params }) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useApi(`/vendor/items/${id}`);
  if (loading) return <PageLoader label="Loading item…" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  return (
    <>
      <PageHeader title="Edit menu item" description={data.item.itemName} />
      <ItemForm item={data.item} />
    </>
  );
}
