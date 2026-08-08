import { describe, expect, it } from 'vitest';
import config from './tailwind.config';

/** The colour tokens are the whole surface area for text contrast — a single
    hex edit here can drop the entire site below AA, and axe only catches it if
    someone happens to run a browser audit afterwards. */

const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string | Record<string, string>>;

function hex(path: string): string {
  const [group, key] = path.split('.');
  const entry = colors[group];
  const value = typeof entry === 'string' ? entry : entry?.[key ?? 'DEFAULT'];
  if (typeof value !== 'string') throw new Error(`token not found: ${path}`);
  return value;
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const WHITE = '#FFFFFF';
const ALT = hex('surface.alt');
const ALT2 = hex('surface.alt2');
const FORM = hex('surface.form');
const NAVY = hex('navy');
const LIGHT_SURFACES = [WHITE, ALT, ALT2, FORM];

/** [token, backgrounds it is rendered on] */
const BODY_TEXT: [string, string[]][] = [
  ['muted.DEFAULT', LIGHT_SURFACES],
  ['muted.2', LIGHT_SURFACES],
  ['muted.3', LIGHT_SURFACES],
  ['ink.700', LIGHT_SURFACES],
  ['ink.600', LIGHT_SURFACES],
  ['ink.650', LIGHT_SURFACES],
  ['ink.500', LIGHT_SURFACES],
  ['navy', LIGHT_SURFACES],
  ['brand.DEFAULT', [WHITE, hex('brand.tint')]],
  ['danger.DEFAULT', [WHITE, hex('danger.field')]],
  ['danger.text', [hex('danger.bg')]],
  ['warn.text', [hex('warn.bg')]],
  // text-teal is only ever rendered on white — bg-teal-tint carries icons.
  ['teal.DEFAULT', [WHITE]],
  ['footer.text', [NAVY]],
  ['footer.label', [NAVY]],
  ['footer.legal', [NAVY]],
  ['onDark', [NAVY]],
];

describe('colour tokens meet WCAG AA for body text (4.5:1)', () => {
  it.each(BODY_TEXT)('%s', (token, backgrounds) => {
    for (const bg of backgrounds) {
      expect(
        contrast(hex(token), bg),
        `${token} (${hex(token)}) on ${bg}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('the contrast helper itself', () => {
  it('matches the known reference ratios', () => {
    expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    // The pre-fix value that started this phase.
    expect(contrast('#8C93A0', '#FFFFFF')).toBeCloseTo(3.08, 1);
  });
});
