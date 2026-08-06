# Handoff: Evoluciona Pharma — Provider Portal

**Target stack for implementation:** React + Next.js (App Router) + Tailwind CSS.
**Fidelity of these references:** **High-fidelity.** Recreate pixel-for-pixel.

---

## 1. Overview

A licensed-provider-only e-commerce-shaped portal for a sterile compounding pharmacy. Providers
browse a catalog of 8 compounded formulations across 6 clinical programs, build a **Request List**
(not a cart), and submit a 4-step request. **No pricing appears anywhere online** — a representative
follows up. Ordering is gated on license verification; browsing is open.

10 screens, 3 shared parts, one hash-based router. Desktop-only at a fixed 1440px design width.

## 2. About the design files — read this first

Everything in `design-reference/` is a **design reference built in HTML**, not production code.
They are prototypes that show intended look, copy, and behavior. They are authored in a
proprietary streaming-HTML component format (`.dc.html`: an inline-styled template plus a
`class Component extends DCLogic` logic class). **Do not port that format.** Do not try to make
`support.js` run in the Next.js app.

Your job: **recreate these screens in a Next.js + Tailwind app**, using this repo's own patterns,
component library, and conventions. The HTML is the spec for *what it looks like and how it
behaves*; the React/Tailwind implementation is yours.

Read `design-reference/*.dc.html` for exact values. The `<x-dc>` body is markup with inline styles
(styles map 1:1 to Tailwind arbitrary values). The `<script data-dc-script>` block at the bottom
holds state, data tables, and handlers — that logic is directly portable to React.

**Fastest way to see it working:** open `standalone/evoluciona-site-clean.html` in a browser.
No build, no server. Every interaction works: routing, filters, typeahead search, request drawer,
accordions, the 4-step form. Use it to answer any behavior question this README doesn't.

## 3. Design tokens

Put these in `tailwind.config.ts`. Ready-to-paste versions are in `tokens/`.

### Colors

| Token | Hex | Used for |
| --- | --- | --- |
| `navy` | `#14253F` | Headings, body dark text, footer bg, top compliance strip |
| `brand` | `#14258F` | Primary buttons, links, active states, badges |
| `brand-hover` | `#0E1C6E` | Primary button / link hover |
| `brand-tint` | `#EEF1FA` | Filled chips, icon circles, info panels, step pips |
| `brand-tint-border` | `#D6DCF2` | Border on `brand-tint` panels |
| `brand-tint-hover` | `#E2E8F8` | Hover on `brand-tint` chips |
| `ink-700` | `#3C4757` | Filter labels, secondary nav text |
| `ink-600` | `#4A5568` / `#4A5563` | Body paragraphs |
| `ink-500` | `#5C6879` | Legal / disclaimer body |
| `muted` | `#6B7380` | Supporting copy |
| `muted-2` | `#8C93A0` | Meta, eyebrows, breadcrumb |
| `muted-3` | `#9BA5B7` | Counts, placeholder text |
| `line` | `#E5E8ED` | Default border (cards, nav bottom, dividers) |
| `line-2` | `#EEF0F4` / `#EDF0F4` / `#F1F3F6` | Inner dividers, accordion rules |
| `line-strong` | `#D9DEE5` | Input borders, outline-button borders |
| `line-strongest` | `#C9D0DA` | Outline buttons, step connectors, hovered card border |
| `surface` | `#FFFFFF` | Page + card surface |
| `surface-alt` | `#F5F7FA` | Section bands, hovered rows |
| `surface-alt-2` | `#FAFBFC` | Sidebar boxes, empty states, search pills |
| `surface-form` | `#F7F8FA` | Request-form page background |
| `canvas` | `#EDEFF3` | Body background outside the 1440px frame |
| `teal` | `#1B8B8A` | "Sterile" badge, availability dot, completed step check |
| `teal-tint` | `#E4F1F0` | Completed step circle bg |
| `teal-border` | `#B6DEDD` | "Sterile" badge border |
| `warn-bg` | `#FFFAEF` | Compliance / pending notices |
| `warn-border` | `#EADCB5` | Compliance notice border |
| `warn-text` | `#8A6410` | Compliance notice text |
| `error` | `#A81E2F` | Required-field border, error text, destructive hover |
| `error-bg` | `#FCF2F3` / `#FFFBFB` | Error banner bg / errored input bg |
| `error-border` | `#EBC4C9` | Error banner border |
| `error-text` | `#8E1927` | Error banner text |
| `footer-line` | `#24354F` | Footer hairlines |
| `footer-chip-border` | `#2C3E5C` | Footer pill borders |
| `footer-text` | `#8E9AB0` | Footer body |
| `footer-label` | `#5E6B83` | Footer column headings |
| `footer-legal` | `#6B7890` | Footer legal line |
| `footer-input` | `#1D3050` | Footer newsletter field |
| `on-dark` | `#D5DBE5` | Footer links, compliance strip text |

### Typography

Google Fonts. Load via `next/font/google`.

- **Instrument Serif** (400, + italic) — all display headings, product names, card titles.
  Never bolded; weight stays 400.
- **Instrument Sans** (400/500/600/700) — all UI, body, labels, buttons.
- **Anek Latin** (500/600) — logotype only.
- **Fira Code** (400/500) — placeholder annotations and the reference number on confirmation.

Type scale actually used (px):

| Role | Size / line-height / family |
| --- | --- |
| Hero H2 (home carousel) | 82 / 1.02 / Serif 400, white, `text-shadow: 0 2px 24px rgba(10,20,38,.3)` |
| Page H1 (shop, faq hero) | 64 / 0.98 / Serif 400, white, `text-wrap: balance` |
| Product name | 58 / 0.98 / Serif 400 |
| Section H3 (home "From verification…") | 54 / 1.02 / Serif 400 |
| Confirmation H2 | 48 / 1.0 / Serif 400 |
| CTA band H3 | 42 / 1.05 / Serif 400 |
| Section H2/H3 | 40 / 1.0–1.05 / Serif 400 |
| FAQ topic H2 | 38 / 1.06 / Serif 400 |
| "You may also review" H3 | 34 / 1.0 / Serif 400 |
| Stat number | 46 / 1.0 / Serif 400 |
| Newsletter headline | 30 / 1.15 / Serif 400 |
| Timeline step H4 | 30 / 1.1 / Serif 400 |
| Shop card product name | 27 / 1.05 / Serif 400 |
| Form card title | 26 / — / Serif 400 |
| Drawer title | 26 / — / Serif 400 |
| Featured card name | 25 / 1.05 / Serif 400 |
| Sidebar "Filter"/"Topics" | 24 / — / Serif 400 |
| "Your request" panel title | 23 / — / Serif 400 |
| Program card name / support card | 21–22 / 1.1 / Serif 400 |
| Drawer + summary line item | 18–19 / 1.1 / Serif 400 |
| Body large | 16 / 26 / Sans 400 |
| Body | 15 / 23–25 / Sans 400 |
| FAQ question | 16 / 24 / Sans 600 |
| FAQ answer | 14 / 23 / Sans 400 |
| Nav link | 15 / — / Sans 500 |
| Button label | 13–15 / — / Sans 600 |
| Field label | 13 / — / Sans 600 |
| Field value | 15 / — / Sans 400 |
| Meta / spec | 12.5–13 / 19–21 / Sans 400 |
| Eyebrow | 12 / — / Sans 600, `letter-spacing: .1em–.15em`, uppercase |
| Badge / pill | 11–12 / — / Sans 600, `letter-spacing: .04em` |
| Compliance strip | 11 / — / Sans 500, `letter-spacing: .1em`, uppercase |

Non-integer sizes (`13.5`, `12.5`, `14.5`, `11.5`) are intentional — keep them.

### Radii

`5px` checkbox · `8–10px` small tiles, notice boxes, inputs · `12px` FAQ card, notices ·
`14px` support cards, pairing card · `16px` cards, form cards · `18–20px` product image, shop
card image · `20px` search dropdown · `28px 28px 0 0` home content overlap ·
`100px` (`rounded-full`) all buttons, chips, pills · `50%` circles.

### Shadows

```
nav:            0 6px 18px rgba(20,37,63,0.06)
card hover:     0 18px 36px rgba(20,37,63,0.12)
program hover:  0 14px 28px rgba(20,37,63,0.10)
faq open:       0 10px 26px rgba(20,37,63,0.07)
dropdown:       0 16px 40px rgba(20,37,63,0.14)
programs menu:  0 20px 48px rgba(20,37,63,0.16)
search panel:   0 26px 60px rgba(20,37,63,0.18)
floating card:  0 26px 60px rgba(20,37,63,0.16)
drawer:        -24px 0 60px rgba(20,37,63,0.25)
sticky bar:     0 -12px 32px rgba(20,37,63,0.10)
home overlap:   0 -22px 48px rgba(20,37,63,0.16)
```

### Layout constants

- Frame width **1440px**, centered; body background `canvas` outside it.
- Horizontal page padding **56px** (`px-14`). Nav and footer use **40px** (`px-10`).
- Sidebar layout: `grid-template-columns: 264px 1fr; gap: 44px`.
- Request form: content column **1160px**, `grid-template-columns: 1fr 380px; gap: 28px`.
  Steps 3 and 4 use a single centered **704px** card instead.
- Product detail: `grid-template-columns: 660px 1fr; gap: 52px`.
- Nav height: 36px strip + 76px bar = **112px**, `sticky top-0 z-30`.

## 4. Routing — the single most important contract

The prototype is one page with a hash router. **In Next.js, replace it with real routes.**

| Prototype hash | Next.js route |
| --- | --- |
| `#index` | `/` |
| `#shop` | `/shop` |
| `#shop\|cat=Recovery%20%26%20Regenerative` | `/shop?program=recovery-regenerative` |
| `#shop\|q=peptide` | `/shop?q=peptide` |
| `#shop\|cat=A,B&q=x` | `/shop?program=a,b&q=x` |
| `#shop-classic` | `/shop/classic` (legacy alt layout — confirm whether it ships) |
| `#product-nad\|p=BPC-157` | `/products/bpc-157` |
| `#faq` | `/faq` |
| `#faq\|faq=orders-shipping` | `/faq/orders-shipping` (or `?topic=`) |
| `#request-contact` → `-practice` → `-profile` → `-additional` | `/request/contact` → `/practice` → `/profile` → `/additional` |
| `#confirmation` | `/request/confirmation` |

Filter, search, and FAQ-topic state belong in **searchParams**, not component state — they must
survive refresh and be linkable, exactly as the hash fragment does today. Product identity belongs
in the **path**. Use `useRouter()` + `useSearchParams()`, `scroll: true` on route change and
`scroll: false` on filter changes (the prototype only scrolls to top when the *route* changes,
never on a filter toggle — preserve that).

`product-nad` is a single template that renders all 8 products from the hash. In Next.js it is
`app/products/[slug]/page.tsx`. The filename is a legacy artifact; do not carry it over.

## 5. Data

`data/catalog.json` in this bundle holds the real content: 8 formulations (name, slug, program,
presentations, concentration, tagline, blurb, description, "how it's supplied", pairing, badge),
6 programs with counts, presentation facets with counts, and the 6 FAQ topics with all 21 Q&As.
Wire the screens to that file (or seed your CMS/DB from it) — don't retype the copy.

Two values render as **"pending"** on purpose and must stay that way until the pharmacy confirms
them. Never substitute an estimate:

- `MOTS-C` — presentation conflicts between source documents.
- `Lipo-C` — concentration is mislabeled in the source data.

Compliance copy is exact and legally reviewed. Reproduce verbatim: the top strip, the amber
notices, the product-page disclaimer block, and the footer legal paragraph.

## 6. Screens

Full-page renders: `screenshots/full-*.png`. Interaction states: `screenshots/state-*.png`.

### 6.1 Shared — `EvoShopNav`
`design-reference/EvoShopNav.dc.html` · `state-overlay-*.png`

Two rows, `bg-white`, nav shadow, `sticky top-0 z-30`.

- **Strip** — h36, `bg-navy`, centered 11px/500/`.1em` uppercase `#D5DBE5`:
  "LICENSED PROVIDERS ONLY · PRODUCTS DISPENSED AGAINST PATIENT-SPECIFIC PRESCRIPTIONS".
- **Bar** — h76, `px-10`, `border-b line`, `justify-between`.
  - Logo `assets/brand/evoluciona-logo.png`, h30, links `/`.
  - Center nav, `gap-8`, 15/500 navy, hover `brand`: **Shop All** · **Programs ▾** · **About** · **Provider FAQ**.
  - Right cluster `gap-[18px]`: search · account · bag.
- **Programs dropdown** — 288w, centered under the trigger at `top-52px`, white, `line` border,
  `rounded-2xl`, `p-2`, programs menu shadow, `z-60`, fade-in 160ms. Rows 13.5/500 `#3C4757`,
  `rounded-[10px]`, `px-3 py-2.5`, hover `surface-alt` + `brand`, right-aligned count `#9BA5B7`.
  Footer row "All formulations →" 13/600 `brand`, `border-t #EEF1F5`. Chevron rotates 180° / 200ms.
- **Search** — 224×40 pill, `border line-strong`, hover `#9BA5B7`. Focus opens a **604px** panel,
  right-aligned at `top-50px`, `rounded-[20px]`, search-panel shadow, `z-70`.
  - "Popular search" (20px Serif) + 5 pills 34h, `border line`, `bg surface-alt-2`, hover
    `brand` border+text: NAD+ · Recovery · Longevity · Peptide · 5 mL.
  - Heading switches: `Featured formulations` (empty) → `Results` → `No matches`.
  - 3-col result grid. Card: 132h image `rounded-xl`, program badge top-left, then program label
    11.5 `muted-2` / name 14/600 navy / meta 12.5 `muted`, all `truncate`. Idle
    `bg surface-alt-2` + `border #EEF1F5`; highlighted `bg surface-alt` + `border #C7D0E8`.
  - Formulation hits → product page. Program hits → filtered shop, with a hamburger glyph on
    `brand-tint` instead of a photo. Max 5 formulations + 2 programs, capped at 6.
  - Ranking: name starts with the first token (0) → name contains it (1) → other field (2).
    Match is AND across whitespace tokens over name + program + presentation + a synonym list
    (see `terms` in the source, e.g. "nicotinamide", "thymosin", "bremelanotide").
  - Footer link: `Search the full catalog` → `/shop?q=…`, or `Browse all 8 formulations` → `/shop`.
  - Keyboard: ↓/↑ cycle with wraparound, Enter opens the highlighted result or submits the query,
    Escape closes. Outside `mousedown` closes. The × clears the input **and drops `q` from the URL**.
  - The box **mirrors the page's active query** (`query` prop). It defers the write while the input
    is focused and retries on blur — so typing is never clobbered mid-keystroke. Reimplement with a
    controlled input + `useEffect` on the searchParam, skipping the sync while `document.activeElement`
    is the input.
- **Bag** — 40×40, hover `brand-tint`. Count badge: min-w17 h17, `bg brand`, white 10/700,
  top-right. Opens the request drawer.
- **Account** — same 40×40 treatment, **no destination yet (intentionally inert)**.

### 6.2 Shared — `EvoShopFooter`
`design-reference/EvoShopFooter.dc.html`

`bg navy`, `pt-13 px-10 pb-7.5` (52/40/30), `gap-9`.
1. Newsletter row, `border-b footer-line`, `pb-9`: 30px Serif white headline (max-w 520) left;
   right a 320×48 `bg footer-input` pill "Work email" + white 48h "Subscribe" pill (hover `#DCE2EC`).
2. Brand column (max-w 300): white logo SVG h34, 13/20 `footer-text` paragraph, two outlined pills
   ("Sterile compounding", "Patient-specific Rx only"). Then 4 link columns, `gap-16`:
   **SHOP** / **SUPPORT** / **COMPANY** / **LEGAL** — headings 12/600/`.1em` `footer-label`,
   links 14 `on-dark`.
3. Legal row, `border-t footer-line`, `pt-5`: 12/18 `footer-legal` paragraph (max-w 820) +
   `© 2026 Evoluciona Pharma`.

Inert links: About, Privacy Policy, Terms of Use.

### 6.3 Shared — `EvoRequestDrawer`
`design-reference/EvoRequestDrawer.dc.html` · `state-overlay-request-drawer.png`

Right sheet, **420w**, full height, `z-40`; scrim `rgba(20,37,63,0.45)` `z-39`.
Sheet slides in `translateX(100%) → 0` over 350ms ease; scrim fades 250ms.
- Header: "Request list" (26 Serif) + count chip (`bg brand-tint`, `brand`, 12/700) and a
  34px round `#F1F3F6` × button (hover `#DCE1E8`). `border-b #EEF0F4`.
- Rows: 64px `rounded-[10px]` thumb, name 19 Serif, `program · presentation` 12.5 `muted-2`,
  underlined 12/500 "Remove" (hover `error`). Rule between rows.
- Amber notice: "No pricing is shown online — a representative shares program details after your request."
- Footer: full-width 50h `brand` pill **Request Product Information** → `/request/contact`;
  underlined 13/600 "Continue browsing" closes.

Adding an item opens the drawer. Adding an existing item does **not** duplicate it (product detail
updates its presentation instead). Escape and scrim click close.

### 6.4 Home — `/`
`full-01-home.png` · `state-home-*.png` · 1440×4007

1. **Hero carousel** — `sticky top-[112px]`, h720, 3 slides cross-fading `opacity` over 900ms
   `cubic-bezier(.4,0,.2,1)`, auto-advance **6000ms**, arrows reset the timer.
   Each slide: striped placeholder bg + a darker striped panel on the right (396/452/340px wide),
   82px Serif headline (second clause in italic) in an 820px column at `top-200px`, right-aligned;
   below it a white pill CTA with a 44px `brand` circle arrow, plus a 12.5px caption.
   Copy: "Practice-grade care starts *with the formulation.*" → Shop formulations ·
   "Compounded to order, *prescription by prescription.*" → Verify your practice ·
   "Six clinical programs, *one pharmacy.*" → Browse programs.
   Controls bottom-right: `1/3` tabular label, 140×2 progress bar animating width 0→140 over 6s,
   two 34px outlined round arrows.
2. **Content sheet** — `mt-[-32px] rounded-t-[28px] z-2` white, home-overlap shadow. It lifts over
   the sticky hero; keep the overlap.
3. **Featured formulations** — H3 40 Serif + "Sterile compounded vials, photographed as supplied.",
   "Shop all →" right. 4-col grid, `gap-[22px]`. Card: 220h image (`scale(1.05)` on hover),
   badge top-left, name 25 Serif, spec 13/19 `muted`, full-width 44h `brand` pill
   "Add to Request List". Card hover: `translateY(-4px)` + card-hover shadow + `border line-strongest`.
4. **Find your formulation** — H3 + "View all programs →". 3-col grid of 6 program cards:
   76px `rounded-xl` thumb, label 21 Serif, "N formulations" 13 `muted-2`, `brand` arrow.
   Hover `translateY(-3px)` + program-hover shadow. Each links to the filtered shop.
5. **Stat band** — `bg navy`, `py-11 px-14`, 4 stats split by 1×52 `#24354F` rules:
   **8** Compounded formulations · **6** Clinical programs · **100%** Patient-specific prescriptions ·
   **1:1** Representative support. The 8 and 6 count up from 0 over 1100ms (cubic ease-out) when
   scrolled into view at 40% threshold.
6. **How ordering works** — eyebrow + 54px centered H3 "From verification to your practice."
   `grid 1fr 1.02fr; gap-[72px]`. Left: 4 timeline steps on a dotted vertical rule with 11px
   `brand` dots, "Step 0N" `brand-tint` pill, 30px Serif title, 14.5/23 `muted` body (max-w 410):
   Verify your license · Build a request list · Consult a representative · Prescribed, patient-specific.
   Right: 588h striped placeholder (`mr-14`), a 296×336 floating card bottom-right, and a 142px
   circle top-right containing a rotating SVG `textPath` marquee
   ("VERIFIED PROVIDERS · PATIENT-SPECIFIC · ", 22s linear infinite) around a 34px ℞ glyph.
7. **Testimonial** — `bg surface-alt`, centered: 70px Serif `#C9D0DA` open quote, 31px italic Serif
   placeholder quote (max-w 860), attribution, and a Fira Code amber note
   "testimonial copy pending — compliance review".
8. **CTA band** — `bg brand-tint`, 42px H3 "Bring compounded formulations to your practice",
   subcopy, 52h `brand` pill "Become a verified provider" → `/request/contact`.

### 6.5 Shop — `/shop`
`full-02-shop.png` · `state-shop-*.png` · 1440×3192

- **Hero** — h430. Striped placeholder + a **hue-driven** gradient tint:
  `linear-gradient(92deg, oklch(.27 .075 H / .97) 0%, oklch(.31 .075 H / .8) 45%, oklch(.38 .06 H / .32) 100%)`,
  transitioning `background` over 900ms. `H` per context: all `262` · Longevity `285` ·
  Recovery `192` · Hormone `245` · Nutrient `152` · Metabolic `215` · Sexual Wellness `335` ·
  search `262`. Content: breadcrumb (`Home / Shop All` + ` / <program>` or ` / Search`),
  64px H1, 15/23 subcopy (max-w 530), and an outlined count pill (`8 products` or `N of 8 products`).
  Title/sub/pill re-animate (fade-up 16px, 600ms, `cubic-bezier(.22,1,.36,1)`) on every filter change —
  implemented by alternating between two identical keyframes so the animation restarts.
  Titles/subs per program are in the `HEROES` table in `shop.dc.html`. Search hero title is the
  quoted query; sub is "N formulations match your search." / "No formulations match this search."
- **Sidebar** — 264w, `sticky top-6`. "Filter" 24 Serif + "Clear all" (only when filters are active).
  Two facet groups under `border-t line`, each headed by a 12/600/`.1em` `muted-2` eyebrow:
  **PROGRAM** (6, multi-select, URL-backed) and **PRESENTATION** (5 mL 5 · 10 mL 3 ·
  Pending confirmation 1 — multi-select, **local state only, not in the URL** today; put it in
  searchParams when you build it). Checkbox: 18px, `1.5px line-strongest` border, `rounded-[5px]`;
  checked fills `brand` at `inset-[-1.5px]` with a white tick. Row 14/19 `#3C4757` + count.
  Below: amber "Verified providers only." panel.
- **Toolbar** — "N products" 14/600 + removable filter chips (32h, `bg brand-tint`,
  `border brand-tint-border`, `brand` 12/600, × icon; query chip first, then programs, then
  presentations). Right: Sort pill 42h → 190w menu (Featured / A–Z / Z–A, active row `brand` 600
  with a tick). Outside `mousedown` closes.
- **Grid** — 3 cols, `gap-[26px_24px]`. Card: 300h image `rounded-[20px]` `border line`,
  `scale(1.05)` on hover over 500ms `cubic-bezier(.22,1,.36,1)`; badge top-left; a
  **"View details"** pill that sits bottom-center on the image (`bg rgba(255,255,255,.95)`,
  hover inverts to `bg navy` + white). Below: clickable uppercase program eyebrow (11/600/`.09em`,
  hover `brand`, sets the program filter to just that one), 27px Serif name, 13/19 spec,
  full-width 44h `brand` "Add to Request List".
- **Empty state** — `bg surface-alt-2`, `border-dashed line-strong`, `rounded-[20px]`, `py-18`:
  28px Serif "No formulations match", 14 `muted` line, outlined "Clear filters".
- **About the catalog** — `bg surface-alt`, `grid 1fr 1.2fr; gap-14`: eyebrow + 40px H2
  "Documented exactly as the pharmacy confirms it." / 15/25 paragraph + "Read the Provider FAQ →".
- **How the provider portal works** — centered 40px H2 + 4 columns, each a 56px `brand-tint`
  circle icon, 16/600 title, 13/20 `muted` body: Sterile compounding · Verified providers ·
  Patient-specific dispensing · Representative follow-up.

Filtering is AND across the three axes; the text query is AND across whitespace tokens matched
against name + program + presentations + spec + blurb.

`shop-classic` (`full-10-shop-classic.png`) is an earlier, denser alternative of this page.
Confirm with the client whether it ships before implementing it.

### 6.6 Product detail — `/products/[slug]`
`full-03-product-detail.png` · `state-product-*.png` · 1440×2200

One template, 8 products, driven by the `PRODUCTS` table in `product-nad.dc.html`.

- Breadcrumb `Home / <program> / <name>`.
- `grid 660px 1fr; gap-[52px]`.
- **Left**: 520h main image `rounded-[18px]` `border line` (`scale(1.06)` / 500ms on hover), then
  four 94×76 thumbs. **Only thumb 1 is a real photo**; 2–4 are striped placeholders labelled
  01–04 for `vial front` / `label detail` / `scale reference` / `carton & insert`. Selecting a
  placeholder thumb swaps the main frame to a striped panel with a Fira Code caption
  `product photography · <slug> · <view> · 660×520`. Selected thumb: `2px brand` border.
- **Right**:
  - Program chip (`bg brand-tint`, links to filtered shop) + outlined teal **Sterile** chip.
  - 58px Serif name; 15/23 `muted` tagline.
  - **Presentation** selector — 42h pills; selected `bg brand` + white, others outlined.
    Hidden when the product has no confirmed presentations.
  - When pending, an amber panel replaces it: "Presentation pending pharmacy confirmation —
    source documents conflict."
  - Availability line: 8px teal dot + "Available to request — compounded per patient-specific prescription".
  - 52h `brand` **Add to Request List**; 50h outlined **Contact a representative**.
  - 15/24 blurb; amber "verified licensed providers / no pricing online" panel.
  - **Accordion**, single-open, hairline-separated, chevron rotates 180°/250ms:
    Description · How it's supplied · Provider requirements · Product FAQ (with "View all FAQs →").
    Opens on **Description** by default.
  - **Frequently requested together** — one pairing card (56px thumb, 19px Serif name, 12.5 spec,
    outlined 38h "Add" that inverts to `brand` on hover). Pairings: NAD+↔NAD+/Glutathione,
    BPC-157↔TB-500, PT-141→Sermorelin, others→NAD+.
  - Three 12.5/18 assurance blurbs: Sterile compounding / Patient-specific Rx / Practice shipping.
- **Disclaimer** — `bg surface-alt`, `border #E1E5EB`, `rounded-[10px]`, 13/21 `#5C6879`, verbatim.
- **You may also review** — 34px Serif H3 + 4 cards (160h image, 21px Serif name, 12.5 spec).
  Same-program products first, then the rest, capped at 4.
- **Sticky bar** — pinned to the bottom of the frame: 46px thumb, 21px Serif name,
  `Sterile vial · <conc> · <size>` (or `presentation pending`), and a 44h `brand` add button.

Changing product resets the image index, the accordion (back to Description), the selected
presentation (first available), and scrolls to top.

### 6.7 Provider FAQ — `/faq`
`full-04-faq.png` · `state-faq-*.png` · 1440×2146

- Hero h372, striped + flat `linear-gradient(90deg, rgba(20,37,63,.88), rgba(20,37,63,.66) 58%, rgba(20,37,63,.34))`,
  breadcrumb, 64px H1 "Frequently Asked Questions", 15/23 subcopy. Fade-up 700ms on load.
- `brand-tint` notice: "**This portal is for licensed providers.** Patients should contact their
  prescribing provider. Ordering requires verification and a patient-specific prescription."
- `grid 264px 1fr; gap-11`. Sidebar `sticky top-[132px]`: "Topics" 24 Serif, then 6 rows
  (`rounded-[9px]`, `px-3 py-2.5`; active `bg brand-tint` + `brand` 600) with per-topic counts,
  then a "Provider support" box ("Mon–Fri, 8:00–18:00 ET…" + "Contact support →").
- Right: 38px Serif topic title + topic lede, then accordion cards. Closed `border line`;
  open `border line-strongest` + faq-open shadow. Question 16/24/600 navy; the toggle glyph is a
  22px Serif `+` / `−`. Body: `border-t #EDF0F4`, fade-in 250ms, and renders three block types —
  `h` (14/600 navy sub-head), `p` (14/23 `#4A5563`, max-w 680), `ul` (5px `#9BA5B7` dot bullets,
  `gap-[9px]`, max-w 660). Single-open by default; the first question of each topic opens on arrival.
- Amber Fira Code note: "answer copy is structural — timelines and policy wording pending sign-off
  from the content owner". Ship-blocking: get final policy copy signed off.
- Bottom "Still need a hand?" card with an outlined "Open assistant" button (no behavior wired).

Topics (slug · label · count): `secure-ordering` Secure Ordering 3 · `track-order` Track Order 3 ·
`orders-shipping` Orders & Shipping 3 · `payment-credit` Payment & Account Credit 3 ·
`returns-refunds` Returns & Refunds 3 · `account-info` Account Info 4. All copy is in
`data/catalog.json` → `faqTopics`.

### 6.8 Request flow — `/request/*`
`full-05…08`, `state-request-*.png`

Page bg `surface-form`. Steps 1–2 use the 1160px two-column layout with a persistent
**"Your request"** summary panel on the right (380w). Steps 3–4 use a single centered **704px**
card with no summary panel.

- **Stepper** — steps 1–2 show four numbered pips joined by 56×1 `line-strongest` connectors;
  current pip `bg brand` white 12/700, future pips outlined `muted-3`, completed pips a
  `teal-tint` circle with a teal tick. Steps 3–4 use a compact variant: completed ticks, the
  current number, an inline label, and "4 · Additional" pushed right.
- **Step 1 · Contact** — H2 40 Serif "Request Product Information" + "A representative will follow
  up with program details. No pricing is shown online." Card `p-8`, "Primary contact" 26 Serif,
  2-col `gap-[18px]` fields (48h, `rounded-[10px]`, `border line-strong`): Name · Role · Email
  (focused: `1.5px brand`) · Phone · License / NPI number · Licensed state (select).
  Footer: "‹ Back to catalog" and a 48h `brand` **Continue**.
  Right rail: "Your request" panel (54px thumbs, 18px Serif names, `program · presentation`),
  a `brand-tint` "No pricing online." note, and a lock + "License verified before any order is placed".
- **Step 2 · Practice** — an **error state**, shown deliberately. Red banner
  "**1 field needs attention.** Practice or company name is required before you can continue."
  The Practice-name field gets `1.5px error` border, `bg error-bg`, and a 12px error message.
  Other fields prefilled: Website `northbayhealth.com`, Address `1400 Bayshore Blvd, Suite 210`,
  City/State/ZIP in a `2fr 1.4fr 1fr` grid (`Tampa` / `Florida` / `33606`). Outlined **Back** +
  `brand` **Continue**.
- **Step 3 · Profile** — Practice type (select, `Integrative & functional medicine`) and
  **Products or medications of interest**: a token field (min-h 48, `1.5px brand`) holding
  `brand-tint` chips with × affordances, an "Add more…" hint, and an open suggestion list
  (`rounded-[10px]`, `border #E1E5EB`, dropdown shadow; first row `bg surface-alt`) of the
  remaining catalog. Seed the tokens from the request list. Back / Continue.
- **Step 4 · Additional** — 118h textarea "Message or special requirements" (optional),
  "How did you hear about Evoluciona Pharma?" select, and a **required** checked attestation:
  "I confirm I am a licensed healthcare provider and that any order will be placed pursuant to a
  patient-specific prescription." Back / **Submit request**.
- **Confirmation** — 680px centered column: 72px `teal-tint` circle with a teal check, 48px Serif
  "Request received", "An Evoluciona Pharma representative will follow up with the next steps."
  + `Reference REQ-2026-0418` in Fira Code. Then an outlined panel: **YOUR REQUEST** line items,
  and **WHAT HAPPENS NEXT** — 1 A representative contacts you about your list · 2 License
  verification is completed · 3 Program details and next steps are shared.
  CTAs: `brand` "Back to catalog" + outlined "Provider FAQ". Nav bag count resets to **0**.

Fields in the prototype are **static divs styled to look like inputs** — there is no validation
logic to port. Build real inputs, and treat the step-2 error state as the visual spec for
validation. Suggested rules: Name, Email, License/NPI, Licensed state, Practice name, Address,
City, State, ZIP, and the attestation are required; email format; ZIP 5 digits; phone optional.

## 7. Interactions & behavior

| Behavior | Spec |
| --- | --- |
| Scroll reveal | Elements enter with `opacity 0→1` + `translateY(26px→0)` over 700ms ease, staggered by a per-element delay (0/80/100/120/140/200ms). IntersectionObserver, threshold 0.08–0.1, `rootMargin: 0 0 -8% 0`, unobserve after firing. **Include the 2s failsafe that force-reveals anything still hidden** — a viewport where the observer never fires would otherwise leave the page blank. In React use a small `useReveal` hook, and skip the animation under `prefers-reduced-motion`. |
| Hero carousel | 6000ms auto-advance, 900ms cross-fade, arrows reset the timer, progress bar restarts each slide. |
| Stat counters | Count up over 1100ms with `1-(1-k)³` easing at 40% visibility, once. |
| Card hover | `translateY(-3/-4px)` + shadow + border darken, 250ms ease. |
| Image hover | `scale(1.05–1.06)`, 400–500ms (shop grid uses `cubic-bezier(.22,1,.36,1)`). |
| Dropdown open | Fade 160–250ms; closes on outside `mousedown` and Escape. |
| Drawer | 350ms slide, 250ms scrim fade; closes on scrim, ×, Escape, "Continue browsing". |
| Accordion | Single-open; chevron 180°/250ms; body fades in 250ms. |
| Add to list | Opens the drawer, dedupes by name, bumps the nav count. |

## 8. State

Server/URL state: active programs, text query, sort, FAQ topic, product slug. Put these in the URL.

Client state: the **request list** (`{name, program, presentation}[]`) — must persist across every
screen, so lift it to a provider (`RequestListContext`) plus `localStorage`; the prototype fakes it
with per-page seed data (`NAD+` 5 mL, `Sermorelin` 5 mL) and that is the only reason the count
reads 2 everywhere. Also client: drawer open, dropdown/search open, highlighted result index,
accordion index, selected presentation, selected image index, hero slide, presentation facet.

Form state: 4 steps of provider data. Persist across steps (context or a wizard store) and
validate per step before advancing.

## 9. Assets

- `assets/vials/*.jpg` — **real product photography**, 11 files. 8 map to catalog products by slug;
  `ghk-cu`, `semaglutide`, `tirzepatide` are extras for future SKUs.
- `assets/brand/` — `evoluciona-logo.png` (nav), `evoluciona-logo-white.svg` (footer),
  `evo-mark.svg`.
- **Everything else is a striped placeholder awaiting art direction** — see §10.

Placeholder pattern, if you need to reproduce it while imagery is outstanding:
`repeating-linear-gradient(135deg, #EDF0F4 0 12px, #E2E7EE 12px 24px)`, with a Fira Code caption
on `rgba(255,255,255,.92)`, `rounded-[4px]`, `px-2 py-[3px]`. **Strip the captions before launch.**

## 10. Known gaps — carried over deliberately, do not silently "fix"

1. **Art direction not delivered.** Home hero (3 slides), the ordering-section imagery, and the
   shop/FAQ hero bands are striped placeholders. Vial photography IS final.
2. **Product thumbs 2–4** are placeholders — only `vial front` is shot.
3. **`MOTS-C` presentation** and **`Lipo-C` concentration** render as pending. Blocked on pharmacy
   confirmation. Never estimate.
4. **Nav About** and the footer **About / Privacy Policy / Terms of Use** have no destinations.
5. **Nav Account** button has no destination — verification/auth was out of scope.
6. **FAQ answer copy is structural.** Timelines and policy wording need content-owner sign-off.
7. **Testimonial** is a placeholder pending compliance review.
8. **Badge wording** ("Featured", "New") needs compliance confirmation.
9. **"Open assistant"** on the FAQ has no behavior.
10. **Desktop only.** Every screen is a fixed 1440px frame; no responsive work exists. Ask the
    client for mobile/tablet direction — do not improvise breakpoints for a regulated pharmacy UI.
11. **`shop-classic`** is a legacy alternative layout; confirm before building.

## 11. Bundle contents

```
README.md                     ← this spec
tokens/tailwind.config.ts     ← paste-ready theme
tokens/globals.css            ← font loading + base resets
data/catalog.json             ← products, programs, facets, all FAQ copy
design-reference/             ← the 10 pages + 3 shared parts (design references, not code)
assets/vials/                 ← final product photography
assets/brand/                 ← logos and mark
standalone/                   ← evoluciona-site-clean.html — open in a browser, fully interactive
screenshots/full-*.png        ← full-page render per screen
screenshots/state-*.png       ← interaction states (drawer, search, filters, errors, overlays)
```

## 12. Suggested build order

1. Tokens + fonts + `AppShell` (nav + footer + request-list provider). §3, §6.1–6.2.
2. `data/catalog.json` → typed data layer.
3. `/shop` with URL-backed filters, search, sort. This is the routing contract; get it right first.
4. `/products/[slug]`.
5. Request drawer + list persistence.
6. `/request/*` wizard + validation + `/request/confirmation`.
7. `/faq`.
8. `/` — the most motion-heavy screen; build it last.
