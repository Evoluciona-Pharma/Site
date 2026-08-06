'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { compliance, productByName } from '@/lib/catalog';
import { useRequestList } from './RequestListContext';

export default function RequestDrawer() {
  const { items, count, drawerOpen, remove, closeDrawer } = useRequestList();

  useEffect(() => {
    if (!drawerOpen) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <>
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-[39] animate-[fadeIn_0.25s_ease_both] cursor-pointer bg-[rgba(20,37,63,0.45)]"
      />
      <div className="fixed bottom-0 right-0 top-0 z-40 flex w-drawer animate-slideIn flex-col bg-white font-sans shadow-drawer">
        <div className="flex items-center justify-between gap-3 border-b border-line-soft px-6 py-[22px]">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[26px] text-navy">Request list</span>
            <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[11px] bg-brand-tint px-1.5 text-xs font-bold text-brand">
              {count}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close request list"
            className="h-[34px] w-[34px] cursor-pointer rounded-[17px] border-none bg-line-softest text-base text-navy hover:bg-line-card"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-auto px-6 pt-1">
          {items.map((it) => {
            const product = productByName(it.name);
            return (
              <div key={it.name} className="flex items-center gap-3.5 border-b border-line-soft py-[18px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product ? `/${product.image}` : '/assets/vials/nad.jpg'}
                  alt={`${it.name} sterile vial`}
                  className="h-16 w-16 shrink-0 rounded-[10px] border border-line bg-white object-cover"
                />
                <div className="flex flex-1 flex-col gap-[3px]">
                  <span className="font-display text-[19px] leading-[1.1] text-navy">{it.name}</span>
                  <span className="text-[12.5px] text-muted-2">
                    {it.program} · {it.presentation ?? 'presentation pending'}
                  </span>
                </div>
                <button
                  onClick={() => remove(it.name)}
                  className="cursor-pointer border-none bg-transparent font-sans text-xs font-medium text-muted-2 underline hover:text-danger"
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="mt-4 rounded-[10px] border border-warn-border bg-warn-bg px-3.5 py-3">
            <span className="text-meta-sm text-warn-text">{compliance.drawerNotice}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-line-soft px-6 pb-[22px] pt-5">
          <Link
            href="/request/contact"
            onClick={closeDrawer}
            className="flex h-[50px] w-full items-center justify-center rounded-full bg-brand font-sans text-sm font-semibold text-white no-underline hover:bg-brand-hover hover:text-white"
          >
            Request Product Information
          </Link>
          <button
            onClick={closeDrawer}
            className="cursor-pointer border-none bg-transparent font-sans text-[13px] font-semibold text-navy underline"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </>
  );
}
