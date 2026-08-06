# Evoluciona Pharma — Provider Portal

A licensed-provider-only portal for a sterile compounding pharmacy. Providers browse a catalog of
8 compounded formulations across 6 clinical programs, build a **Request List** (not a cart), and
submit a 4-step information request. **No pricing appears anywhere online** — a representative
follows up. Browsing is open; ordering is gated on license verification.

Implemented pixel-for-pixel from the design handoff in
[`design_handoff_evoluciona_provider_portal/`](design_handoff_evoluciona_provider_portal/README.md),
which remains the design source of truth.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3 — theme pasted from `tokens/tailwind.config.ts` in the handoff |
| Fonts | Instrument Serif / Instrument Sans / Anek Latin / Fira Code via `next/font/google` |
| Data | `data/catalog.json` — products, programs, facets, FAQ topics, compliance copy (verbatim) |
| State | React context + `localStorage`/`sessionStorage`; URL `searchParams` for filter/search/sort |
| Rendering | Fully static — every route prerenders (SSG); no server runtime state |

## Getting started

```bash
npm install
npm run dev          # development server on :3000
npm run build        # production build (all routes prerender)
npm run start        # serve the production build
npm run build:pages  # static export to out/ (GitHub Pages)
```

## Project structure

```
app/                          # routes (App Router)
  page.tsx                    #   /            home (carousel, stats, timeline)
  shop/page.tsx               #   /shop        catalog with URL-backed filters
  products/[slug]/page.tsx    #   /products/*  one template, 8 products (SSG)
  faq/[topic]/page.tsx        #   /faq/*       6 topics, path-based
  request/                    #   /request/*   4-step wizard + confirmation
components/
  AppShell.tsx                # 1440px frame: nav + footer + drawer + providers
  EvoShopNav.tsx              # strip, programs dropdown, typeahead search, bag
  EvoShopFooter.tsx           # newsletter, link columns, legal
  RequestDrawer.tsx           # right sheet request list
  RequestListContext.tsx      # request list state + localStorage persistence
  Reveal.tsx                  # scroll-reveal (IntersectionObserver + 2s failsafe)
  home/ shop/ product/ faq/ request/   # per-screen components
lib/
  catalog.ts                  # typed accessors over data/catalog.json
  search.ts                   # shop filtering + nav typeahead ranking
data/catalog.json             # all real content — do not retype copy
public/assets/                # final vial photography + brand marks
design_handoff_evoluciona_provider_portal/   # design spec, references, screenshots
```

## Architecture notes

- **Routing contract (handoff §4).** Product identity lives in the path
  (`/products/bpc-157`); filter, search, presentation, sort, and FAQ-topic state live in
  `searchParams` so they survive refresh and are linkable. Filter changes navigate with
  `scroll: false`; only route changes scroll to top.
- **Request list.** `RequestListContext` holds `{name, program, presentation}[]`, persists to
  `localStorage`, dedupes by name (re-adding updates the presentation), and drives the nav badge,
  drawer, wizard summary rail, and step-3 interest tokens.
- **Request wizard.** `RequestWizardContext` (sessionStorage) carries form data across
  `/request/contact → practice → profile → additional`. Validation follows the handoff's
  suggested rules; the step-2 error state in the references is the visual spec for all steps.
  Submission stores a snapshot + generated reference and clears the list (bag resets to 0).
- **Search.** Nav typeahead matches AND across whitespace tokens over name + program +
  presentation + synonym list, ranked by name-prefix → name-contains → other-field, capped at
  5 formulations + 2 programs. The input mirrors the page's `?q=` and defers URL→input sync
  while focused.
- **Motion.** Scroll reveals (fade-up 26px/700ms, staggered) via `Reveal`, with the required 2s
  failsafe; hero carousel (6s auto-advance, 900ms cross-fade); stat count-up (1100ms cubic
  ease-out at 40% visibility); everything gated behind `prefers-reduced-motion`.
- **Desktop only.** Every screen is a fixed 1440px frame by design — no responsive breakpoints
  exist on purpose (regulated pharmacy UI; awaiting client direction).

## Content rules (do not "fix")

These are deliberate and carried from the legally-reviewed handoff (§10):

- **No pricing anywhere.** The cart is a Request List; checkout is an information request.
- **Compliance copy is verbatim** — top strip, amber notices, product disclaimer, footer legal,
  attestation. All sourced from `data/catalog.json`, never retyped.
- **MOTS-C presentation and Lipo-C concentration render as "pending"** until the pharmacy
  confirms them. Never estimate.
- Striped placeholders + Fira Code captions mark imagery awaiting art direction (strip captions
  before launch). Nav **About**, footer **About/Privacy/Terms**, **Account**, and the FAQ
  **"Open assistant"** button are intentionally inert. FAQ answer copy and the testimonial are
  pending content-owner/compliance sign-off. `shop/classic` is unbuilt pending client
  confirmation.

## Deployment

### GitHub Pages (current)

`.github/workflows/pages.yml` builds a static export and publishes it on every push to `main`.
Live at **https://evoluciona-pharma.github.io/Site/**.

Pages serves the site from a subdirectory, which the workflow handles by setting
`NEXT_PUBLIC_BASE_PATH=/Site`. Two consequences worth knowing:

- Raw `<img src>` does not get `basePath` prefixed by Next, so **every public-asset path must go
  through `asset()` in `lib/asset.ts`** — a hardcoded `/assets/...` will 404 in production while
  working fine locally.
- The export uses `trailingSlash: true` so each route emits `<route>/index.html`; without it Pages
  404s on deep links.

To preview the Pages build exactly as it will be served:

```bash
NEXT_PUBLIC_BASE_PATH=/Site npm run build:pages
mkdir -p /tmp/pages/Site && cp -R out/* /tmp/pages/Site/
cd /tmp/pages && python3 -m http.server 4321   # → http://localhost:4321/Site/
```

### Other hosts

The build is fully static, so any Node host or static platform works. For Vercel (the CLI is a
dev dependency), `npx vercel --prod` — no base path needed there, since it serves from the root.
