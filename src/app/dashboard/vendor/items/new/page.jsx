'use client';
import { PageHeader } from '@/components/dashboard/widgets';
import { ItemForm } from '@/components/dashboard/item-form';

export default function NewItemPage() {
  return (
    <>
      <PageHeader title="Add menu item" description="New items start as pending until an admin approves them." />
      <ItemForm />
    </>
  );
}
