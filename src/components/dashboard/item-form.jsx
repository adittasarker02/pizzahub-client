'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/label';
import { Input, Select, Textarea } from '@/components/ui/input';
import { ImageUploader } from './image-uploader';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';

export function ItemForm({ item }) {
  const router = useRouter();
  const editing = !!item;
  const [form, setForm] = useState({
    itemName: item?.itemName || '', category: item?.category || '', description: item?.description || '',
    price: item?.price ?? '', location: item?.location || '', images: item?.images || [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (form.itemName.trim().length < 3) next.itemName = 'Item name must be at least 3 characters';
    if (!form.category) next.category = 'Choose a category';
    if (form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    if (!(Number(form.price) >= 0.5)) next.price = 'Enter a price of at least $0.50';
    if (form.location.trim().length < 2) next.location = 'Enter the restaurant area / city';
    if (!form.images.length) next.images = 'Upload at least one image';
    setErrors(next);
    if (Object.keys(next).length) return toast.error('Please fix the highlighted fields');

    setLoading(true);
    try {
      const body = { ...form, price: Number(form.price) };
      const res = await api(editing ? `/vendor/items/${item._id}` : '/vendor/items', { method: editing ? 'PUT' : 'POST', body });
      toast.success(res.message);
      router.push('/dashboard/vendor/items');
      router.refresh();
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      toast.error(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <Field label="Item name" htmlFor="itemName" error={errors.itemName}>
          <Input id="itemName" placeholder="e.g. Smoky BBQ Chicken" value={form.itemName} onChange={set('itemName')} aria-invalid={!!errors.itemName} />
        </Field>
        <Field label="Category" htmlFor="category" error={errors.category}>
          <Select id="category" value={form.category} onChange={set('category')} aria-invalid={!!errors.category}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </Select>
        </Field>
        <Field label="Price (USD)" htmlFor="price" error={errors.price}>
          <Input id="price" type="number" step="0.01" min="0" inputMode="decimal" placeholder="12.99" value={form.price} onChange={set('price')} aria-invalid={!!errors.price} />
        </Field>
        <Field label="Location (area / city)" htmlFor="location" error={errors.location}>
          <Input id="location" placeholder="Gulshan, Dhaka" value={form.location} onChange={set('location')} aria-invalid={!!errors.location} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description} className="lg:col-span-2">
          <Textarea id="description" placeholder="Describe the toppings, crust, size…" value={form.description} onChange={set('description')} aria-invalid={!!errors.description} maxLength={1000} />
        </Field>
        <Field label="Item images (first image is the cover, up to 4)" error={errors.images} className="lg:col-span-2" hint="Images are uploaded to ImgBB. JPG, PNG, WEBP or GIF.">
          <ImageUploader value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} error={errors.images} />
        </Field>
        {editing && item.status === 'approved' && (
          <p className="rounded-xl bg-accent/20 p-3 text-sm lg:col-span-2">Saving changes sends this item back to <b>pending</b> so an admin can re-approve it.</p>
        )}
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button type="submit" size="lg" loading={loading}>{editing ? 'Save changes' : 'Submit for review'}</Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={loading}>Cancel</Button>
        </div>
      </Card>
    </form>
  );
}
