import { Suspense } from 'react';
import type { Metadata } from 'next';
import ShopPage from '@/components/shop/ShopPage';

export const metadata: Metadata = {
  title: 'Shop All — Evoluciona Pharma',
};

export default function Shop() {
  return (
    <Suspense fallback={null}>
      <ShopPage />
    </Suspense>
  );
}
