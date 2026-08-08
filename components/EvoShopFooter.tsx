'use client';

import Link from 'next/link';
import { asset } from '@/lib/asset';
import { compliance } from '@/lib/catalog';

const colHeading = 'font-sans text-xs font-semibold tracking-[0.1em] text-footer-label';
const colLink = 'font-sans text-sm text-onDark no-underline hover:text-white';

function InertLink({ children }: { children: React.ReactNode }) {
  // Destination not delivered yet (README §10) — deliberately inert.
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={colLink}>
      {children}
    </a>
  );
}

export default function EvoShopFooter() {
  return (
    <footer className="flex shrink-0 flex-col gap-9 bg-navy px-4 pb-[30px] pt-[52px] sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 border-b border-footer-line pb-9 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <span className="max-w-[520px] font-display text-[24px] leading-[1.15] text-white [text-wrap:pretty] lg:text-[30px]">
          Formulation availability &amp; program news, straight to your practice.
        </span>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <input
            type="email"
            placeholder="Work email"
            aria-label="Work email"
            className="flex h-12 w-full max-w-[320px] items-center rounded-full border border-footer-chip bg-footer-input px-[18px] font-sans text-sm text-onDark outline-none placeholder:text-footer-text focus:border-white focus:ring-1 focus:ring-white lg:w-[320px]"
          />
          <button className="h-12 cursor-pointer rounded-full border-none bg-white px-[26px] font-sans text-sm font-semibold text-navy hover:bg-[#DCE2EC]">
            Subscribe
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex max-w-[300px] flex-col gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('assets/brand/evoluciona-logo-white.svg')} alt="Evoluciona Pharma" className="block h-[34px] w-auto shrink-0 self-start" />
          <p className="font-sans text-[13px] leading-5 text-footer-text">{compliance.footerBlurb}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full border border-footer-chip px-[11px] py-[5px] font-sans text-meta-xs font-medium text-onDark">
              Sterile compounding
            </span>
            <span className="rounded-full border border-footer-chip px-[11px] py-[5px] font-sans text-meta-xs font-medium text-onDark">
              Patient-specific Rx only
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:flex lg:gap-16">
          <div className="flex flex-col gap-3">
            <span className={colHeading}>SHOP</span>
            <Link href="/shop" className={colLink}>All formulations</Link>
            <Link href="/shop?program=longevity-cellular-health" className={colLink}>Longevity &amp; Cellular Health</Link>
            <Link href="/shop?program=recovery-regenerative" className={colLink}>Recovery &amp; Regenerative</Link>
            <Link href="/shop" className={colLink}>All programs</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className={colHeading}>SUPPORT</span>
            <Link href="/faq" className={colLink}>Provider FAQ</Link>
            <Link href="/request/contact" className={colLink}>Contact a representative</Link>
            <Link href="/request/contact" className={colLink}>Provider verification</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className={colHeading}>COMPANY</span>
            <InertLink>About</InertLink>
            <Link href="/request/contact" className={colLink}>Contact</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className={colHeading}>LEGAL</span>
            <InertLink>Privacy Policy</InertLink>
            <InertLink>Terms of Use</InertLink>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-footer-line pt-5 lg:flex-row lg:justify-between lg:gap-6">
        <span className="max-w-[820px] font-sans text-xs leading-[18px] text-footer-legal">
          {compliance.footerLegal}
        </span>
        <span className="whitespace-nowrap font-sans text-xs text-footer-legal">{compliance.copyright}</span>
      </div>
    </footer>
  );
}
