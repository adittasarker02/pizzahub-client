import { ItemDetails } from './item-details';

export const metadata = { title: 'Menu Item' };

export default async function ItemPage({ params }) {
  const { id } = await params;
  return <ItemDetails id={id} />;
}
