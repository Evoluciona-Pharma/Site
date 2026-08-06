'use client';

import Link from 'next/link';
import { useState } from 'react';
import { compliance, FaqTopic, faqTopics } from '@/lib/catalog';

export default function FaqPage({ topic }: { topic: FaqTopic }) {
  // The first question of each topic opens on arrival (README §6.7).
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <div className="relative h-[372px] shrink-0 overflow-hidden">
        <div className="ph-stripe absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(20,37,63,0.88) 0%, rgba(20,37,63,0.66) 58%, rgba(20,37,63,0.34) 100%)',
          }}
        />
        <span className="absolute bottom-4 right-5 z-[2] rounded-[4px] bg-[rgba(255,255,255,0.9)] px-2 py-[3px] font-mono text-2xs text-footer-label">
          hero · faq · awaiting art direction
        </span>
        <div className="absolute inset-0 z-[1] flex animate-[fadeUp_0.7s_ease_both] flex-col justify-center gap-4 px-4 sm:px-8 lg:px-14">
          <span className="text-[13px] text-[rgba(255,255,255,0.72)]">
            <Link href="/" className="text-[rgba(255,255,255,0.72)] no-underline hover:text-white">
              Home
            </Link>{' '}
            / <span className="font-medium text-white">Frequently Asked Questions</span>
          </span>
          <h1 className="text-[38px] leading-[0.98] text-white lg:text-[64px]">Frequently Asked Questions</h1>
          <p className="max-w-[530px] text-body text-[rgba(255,255,255,0.85)]">
            Got questions? We&apos;ve got answers — ordering, shipping, billing and account handling for
            verified providers.
          </p>
        </div>
      </div>

      {/* Licensed-providers notice */}
      <div className="px-4 pt-7 sm:px-8 lg:px-14">
        <div className="flex gap-3 rounded-xl border border-brand-tintBorder bg-brand-tint px-[18px] py-4">
          <span className="text-sm leading-[22px] text-brand-deep">
            <strong>This portal is for licensed providers.</strong> Patients should contact their prescribing
            provider. Ordering requires verification and a patient-specific prescription.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-11 px-4 pb-[76px] pt-9 sm:px-8 lg:grid-cols-[264px_1fr] lg:px-14">
        {/* Topics sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-[132px]">
          <span className="font-display text-2xl text-navy">Topics</span>
          <div className="flex flex-col gap-1 border-t border-line pt-3.5">
            {faqTopics.map((t) => (
              <Link
                key={t.slug}
                href={`/faq/${t.slug}`}
                scroll={false}
                className={`flex cursor-pointer items-center gap-3 rounded-[9px] px-3 py-2.5 no-underline transition-colors duration-150 ${
                  t.slug === topic.slug
                    ? 'bg-brand-tint font-semibold text-brand hover:text-brand'
                    : 'font-medium text-ink-700 hover:bg-surface-alt hover:text-ink-700'
                }`}
              >
                <span className="flex-1 text-sm leading-5">{t.label}</span>
                <span className="text-xs text-muted-3">{t.questions.length}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-[14px] border border-line-panel bg-surface-alt2 p-[18px]">
            <span className="text-[13px] font-semibold text-navy">Provider support</span>
            <span className="text-[13px] leading-5 text-muted">
              Mon–Fri, 8:00–18:00 ET for verification, order and formulation questions.
            </span>
            <Link href="/request/contact" className="text-[13px] font-semibold text-brand no-underline">
              Contact support →
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <h2 className="text-[28px] leading-[1.06] text-navy lg:text-[38px]">{topic.label}</h2>
            <p className="max-w-[660px] text-body text-muted">{topic.lede}</p>
          </div>

          {/* Question cards — single-open accordion */}
          <div className="flex flex-col gap-2.5">
            {topic.questions.map((q, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={q.q}
                  className={`flex flex-col rounded-xl bg-white transition-[border-color,box-shadow] duration-200 ${
                    isOpen ? 'border border-line-strongest shadow-faqOpen' : 'border border-line'
                  }`}
                >
                  <div
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex cursor-pointer items-start justify-between gap-5 px-[22px] py-[18px]"
                  >
                    <span className="flex-1 text-base font-semibold leading-6 text-navy">{q.q}</span>
                    <span className="shrink-0 font-display text-[22px] leading-6 text-muted-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                  {isOpen && (
                    <div className="flex animate-[fadeIn_0.25s_ease_both] flex-col gap-3.5 border-t border-line-softer px-[22px] pb-[22px] pt-[18px]">
                      {q.blocks.map((b, bi) => {
                        if (b.type === 'h') {
                          return (
                            <span key={bi} className="text-sm font-semibold text-navy">
                              {b.text}
                            </span>
                          );
                        }
                        if (b.type === 'p') {
                          return (
                            <span key={bi} className="max-w-[680px] text-sm leading-[23px] text-ink-650">
                              {b.text}
                            </span>
                          );
                        }
                        return (
                          <div key={bi} className="flex flex-col gap-[9px]">
                            {b.items.map((it) => (
                              <div key={it} className="flex gap-[11px]">
                                <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-[3px] bg-muted-3" />
                                <span className="max-w-[660px] flex-1 text-sm leading-[23px] text-ink-650">{it}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ship-blocking annotation — copy pending content-owner sign-off (README §10) */}
          <span className="self-start rounded-md border border-warn-border bg-warn-bg px-3 py-2 font-mono text-xs leading-[19px] text-warn-text">
            answer copy is structural — timelines and policy wording pending sign-off from the content owner
          </span>

          {/* Still need a hand? */}
          <div className="mt-1.5 flex flex-col items-start gap-5 rounded-2xl border border-line-panel bg-surface-alt2 p-6 sm:flex-row sm:items-center">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[26px] bg-brand-tint">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14258F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M 18 8 C 18 12.418 13.971 16 9 16 M 9 0 C 13.971 0 18 3.582 18 8 M 0 8 C 0 3.582 4.029 0 9 0 M 1.395 12.28 C 0.512 11.042 0 9.574 0 8 M 0 16 L 1.395 12.28 M 4.745 15.051 L 0 16 M 9 16 C 7.461 16 6.012 15.657 4.745 15.051 Z"
                  transform="translate(3 4)"
                />
              </svg>
            </div>
            <div className="flex flex-1 flex-col gap-[5px]">
              <span className="font-display text-[22px] text-navy">Still need a hand?</span>
              <span className="text-sm leading-[21px] text-muted">
                Providers can reach support directly; patients can contact the Evoluciona Pharma AI assistant
                for general assistance.
              </span>
            </div>
            {/* "Open assistant" has no behavior wired yet (README §10) */}
            <button className="h-[46px] shrink-0 cursor-pointer rounded-full border border-brand bg-white px-[22px] font-sans text-sm font-semibold text-brand hover:bg-brand-tint">
              Open assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
