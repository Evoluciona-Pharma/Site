import type { Config } from 'tailwindcss';

/**
 * Evoluciona Pharma — provider portal theme.
 * Every value is lifted verbatim from the HTML design references.
 * See README.md §3 for what each token is used for.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#14253F',
        brand: {
          DEFAULT: '#14258F',
          hover: '#0E1C6E',
          tint: '#EEF1FA',
          tintBorder: '#D6DCF2',
          tintHover: '#E2E8F8',
          deep: '#1B2C6B',
        },
        ink: {
          700: '#3C4757',
          600: '#4A5568',
          650: '#4A5563',
          500: '#5C6879',
        },
        // Contrast pass. The originals were #6B7380 / #8C93A0 / #9BA5B7,
        // scoring 4.46 / 2.88 / 2.31 against surface.alt — all below the
        // 4.5:1 AA floor for body text. Ratios are asserted in
        // tailwind.contrast.test.ts.
        //
        // NOTE FOR DESIGN: `muted` and `muted-2` now hold the same value. A
        // three-step grey scale cannot survive AA on light surfaces by
        // lightness alone — pulling muted-2 up to 4.5:1 lands it exactly where
        // muted already sat. The scale is effectively two tiers now (muted,
        // and the bluer muted-3). Re-differentiating muted-2 by hue or weight
        // rather than lightness is a one-line change here.
        muted: {
          DEFAULT: '#6A727F',
          2: '#6A727F',
          3: '#64728C',
        },
        line: {
          DEFAULT: '#E5E8ED',
          soft: '#EEF0F4',
          softer: '#EDF0F4',
          softest: '#F1F3F6',
          faint: '#EEF1F5',
          strong: '#D9DEE5',
          strongest: '#C9D0DA',
          panel: '#E1E5EB',
          card: '#DCE1E8',
          highlight: '#C7D0E8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F7FA',
          alt2: '#FAFBFC',
          form: '#F7F8FA',
        },
        canvas: '#EDEFF3',
        teal: {
          // Was #1B8B8A — 4.11:1 on white. `text-teal` only ever sits on white
          // (bg-teal-tint carries icons, not text), so white is the only
          // background this needs to clear.
          DEFAULT: '#1A8382',
          tint: '#E4F1F0',
          border: '#B6DEDD',
        },
        warn: {
          bg: '#FFFAEF',
          border: '#EADCB5',
          text: '#8A6410',
        },
        danger: {
          DEFAULT: '#A81E2F',
          bg: '#FCF2F3',
          field: '#FFFBFB',
          border: '#EBC4C9',
          text: '#8E1927',
        },
        footer: {
          line: '#24354F',
          chip: '#2C3E5C',
          text: '#8E9AB0',
          // Were #5E6B83 / #6B7890 — 2.86:1 and 3.45:1 on navy. `legal` carries
          // the reviewed compliance copy, so it was the least readable text on
          // the page that most needs reading.
          label: '#7F8CA3',
          legal: '#808CA1',
          input: '#1D3050',
        },
        onDark: '#D5DBE5',
        placeholder: {
          a: '#EDF0F4',
          b: '#E2E7EE',
        },
      },
      fontFamily: {
        display: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-instrument-sans)', '-apple-system', 'sans-serif'],
        logo: ['var(--font-anek-latin)', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      fontSize: {
        // Non-integer sizes are intentional — do not round them.
        '2xs': ['10px', '1'],
        'meta-xs': ['11px', '1'],
        'meta': ['11.5px', '1'],
        'meta-sm': ['12.5px', '19px'],
        'body-sm': ['13.5px', '21px'],
        'body': ['15px', '23px'],
        'body-lg': ['16px', '26px'],
        'step': ['14.5px', '23px'],
      },
      boxShadow: {
        nav: '0 6px 18px rgba(20,37,63,0.06)',
        cardHover: '0 18px 36px rgba(20,37,63,0.12)',
        programHover: '0 14px 28px rgba(20,37,63,0.10)',
        faqOpen: '0 10px 26px rgba(20,37,63,0.07)',
        dropdown: '0 16px 40px rgba(20,37,63,0.14)',
        menu: '0 20px 48px rgba(20,37,63,0.16)',
        panel: '0 26px 60px rgba(20,37,63,0.18)',
        floating: '0 26px 60px rgba(20,37,63,0.16)',
        drawer: '-24px 0 60px rgba(20,37,63,0.25)',
        stickyBar: '0 -12px 32px rgba(20,37,63,0.10)',
        overlap: '0 -22px 48px rgba(20,37,63,0.16)',
        suggest: '0 8px 20px rgba(20,37,63,0.08)',
      },
      spacing: {
        frame: '1440px',
        gutter: '56px',   // page padding
        chrome: '40px',   // nav / footer padding
        rail: '264px',    // filter + topics sidebar
        summary: '380px', // request summary rail
        form: '1160px',
        card: '704px',
        drawer: '420px',
        navH: '112px',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        heroIn: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        progress: { from: { width: '0' }, to: { width: '140px' } },
        spin22: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease both',
        fadeIn: 'fadeIn 0.16s ease both',
        slideIn: 'slideIn 0.35s ease both',
        heroIn: 'heroIn 0.6s cubic-bezier(0.22,1,0.36,1) both',
        progress: 'progress 6s linear both',
        marquee: 'spin22 22s linear infinite',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.22,1,0.36,1)',
        fade: 'cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
