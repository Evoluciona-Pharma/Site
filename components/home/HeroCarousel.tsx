'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { homeHeroSlides } from '@/lib/catalog';

/** Per-slide art direction. Slides 1–2 have delivered media; slide 3 is still a
    striped stand-in with its caption (README §10). */
type SlideArt =
  | { kind: 'video'; src: string; poster: string }
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'placeholder'; bg: string; panelWidth: number; panelBg: string; detail: string };

const SLIDE_ART: SlideArt[] = [
  { kind: 'video', src: 'assets/hero-video.mp4', poster: 'assets/hero-video-poster.jpg' },
  {
    kind: 'image',
    src: 'assets/hero-clinic.jpg',
    alt: 'Provider reviewing a treatment plan with a patient in a clinic',
  },
  {
    kind: 'placeholder',
    bg: 'repeating-linear-gradient(155deg,#93A0B4 0 14px,#82909F 14px 28px)',
    panelWidth: 340,
    panelBg: 'repeating-linear-gradient(45deg,#32425E 0 14px,#26344C 14px 28px)',
    detail: 'vial detail',
  },
];

/** Real footage needs a floor for the white type. Weighted to the left, where
    the headline sits. */
const MEDIA_SCRIM =
  'linear-gradient(90deg, rgba(20,37,63,0.74) 0%, rgba(20,37,63,0.54) 46%, rgba(20,37,63,0.22) 100%)';

const N = homeHeroSlides.length;

export default function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Only decode while its slide is showing, and never autoplay under
  // prefers-reduced-motion — the poster frame stands in.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (slide === 0 && !reduced) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [slide]);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((s) => (s + 1) % N), 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  // Arrows reset the 4000ms auto-advance timer (README §6.4).
  const go = (n: number) => {
    setSlide((n + N) % N);
    startTimer();
  };

  return (
    <div className="sticky top-navH h-[720px] overflow-hidden bg-[#8894AC] [animation:fadeUp_0.8s_ease_0.05s_both]">
      {homeHeroSlides.map((s, i) => {
        const art = SLIDE_ART[i];
        return (
          <div
            key={s.headline}
            className="absolute inset-0"
            style={{
              opacity: slide === i ? 1 : 0,
              transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: slide === i ? 'auto' : 'none',
            }}
          >
            {art.kind === 'placeholder' ? (
              <>
                <div className="absolute inset-0" style={{ background: art.bg }} />
                <div
                  className="absolute bottom-0 left-0 top-0"
                  style={{ width: art.panelWidth, background: art.panelBg }}
                />
                <span className="ph-caption absolute bottom-12 left-6">{s.placeholder}</span>
                <span className="ph-caption absolute right-6 top-[110px]">{art.detail}</span>
              </>
            ) : (
              <>
                {art.kind === 'video' ? (
                  <video
                    ref={video}
                    className="absolute inset-0 h-full w-full object-cover"
                    poster={asset(art.poster)}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  >
                    <source src={asset(art.src)} type="video/mp4" />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(art.src)}
                    alt={art.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0" style={{ background: MEDIA_SCRIM }} />
              </>
            )}
            <div className="absolute left-0 right-0 top-[200px] flex flex-col items-start gap-6 pl-14">
              <div className="flex w-[820px] flex-col gap-3.5 [text-shadow:0_2px_24px_rgba(10,20,38,0.3)]">
                {/* Departs from the Instrument Serif 400 heading rule: the brief
                    asked for weight here, and Serif ships only at 400. */}
                <h2 className="font-sans text-[82px] font-bold leading-[0.98] tracking-[-0.025em] text-white">
                  {s.headline} <em>{s.headlineEm}</em>
                </h2>
              </div>
              <div className="flex w-[820px] items-center gap-4">
                <Link
                  href={s.ctaHref}
                  className="inline-flex h-[54px] items-center gap-3.5 rounded-full bg-white py-[5px] pl-[26px] pr-[5px] font-sans text-body font-semibold text-navy no-underline hover:bg-brand-tint hover:text-navy"
                >
                  {s.cta}
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[22px] bg-brand">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12 L19 12 M13 6 L19 12 L13 18" />
                    </svg>
                  </span>
                </Link>
                <span className="text-meta-sm text-[rgba(255,255,255,0.88)]">{s.caption}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-[52px] right-8 z-[4] flex items-center gap-4">
        <span className="text-[13px] font-medium tabular-nums text-white">
          {slide + 1}/{N}
        </span>
        <div className="h-0.5 w-[140px] overflow-hidden rounded-[1px] bg-[rgba(255,255,255,0.35)]">
          <div key={slide} className={`h-0.5 rounded-[1px] bg-white ${slide % 2 ? 'progress-b' : 'progress-a'}`} />
        </div>
        <span
          onClick={() => go(slide - 1)}
          className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[17px] border border-[rgba(255,255,255,0.5)] transition-all duration-200 hover:border-white hover:bg-[rgba(255,255,255,0.22)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6 L9 12 L15 18" />
          </svg>
        </span>
        <span
          onClick={() => go(slide + 1)}
          className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[17px] border border-[rgba(255,255,255,0.5)] transition-all duration-200 hover:border-white hover:bg-[rgba(255,255,255,0.22)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6 L15 12 L9 18" />
          </svg>
        </span>
      </div>
    </div>
  );
}
