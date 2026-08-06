'use client';

import { useEffect, useRef } from 'react';
import { homeStats } from '@/lib/catalog';
import Reveal from '@/components/Reveal';

/** Navy stat band. The numeric stats count up from 0 over 1100ms with
    1-(1-k)³ easing when 40% visible, once (README §6.4). */
export default function StatBand() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const target = parseFloat(el.getAttribute('data-count') ?? '0');
          const t0 = performance.now();
          const dur = 1100;
          const step = (t: number) => {
            const k = Math.min(1, (t - t0) / dur);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Reveal>
      <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-8 bg-navy px-6 py-9 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-14 lg:py-11">
        {homeStats.map((stat, i) => (
          <span key={stat.label} className="contents">
            {i > 0 && <div className="hidden h-[52px] w-px bg-footer-line lg:block" />}
            <div className="flex flex-col gap-1">
              <span
                data-count={stat.countUp ? stat.value : undefined}
                className="font-display text-[36px] leading-none text-white lg:text-[46px]"
              >
                {stat.value}
              </span>
              <span className="text-[13px] text-footer-text">{stat.label}</span>
            </div>
          </span>
        ))}
      </div>
    </Reveal>
  );
}
