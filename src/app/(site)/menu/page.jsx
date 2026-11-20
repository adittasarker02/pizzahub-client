import { Suspense } from 'react';
import { MenuBrowser } from './menu-browser';
import { PageLoader } from '@/components/common/states';

export const metadata = { title: 'Browse Menu' };

export default function MenuPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading menu…" />}>
      <MenuBrowser />
    </Suspense>
  );
}
