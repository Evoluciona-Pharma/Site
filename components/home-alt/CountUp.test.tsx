import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import CountUp from './CountUp';

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let ioCallback: IOCallback | null = null;
let observed: Element[] = [];

function stubMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

beforeEach(() => {
  ioCallback = null;
  observed = [];
  stubMatchMedia(false);

  class MockIntersectionObserver {
    constructor(cb: IOCallback) {
      ioCallback = cb;
    }
    observe(el: Element) {
      observed.push(el);
    }
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

  // Drive requestAnimationFrame off the fake-timer clock so the 1100ms ease can be stepped.
  vi.useFakeTimers();
  let now = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
    setTimeout(() => {
      now += 100;
      cb(now);
    }, 100),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('CountUp', () => {
  it('renders 0 initially and exposes the target via data-count', () => {
    const { container } = render(<CountUp value={250} />);
    const span = container.querySelector('span');
    expect(span).toHaveTextContent('0');
    expect(span).toHaveAttribute('data-count', '250');
  });

  it('passes className through', () => {
    const { container } = render(<CountUp value={10} className="text-white" />);
    expect(container.querySelector('span')).toHaveClass('text-white');
  });

  it('observes the element and stays at 0 until it intersects', () => {
    const { container } = render(<CountUp value={99} />);
    const span = container.querySelector('span')!;
    expect(observed).toContain(span);
    vi.advanceTimersByTime(2000);
    expect(span).toHaveTextContent('0');
  });

  it('counts up to the target value once visible', async () => {
    const { container } = render(<CountUp value={250} />);
    const span = container.querySelector('span')!;

    ioCallback!([{ isIntersecting: true, target: span }]);
    // 100ms per frame; the ease runs 1100ms, so 15 frames comfortably finishes it.
    vi.advanceTimersByTime(1500);

    expect(span.textContent).toBe('250');
  });

  it('renders the final value immediately when prefers-reduced-motion is set', () => {
    stubMatchMedia(true);
    const { container } = render(<CountUp value={40} />);
    expect(container.querySelector('span')).toHaveTextContent('40');
  });
});
