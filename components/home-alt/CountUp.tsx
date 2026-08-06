'use client';

import { useEffect, useRef } from 'react';

/** Eases to `value` once 40% visible, once. Non-numeric stats render statically. */
export default function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const t0 = performance.now();
          const dur = 1100;
          const tick = (t: number) => {
            const k = Math.min(1, (t - t0) / dur);
            el.textContent = String(Math.round(value * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} data-count={value} className={className}>
      0
    </span>
  );
}
