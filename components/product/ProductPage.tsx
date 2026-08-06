'use client';

import Link from 'next/link';
import { useState } from 'react';
import { asset } from '@/lib/asset';
import {
  alsoReview,
  compliance,
  pairedProduct,
  Product,
  productAccordion,
  productThumbViews,
  programByLabel,
} from '@/lib/catalog';
import Reveal from '@/components/Reveal';
import { useRequestList } from '@/components/RequestListContext';

const chev = (open: boolean) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8C93A0"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'none' }}
  >
    <path d="M6 9 L12 15 L18 9" />
  </svg>
);

export default function ProductPage({ product }: { product: Product }) {
  const { add } = useRequestList();
  const [imgIndex, setImgIndex] = useState(0);
  const [acc, setAcc] = useState<string | null>('desc');
  const [size, setSize] = useState<string | null>(product.defaultPresentation);

  const pending = product.presentationStatus === 'pending';
  const programSlug = programByLabel(product.program)?.slug ?? '';
  const catHref = `/shop?program=${programSlug}`;
  const pair = pairedProduct(product);
  const related = alsoReview(product);

  const addMain = () => add({ name: product.name, program: product.program, presentation: size });
  const stickySpec = pending
    ? 'Sterile vial · presentation pending'
    : `Sterile vial · ${product.concentration ? `${product.concentration} · ${size}` : size}`;

  const sections = [
    { id: 'desc', title: 'Description', body: product.description },
    { id: 'supplied', title: "How it's supplied", body: product.howSupplied },
    { id: 'reqs', title: 'Provider requirements', body: productAccordion.providerRequirements },
    {
      id: 'faq',
      title: 'Product FAQ',
      body: productAccordion.productFaq,
      href: '/faq',
      linkLabel: 'View all FAQs →',
    },
  ];

  return (
    <div className="flex flex-col bg-white">
      <div className="px-14 pt-[22px]">
        <span className="text-[13px] text-muted-2">
          <Link href="/" className="text-muted-2 no-underline hover:text-brand">
            Home
          </Link>{' '}
          /{' '}
          <Link href={catHref} className="text-muted-2 no-underline hover:text-brand">
            {product.program}
          </Link>{' '}
          / <span className="font-semibold text-navy">{product.name}</span>
        </span>
      </div>

      <div className="grid grid-cols-[660px_1fr] items-start gap-[52px] px-14 pb-[60px] pt-6">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <Reveal className="group relative h-[520px] overflow-hidden rounded-[18px] border border-line bg-white">
            {imgIndex === 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(product.image)}
                alt={`${product.name} sterile vial`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[ease] group-hover:scale-[1.06]"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'repeating-linear-gradient(135deg,#EDF0F4 0 10px,#E4E9EF 10px 20px)' }}
              >
                <span className="rounded-[4px] bg-[rgba(255,255,255,0.92)] px-2 py-1 font-mono text-meta-xs text-muted-2">
                  product photography · {product.slug} · {productThumbViews[imgIndex]} · 660×520
                </span>
              </div>
            )}
          </Reveal>
          <div className="flex gap-2.5">
            {productThumbViews.map((view, i) => (
              <div
                key={view}
                onClick={() => setImgIndex(i)}
                className="flex h-[76px] w-[94px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px] transition-colors duration-200"
                style={{
                  background:
                    i === 0 ? '#ffffff' : 'repeating-linear-gradient(135deg,#EDF0F4 0 8px,#E4E9EF 8px 16px)',
                  border: imgIndex === i ? '2px solid #14258F' : '1px solid #E5E8ED',
                }}
              >
                {i === 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(product.image)} alt={`${product.name} vial`} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-mono text-[9px] text-muted-2">0{i + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <Reveal as="h2" delay={80} className="text-[58px] leading-[0.98] text-navy">
            {product.name}
          </Reveal>
          <div className="flex flex-wrap gap-2">
            <Link
              href={catHref}
              className="rounded-full bg-brand-tint px-3 py-[5px] text-meta-xs font-semibold text-brand no-underline hover:bg-brand-tintHover"
            >
              {product.program}
            </Link>
            <span className="rounded-full border border-teal-border px-3 py-1 text-meta-xs font-semibold text-teal">
              Sterile
            </span>
          </div>
          <span className="text-body text-muted">{product.tagline}</span>

          {product.presentations.length > 0 && (
            <div className="flex flex-col gap-[9px]">
              <span className="text-[13px] font-semibold text-navy">Presentation</span>
              <div className="flex flex-wrap gap-2">
                {product.presentations.map((label) => (
                  <span
                    key={label}
                    onClick={() => setSize(label)}
                    className={
                      size === label
                        ? 'inline-flex h-[42px] cursor-pointer items-center rounded-full bg-brand px-[22px] text-sm font-semibold text-white'
                        : 'inline-flex h-[42px] cursor-pointer items-center rounded-full border border-line-strong px-[22px] text-sm font-medium text-ink-700 transition-all duration-200 hover:border-brand hover:text-brand'
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pending && (
            <div className="rounded-[10px] border border-warn-border bg-warn-bg px-3.5 py-3">
              <span className="text-[13px] font-semibold leading-5 text-warn-text">{product.pendingNotice}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[4px] bg-teal" />
            <span className="text-[13px] font-semibold text-teal">
              Available to request — compounded per patient-specific prescription
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={addMain}
              className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-full border-none bg-brand font-sans text-body font-semibold text-white hover:bg-brand-hover"
            >
              Add to Request List
            </button>
            <Link
              href="/request/contact"
              className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded-full border border-line-strongest bg-white font-sans text-sm font-semibold text-navy no-underline hover:border-brand hover:text-brand"
            >
              Contact a representative
            </Link>
          </div>

          <p className="text-[15px] leading-6 text-ink-600">{product.blurb}</p>

          <div className="rounded-[10px] border border-warn-border bg-warn-bg px-3.5 py-3">
            <span className="text-[13px] font-semibold leading-5 text-warn-text">{compliance.productPanel}</span>
          </div>

          {/* Accordion — single-open, opens on Description */}
          <div className="flex flex-col border-b border-line-soft">
            {sections.map((s) => (
              <div key={s.id} className="flex flex-col border-t border-line-soft">
                <div
                  onClick={() => setAcc(acc === s.id ? null : s.id)}
                  className="flex cursor-pointer items-center justify-between gap-3.5 px-0.5 py-[15px]"
                >
                  <span className="text-body font-semibold text-navy">{s.title}</span>
                  {chev(acc === s.id)}
                </div>
                {acc === s.id && (
                  <>
                    <p className="mb-4 text-body-sm text-muted">{s.body}</p>
                    {s.href && (
                      <Link href={s.href} className="-mt-2 mb-4 text-[13px] font-semibold no-underline">
                        {s.linkLabel}
                      </Link>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Frequently requested together */}
          {pair && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[13px] font-semibold text-navy">Frequently requested together</span>
              <div className="flex items-center gap-3.5 rounded-[14px] border border-line px-3.5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(pair.image)}
                  alt={`${pair.name} sterile vial`}
                  className="h-14 w-14 shrink-0 rounded-[10px] border border-line bg-white object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Link
                    href={`/products/${pair.slug}`}
                    className="font-display text-[19px] leading-[1.1] text-navy no-underline hover:text-brand"
                  >
                    {pair.name}
                  </Link>
                  <span className="text-meta-sm text-muted-2">
                    {pair.program} · Sterile vial · {pair.presentations[0] ?? 'presentation pending'}
                  </span>
                </div>
                <button
                  onClick={() => add({ name: pair.name, program: pair.program, presentation: pair.defaultPresentation })}
                  className="h-[38px] cursor-pointer rounded-full border border-brand bg-white px-5 font-sans text-[13px] font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-5 pt-0.5">
            <span className="flex-1 text-meta-sm leading-[18px] text-muted">
              <strong className="text-navy">Sterile compounding</strong>
              <br />
              prepared per prescription
            </span>
            <span className="flex-1 text-meta-sm leading-[18px] text-muted">
              <strong className="text-navy">Patient-specific Rx</strong>
              <br />
              licensed providers only
            </span>
            <span className="flex-1 text-meta-sm leading-[18px] text-muted">
              <strong className="text-navy">Practice shipping</strong>
              <br />
              fulfilled to your practice
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer — compliance copy, verbatim */}
      <div className="mx-14 rounded-[10px] border border-line-panel bg-surface-alt px-5 py-4">
        <p className="text-[13px] leading-[21px] text-ink-500">{compliance.productDisclaimer}</p>
      </div>

      {/* You may also review */}
      <div className="flex flex-col gap-[22px] px-14 pb-[84px] pt-11">
        <h3 className="text-[34px] leading-none text-navy">You may also review</h3>
        <Reveal delay={140} className="grid grid-cols-4 gap-[22px]">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/products/${r.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-line no-underline transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-cardHover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(r.image)}
                alt={`${r.name} sterile vial`}
                className="h-40 w-full border-b border-line-soft bg-white object-cover"
              />
              <span className="flex flex-col gap-[5px] px-4 pb-4 pt-3.5">
                <span className="font-display text-[21px] leading-[1.1] text-navy">{r.name}</span>
                <span className="text-meta-sm text-muted">{r.program} · Sterile vial</span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>

      {/* Bar pinned to the bottom of the 1440px frame (README §6.6) */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-4 border-t border-line bg-white px-14 py-3 shadow-stickyBar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(product.image)}
          alt={`${product.name} sterile vial`}
          className="h-[46px] w-[46px] shrink-0 rounded-[10px] border border-line bg-white object-cover"
        />
        <span className="font-display text-[21px] text-navy">{product.name}</span>
        <span className="text-[13px] text-muted-2">{stickySpec}</span>
        <div className="flex-1" />
        <button
          onClick={addMain}
          className="inline-flex h-11 cursor-pointer items-center rounded-full border-none bg-brand px-6 font-sans text-[13px] font-semibold text-white hover:bg-brand-hover"
        >
          Add to Request List
        </button>
      </div>
    </div>
  );
}
