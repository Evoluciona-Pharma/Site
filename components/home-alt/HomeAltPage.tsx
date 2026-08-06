'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import { productBySlug, products, programs } from '@/lib/catalog';
import Reveal from '@/components/Reveal';
import { useRequestList } from '@/components/RequestListContext';
import CountUp from './CountUp';
import StickyRequestBar from './StickyRequestBar';

/** Art direction outstanding — striped stand-in with a caption saying what belongs there. */
const STRIPES = 'repeating-linear-gradient(115deg,#9BA6B6 0 14px,#8A96A9 14px 28px)';

/** Photography is matched to step meaning, not filename order. */
const STEPS = [
  {
    number: '01',
    image: 'assets/steps/step-01-verify.jpg',
    alt: 'Provider standing in a clinic wearing an identification badge',
    cadence: 'one-time',
    title: 'Verify your license',
    summary:
      'Verification of your license or NPI happens once. Browsing stays open to everyone — ordering unlocks after the pharmacy team clears your practice.',
    bullets: [
      'State license number or NPI for the prescribing provider',
      'DEA registration, where the formulation requires it',
      'Practice name and the shipping address orders go to',
      'Reviewed by the pharmacy team, not an automated check',
    ],
  },
  {
    number: '02',
    image: 'assets/steps/step-02-request-list.jpg',
    alt: 'Provider at a desk building a request list on a tablet',
    cadence: 'each order',
    title: 'Build a request list',
    summary:
      'Shop the catalog the way you would a store. The list carries into the request form — no pricing is shown anywhere online.',
    bullets: [
      'Add formulations from any product page or the catalog rail',
      'Choose the presentation per line where more than one exists',
      'Edit or remove items right up until you submit',
      'Intended quantity or patient count for each formulation',
    ],
  },
  {
    number: '03',
    image: 'assets/steps/step-03-representative.jpg',
    alt: 'Provider on the phone with a representative at a desk',
    cadence: 'each order',
    title: 'Consult a representative',
    summary:
      'A representative follows up on the request with program details and answers formulation questions before anything is prepared.',
    bullets: [
      'Program structure and pricing are shared directly, one to one',
      'Presentation or concentration questions answered by the pharmacy',
      'Any value still marked pending is confirmed before it is prepared',
      'A phone number and the best window to reach you',
    ],
  },
  {
    number: '04',
    image: 'assets/steps/step-04-compounded.jpg',
    alt: 'Gowned pharmacy technician inspecting sterile vials',
    cadence: 'each order',
    title: 'Prescribed and shipped',
    summary:
      'Each medication is compounded against a single prescription, labelled for that patient, and shipped to the practice that ordered it.',
    bullets: [
      'A valid patient-specific prescription for each named patient',
      'Compounding begins only after the prescription is received',
      'Labelled for the named patient, not for stock',
      'Shipped direct to the practice address on file',
    ],
  },
];

const SPEC_STRIP = [
  { label: 'Patient-specific', sub: 'Every preparation is compounded against a single prescription.' },
  { label: 'Compounded to order', sub: 'Nothing is dispensed from stock; each request is made to order.' },
  { label: 'Shipped to practice', sub: 'Released to the verified practice address on file.' },
  { label: 'Request, not checkout', sub: 'A representative follows up — no pricing is shown online.' },
];

export default function HomeAltPage({
  showRequestBar = true,
  showDisclaimer = true,
}: {
  showRequestBar?: boolean;
  showDisclaimer?: boolean;
}) {
  const { add } = useRequestList();
  const rail = useRef<HTMLDivElement>(null);

  // NAD+ is the flagship the page is built around.
  const hero = productBySlug('nad')!;
  const editorial = productBySlug('nad-glutathione') ?? hero;

  const addProduct = (slug: string) => {
    const p = productBySlug(slug);
    if (p) add({ name: p.name, program: p.program, presentation: p.defaultPresentation });
  };

  const scrollRail = (dir: 1 | -1) =>
    rail.current?.scrollBy({ left: dir * 640, behavior: 'smooth' });

  return (
    <div className="flex flex-col bg-white">
      {/* 2 · Hero */}
      <section className="flex flex-col items-center bg-[#E7EBF3] px-14 pb-16 pt-16 text-center">
        <span className="font-mono text-meta-xs uppercase tracking-[0.22em] text-brand">
          Flagship formulation
        </span>
        <h1 className="mt-5 text-[154px] leading-[0.9] tracking-[-0.02em] text-navy">{hero.name}</h1>
        <span className="mt-3 text-[17px] text-ink-600">{hero.program}</span>

        {/* The rise animation makes this a stacking context, so the field colour has
            to be repeated here or multiply has no backdrop and a white box shows. */}
        <div className="hero-rise relative mt-8 flex h-[470px] w-full items-end justify-center bg-[#E7EBF3]">
          <div
            className="absolute bottom-1.5 left-1/2 h-[180px] w-[640px] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(20,37,63,0.16) 0%, rgba(20,37,63,0) 70%)',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(hero.image)}
            alt={`${hero.name} sterile vial`}
            className="relative z-[1] h-[470px] object-contain mix-blend-multiply"
          />
        </div>

        <span className="mt-8 text-[15px] text-ink-600">
          Sterile compounded vial · 5 mL and 10 mL · 100 mg/mL
        </span>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => addProduct(hero.slug)}
            className="inline-flex h-14 cursor-pointer items-center rounded-full border-none bg-brand px-8 font-sans text-[15px] font-semibold text-white hover:bg-brand-hover"
          >
            Add to Request List
          </button>
          <Link
            href={`/products/${hero.slug}`}
            className="inline-flex h-14 items-center rounded-full border border-line-strongest bg-transparent px-8 font-sans text-[15px] font-semibold text-navy no-underline hover:border-brand hover:text-brand"
          >
            View formulation →
          </Link>
        </div>

        <span className="mt-5 text-[13px] text-[#7A8494]">
          No pricing online · licensed providers only · dispensed against a patient-specific prescription
        </span>
      </section>

      {/* 3 · Spec strip */}
      <Reveal as="section" className="grid grid-cols-4 bg-white px-14 py-14">
        {SPEC_STRIP.map((s, i) => (
          <div
            key={s.label}
            className={i > 0 ? 'border-l border-line pl-8' : 'pr-8'}
          >
            <span className="block font-display text-[26px] leading-tight text-navy">{s.label}</span>
            <span className="mt-2 block text-[13.5px] leading-[21px] text-muted">{s.sub}</span>
          </div>
        ))}
      </Reveal>

      {/* 4 · Catalog rail — navy stays as the one darker band, for depth */}
      <Reveal as="section" className="bg-navy py-16">
        <div className="flex items-end justify-between gap-8 px-14 pb-9">
          <h2 className="text-[52px] leading-[1.05] text-white">
            Eight formulations.
            <br />
            <em className="text-[#9DAAC4]">Six clinical programs.</em>
          </h2>
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              onClick={() => scrollRail(-1)}
              aria-label="Previous formulations"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#3A4C6B] bg-transparent text-white transition-colors hover:border-white"
            >
              ‹
            </button>
            <button
              onClick={() => scrollRail(1)}
              aria-label="More formulations"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#3A4C6B] bg-transparent text-white transition-colors hover:border-white"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={rail} className="no-scrollbar flex gap-5 overflow-x-auto px-14 pb-2">
          {products.map((p) => (
            <div
              key={p.slug}
              className="group relative flex w-[300px] flex-[0_0_auto] flex-col overflow-hidden rounded-2xl border border-[#24354F] transition-all duration-[250ms] hover:-translate-y-1 hover:border-[#4C6291]"
            >
              <div className="h-[246px] overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(p.image)}
                  alt={`${p.name} sterile vial`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-reveal group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="font-mono text-2xs uppercase tracking-[0.12em] text-[#93A0B7]">
                  {p.program}
                </span>
                <Link
                  href={`/products/${p.slug}`}
                  className="font-display text-[25px] leading-[1.05] text-white no-underline after:absolute after:inset-0 after:content-[''] hover:text-white"
                >
                  {p.name}
                </Link>
                <span className="flex-1 text-[13px] leading-[19px] text-[#9DAAC4]">{p.spec}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addProduct(p.slug);
                  }}
                  className="relative z-10 mt-2 h-11 w-full cursor-pointer rounded-full border border-[#4C6291] bg-transparent font-sans text-[13px] font-semibold text-white transition-colors hover:bg-white hover:text-navy"
                >
                  Add to Request List
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-14 pt-9">
          <Link href="/shop" className="text-sm font-semibold text-white no-underline hover:text-white">
            Shop all formulations →
          </Link>
        </div>
      </Reveal>

      {/* 5 · Full-bleed feature */}
      <Reveal as="section" className="relative h-[680px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: STRIPES }} />
        <span className="ph-caption absolute bottom-6 right-6">
          cleanroom / compounding bench — pending art direction
        </span>
        <div className="absolute left-14 top-20 flex w-[660px] flex-col items-start gap-5 [text-shadow:0_2px_24px_rgba(10,20,38,0.32)]">
          <span className="font-mono text-meta-xs uppercase tracking-[0.22em] text-white">
            Inside the pharmacy
          </span>
          <h2 className="text-[62px] leading-[1.02] text-white">
            Compounded to order, <em>prescription by prescription.</em>
          </h2>
          <p className="w-[520px] text-body-lg text-white">
            Each preparation is made against a single patient-specific prescription — never batched
            for stock, never dispensed without a verified prescriber on file. Presentations and
            concentrations are documented exactly as the pharmacy confirms them.
          </p>
          <Link href="/faq" className="text-sm font-semibold text-white underline hover:text-white">
            Read the provider FAQ →
          </Link>
        </div>
      </Reveal>

      {/* 6 · How ordering works — photography carries the section */}
      <Reveal as="section" className="flex flex-col gap-11 bg-brand px-14 pb-24 pt-[88px]">
        <div className="flex items-end justify-between gap-12">
          <div className="flex max-w-[620px] flex-col gap-4">
            <span className="font-mono text-meta-xs uppercase tracking-[0.22em] text-[#A9B6E8]">
              How ordering works
            </span>
            <h2 className="text-[60px] leading-none text-white">
              Four steps from
              <br />
              <em className="text-[#A9B6E8]">verification to delivery.</em>
            </h2>
            <p className="text-base leading-[26px] text-[#C5CEF0]">
              Verification happens once. Everything after it repeats per order, and every stage is
              reviewed by a person before anything is compounded.
            </p>
          </div>
          <Link
            href="/request/contact"
            className="inline-flex h-[52px] shrink-0 items-center rounded-full bg-white px-[30px] font-sans text-[15px] font-semibold text-brand no-underline hover:bg-[#E6EAFA] hover:text-brand"
          >
            Start verification
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-11 gap-y-[52px]">
          {STEPS.map((s) => (
            <div key={s.number} className="flex flex-col gap-5">
              <div className="relative h-[340px] overflow-hidden rounded-[18px] bg-[#1B2F4E]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(s.image)} alt={s.alt} className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-full bg-white font-display text-[30px] text-brand shadow-[0_8px_22px_rgba(10,20,38,0.28)]">
                  {s.number}
                </span>
                <span className="absolute bottom-[18px] right-[18px] rounded-full bg-[rgba(255,255,255,0.92)] px-[11px] py-[5px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-navy">
                  {s.cadence}
                </span>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.24)]">
                <h3 className="mt-4 text-[34px] leading-tight text-white">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[25px] text-[#C5CEF0]">{s.summary}</p>
                <ul className="mt-4 flex list-none flex-col gap-[9px] p-0">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-[1px] bg-[#A9B6E8]" />
                      <span className="text-[14.5px] leading-[23px] text-[#C5CEF0]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 7 · Editorial */}
      <Reveal
        as="section"
        className="grid grid-cols-[520px_1fr] items-start gap-16 bg-white px-14 py-20"
      >
        <div className="flex h-[520px] items-center justify-center rounded-[20px] bg-[#F1F3F8] p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(editorial.image)}
            alt={`${editorial.name} sterile vial`}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <div className="flex flex-col gap-5 pt-2">
          <span className="font-mono text-meta-xs uppercase tracking-[0.22em] text-brand">
            Why providers order here
          </span>
          <h2 className="text-[52px] leading-[1.05] text-navy">A pharmacy that answers the phone.</h2>
          <p className="text-[16.5px] leading-7 text-ink-600">
            Every request is read by the pharmacy team before anything is prepared. A representative
            confirms the formulation, the presentation, and the prescriber on file — so questions are
            answered by the people who compound the preparation, not a queue.
          </p>
          <p className="text-[16.5px] leading-7 text-ink-600">
            That is also why there is no checkout button. Ordering is gated on license verification
            and a patient-specific prescription, so the list you build here starts a conversation
            rather than a transaction. No pricing appears online at any point.
          </p>
          <div className="mt-4 flex gap-12">
            <div className="flex flex-col gap-1">
              <CountUp value={products.length} className="font-display text-[46px] leading-none text-navy" />
              <span className="text-[13px] text-muted">Formulations</span>
            </div>
            <div className="flex flex-col gap-1">
              <CountUp value={programs.length} className="font-display text-[46px] leading-none text-navy" />
              <span className="text-[13px] text-muted">Clinical programs</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display text-[46px] leading-none text-navy">1:1</span>
              <span className="text-[13px] text-muted">Representative support</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 8 · Program grid */}
      <Reveal as="section" className="bg-surface-alt px-14 py-16">
        <div className="grid grid-cols-3 gap-5">
          {programs.map((g) => (
            <Link
              key={g.slug}
              href={`/shop?program=${g.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 no-underline transition-all duration-[250ms] hover:-translate-y-[3px] hover:border-line-strongest hover:shadow-programHover"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(g.cardImage)}
                alt={`${g.label} formulations`}
                className="h-[72px] w-[72px] shrink-0 rounded-xl border border-line bg-white object-cover"
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
        </div>
      </Reveal>

      {/* 9 · Closing CTA */}
      <Reveal as="section" className="flex flex-col items-center gap-8 bg-navy px-14 py-24 text-center">
        <h2 className="max-w-[900px] text-[64px] leading-[1.02] text-white">
          Bring compounded formulations to your practice.
        </h2>
        <Link
          href="/request/contact"
          className="inline-flex h-[52px] items-center rounded-full bg-white px-8 font-sans text-[15px] font-semibold text-navy no-underline hover:bg-[#DCE2EC] hover:text-navy"
        >
          Become a verified provider
        </Link>
      </Reveal>

      {/* 10 · Compliance wall */}
      {showDisclaimer && (
        <section className="flex flex-col gap-4 border-t border-line bg-white px-14 py-14">
          <span className="font-mono text-meta-xs uppercase tracking-[0.18em] text-muted-2">
            Important information for providers
          </span>
          <p className="max-w-[980px] text-[12.5px] leading-5 text-muted-2">
            This portal is intended for licensed healthcare providers only. Compounded preparations
            are not FDA-approved, are prepared by a compounding pharmacy, and are dispensed solely
            against a valid patient-specific prescription written by a licensed prescriber. Nothing
            on this page is an offer to sell, a promise of availability, or medical advice; clinical
            decisions remain the responsibility of the prescribing provider.
          </p>
          <p className="max-w-[980px] text-[12.5px] leading-5 text-muted-2">
            Presentations, concentrations, and availability are confirmed by the pharmacy at the time
            a request is reviewed. Values shown as pending confirmation are unconfirmed and must not
            be relied upon for clinical or ordering decisions. Submitting a request does not create
            an order — no preparation is compounded or shipped until the pharmacy confirms the
            request and license verification is complete.
          </p>
          <span className="mt-1 self-start rounded-md border border-warn-border bg-warn-bg px-3 py-2 font-mono text-meta-xs text-warn-text">
            disclaimer copy is placeholder — pending regulatory / legal review
          </span>
        </section>
      )}

      {showRequestBar && <StickyRequestBar product={hero} onAdd={() => addProduct(hero.slug)} />}
    </div>
  );
}
