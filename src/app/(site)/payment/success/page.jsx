import { Suspense } from 'react';
import { SuccessView } from './success-view';

export const metadata = { title: 'Payment Success' };

export default function Page() {
  return <Suspense><SuccessView /></Suspense>;
}
