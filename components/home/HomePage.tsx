'use client';

import Link from 'next/link';
import { asset } from '@/lib/asset';
import { orderingSteps, products, programs } from '@/lib/catalog';
import Reveal from '@/components/Reveal';
import { useRequestList } from '@/components/RequestListContext';
import HeroCarousel from './HeroCarousel';
import StatBand from './StatBand';

export default function HomePage() {
  const { add } = useRequestList();
  const featured = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <HeroCarousel />

      {/* Content sheet — lifts over the sticky hero (README §6.4) */}
      <div className="relative z-[2] -mt-8 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-overlap">
        {/* Featured formulations */}
        <Reveal className="flex flex-col gap-7 px-14 pb-[60px] pt-11">
          <div className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[40px] leading-none text-navy">Featured formulations</h3>
              <span className="text-sm text-muted">Sterile compounded vials, photographed as supplied.</span>
            </div>
            <Link href="/shop" className="text-sm font-semibold no-underline">
              Shop all →
            </Link>
          </div>
          <Reveal delay={140} className="grid grid-cols-4 gap-[22px]">
            {featured.map((p) => (
              <div
                key={p.slug}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-[250ms] hover:-translate-y-1 hover:border-line-strongest hover:shadow-cardHover"
              >
                <div className="group relative h-[220px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(p.image)}
                    alt={`${p.name} sterile vial`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand px-[11px] py-[5px] text-meta-xs font-semibold text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 px-[18px] pb-[18px] pt-4">
                  <Link
                    href={`/products/${p.slug}`}
                    className="font-display text-[25px] leading-[1.05] text-navy no-underline hover:text-brand"
                  >
                    {p.name}
                  </Link>
                  <span className="flex-1 text-[13px] leading-[19px] text-muted">{p.spec}</span>
                  <button
                    onClick={() => add({ name: p.name, program: p.program, presentation: p.defaultPresentation })}
                    className="mt-1.5 h-11 w-full cursor-pointer rounded-full border-none bg-brand font-sans text-[13px] font-semibold text-white hover:bg-brand-hover"
                  >
                    Add to Request List
                  </button>
                </div>
              </div>
            ))}
          </Reveal>
        </Reveal>

        {/* Find your formulation */}
        <Reveal className="flex flex-col gap-7 px-14 pb-[72px] pt-2">
          <div className="flex items-end justify-between gap-6">
            <h3 className="text-[40px] leading-none text-navy">Find your formulation</h3>
            <Link href="/shop" className="text-sm font-semibold no-underline">
              View all programs →
            </Link>
          </div>
          <Reveal delay={140} className="grid grid-cols-3 gap-5">
            {programs.map((g) => (
              <Link
                key={g.slug}
                href={`/shop?program=${g.slug}`}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-line bg-white p-4 no-underline transition-all duration-[250ms] hover:-translate-y-[3px] hover:border-line-strongest hover:shadow-programHover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(g.cardImage)}
                  alt={`${g.label} formulations`}
                  className="h-[76px] w-[76px] shrink-0 rounded-xl border border-line bg-white object-cover"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-display text-[21px] leading-[1.1] text-navy">{g.label}</span>
                  <span className="text-[13px] text-muted-2">{g.count} formulations</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14258F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M5 12 L19 12 M13 6 L19 12 L13 18" />
                </svg>
              </Link>
            ))}
          </Reveal>
        </Reveal>

        <StatBand />

        {/* How ordering works */}
        <Reveal className="flex flex-col gap-[60px] px-14 pb-[104px] pt-[88px]">
          <div className="flex flex-col items-center gap-3.5">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              How ordering works
            </span>
            <h3 className="text-center text-[54px] leading-[1.02] text-navy">From verification to your practice.</h3>
          </div>

          <div className="grid grid-cols-[1fr_1.02fr] items-start gap-[72px]">
            <Reveal delay={120} className="relative flex flex-col gap-[46px] pl-9 pt-1">
              <div
                className="absolute bottom-24 left-[5px] top-3 w-px"
                style={{ background: 'repeating-linear-gradient(to bottom,#B9C1CE 0 3px,rgba(0,0,0,0) 3px 8px)' }}
              />
              {orderingSteps.map((s) => (
                <div key={s.step} className="relative flex flex-col gap-[9px]">
                  <span className="absolute -left-9 top-1.5 h-[11px] w-[11px] rounded-full bg-brand" />
                  <span className="self-start whitespace-nowrap rounded-full bg-brand-tint px-3 py-[5px] text-xs font-semibold text-brand">
                    {s.step}
                  </span>
                  <h4 className="text-[30px] leading-[1.1] text-navy">{s.title}</h4>
                  <p className="max-w-[410px] text-step text-muted">{s.body}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={200} className="relative pb-[26px] pt-[30px]">
              <div
                className="relative mr-14 h-[588px] overflow-hidden rounded-[14px]"
                style={{ background: 'repeating-linear-gradient(135deg,#C6CEDB 0 14px,#BAC3D1 14px 28px)' }}
              >
                <span className="ph-caption absolute bottom-5 left-5">
                  clinic portrait — provider in practice · pending art direction
                </span>
              </div>
              <div className="absolute bottom-0 right-0 flex h-[336px] w-[296px] flex-col justify-end gap-3.5 rounded-[14px] border border-line bg-surface-alt p-[22px] shadow-floating">
                <div
                  className="flex-1 rounded-lg"
                  style={{ background: 'repeating-linear-gradient(135deg,#DDE2EA 0 12px,#D3D9E3 12px 24px)' }}
                />
                <span className="font-mono text-meta-xs text-muted">vial detail shot</span>
              </div>
              {/* Rotating textPath marquee around the ℞ glyph */}
              <div className="absolute right-[22px] top-0 z-[2] flex h-[142px] w-[142px] items-center justify-center rounded-full border border-[#D6DDEF] bg-brand-tint shadow-[0_16px_36px_rgba(20,37,63,0.14)]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-marquee">
                  <defs>
                    <path id="evoMarqueeRing" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
                  </defs>
                  <text fontFamily="var(--font-instrument-sans),sans-serif" fontSize="8" fontWeight="600" letterSpacing="1.35" fill="#14258F">
                    <textPath href="#evoMarqueeRing" startOffset="0">
                      VERIFIED PROVIDERS · PATIENT-SPECIFIC ·{' '}
                    </textPath>
                  </text>
                </svg>
                <span className="relative font-display text-[34px] leading-none text-navy">℞</span>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* Testimonial — placeholder pending compliance review (README §10) */}
        <Reveal className="flex flex-col items-center gap-[18px] bg-surface-alt px-14 py-[72px]">
          <span className="font-display text-[70px] leading-[0.5] text-line-strongest">&ldquo;</span>
          <p className="max-w-[860px] text-center font-display text-[31px] italic leading-[1.35] text-navy">
            Reserved for a verified provider quote about the request experience and program support.
          </p>
          <span className="text-sm text-muted-2">— Provider name · Practice, State</span>
          <span className="rounded-md border border-warn-border bg-warn-bg px-2.5 py-1.5 font-mono text-meta-xs text-warn-text">
            testimonial copy pending — compliance review
          </span>
        </Reveal>

        {/* CTA band */}
        <Reveal className="flex flex-col items-center gap-4 bg-brand-tint px-14 py-[72px]">
          <h3 className="text-center text-[42px] leading-[1.05] text-navy">
            Bring compounded formulations to your practice
          </h3>
          <span className="max-w-[560px] text-center text-[15px] leading-6 text-ink-500">
            Verification takes one form. Browsing is open — ordering is providers-only.
          </span>
          <Link
            href="/request/contact"
            className="inline-flex h-[52px] items-center rounded-full bg-brand px-8 font-sans text-body font-semibold text-white no-underline hover:bg-brand-hover hover:text-white"
          >
            Become a verified provider
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
