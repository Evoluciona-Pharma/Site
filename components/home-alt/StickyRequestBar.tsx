'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { Product } from '@/lib/catalog';

/** Appears past 620px of scroll. Sits under the drawer (z-20 vs z-40). */
export default function StickyRequestBar({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 620);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className="fixed inset-x-0 bottom-0 z-20 flex h-[72px] items-center gap-4 border-t border-line bg-[rgba(255,255,255,0.94)] px-14 backdrop-blur-[14px]"
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(product.image)}
        alt={`${product.name} sterile vial`}
        className="h-11 w-11 shrink-0 rounded-lg border border-line bg-white object-cover"
      />
      <span className="font-display text-[21px] text-navy">{product.name}</span>
      <span className="text-[13px] text-muted-2">{product.spec}</span>
      <div className="flex-1" />
      <span className="text-[13px] text-muted-2">No pricing online · request only</span>
      <button
        onClick={onAdd}
        className="inline-flex h-11 cursor-pointer items-center rounded-full border-none bg-brand px-6 font-sans text-[13px] font-semibold text-white hover:bg-brand-hover"
      >
        Add to Request List
      </button>
    </div>
  );
}
