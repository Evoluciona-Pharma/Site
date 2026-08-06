'use client';

import { createElement, useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in ms (0/80/100/120/140/200 in the references). */
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
};

/** Scroll reveal per README §7: fade-up 26px over 700ms, IntersectionObserver at
    threshold 0.08 with -8% bottom rootMargin, unobserve after firing, plus the
    2s failsafe that force-reveals anything still hidden. */
export default function Reveal({ children, delay = 0, className = '', as = 'div', style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    const failsafe = window.setTimeout(() => setShown(true), 2000);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `${className} ${shown ? 'reveal-in' : 'reveal-init'}`.trim(),
      style: { ...style, transitionDelay: delay ? `${delay}ms` : undefined },
    },
    children,
  );
}
