'use client';

import Link from 'next/link';
import { productByName } from '@/lib/catalog';
import { useRequestList } from '@/components/RequestListContext';

/** "Your request" panel on the right rail of steps 1–2. Step 1 adds the Edit
    link, the no-pricing note, and the license-lock line. */
export default function RequestSummaryRail({ full }: { full: boolean }) {
  const { items } = useRequestList();

  const panel = (
    <div className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-6">
      {full ? (
        <div className="flex items-center justify-between pb-2.5">
          <span className="font-display text-[23px] text-navy">Your request</span>
          <Link href="/shop" className="text-xs no-underline">
            Edit
          </Link>
        </div>
      ) : (
        <span className="pb-2.5 font-display text-[23px] text-navy">Your request</span>
      )}
      {items.map((it) => {
        const product = productByName(it.name);
        return (
          <div key={it.name} className="flex items-center gap-3 border-t border-line-softest py-[13px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product ? `/${product.image}` : '/assets/vials/nad.jpg'}
              alt={`${it.name} sterile vial`}
              className="h-[54px] w-[54px] shrink-0 rounded-[10px] border border-line bg-white object-cover"
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="font-display text-lg text-navy">{it.name}</span>
              <span className="text-xs text-muted-2">
                {it.program} · {it.presentation ?? 'presentation pending'}
              </span>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="border-t border-line-softest py-[13px]">
          <span className="text-[13px] text-muted-2">
            Your request list is empty —{' '}
            <Link href="/shop" className="font-semibold no-underline">
              browse the catalog
            </Link>
            .
          </span>
        </div>
      )}
    </div>
  );

  if (!full) return panel;

  return (
    <div className="flex flex-col gap-4">
      {panel}
      <div className="rounded-xl border border-brand-tintBorder bg-brand-tint px-4 py-3.5">
        <span className="text-[13px] leading-5 text-brand-deep">
          <strong>No pricing online.</strong> A representative will follow up with program details for your
          list.
        </span>
      </div>
      <div className="flex items-center gap-2 px-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C93A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10 L8 7 C8 4.8 9.8 3 12 3 C14.2 3 16 4.8 16 7 L16 10" />
        </svg>
        <span className="text-xs text-muted-2">License verified before any order is placed</span>
      </div>
    </div>
  );
}
