# Mobile Fix Plan — Evoluciona Provider Portal

Audit date: 2026-08-06 · Emulation: iPhone 16 (393 × 852), agent-browser against `next dev`.
Every route was loaded and measured for horizontal overflow, off-screen elements,
tap-target size, and console errors; the add-to-request flow was exercised end to end.

## Context

The site is intentionally a fixed 1440px desktop frame (`README §3`,
`AppShell.tsx`, `frame: '1440px'` in `tailwind.config.ts`). On a 393px phone
viewport this is not a graceful degradation — it breaks core functionality, not
just layout.

## Verified bugs (all routes tested)

| # | Severity | Bug | Where |
|---|----------|-----|-------|
| 1 | Blocker | Every route lays out at 1440px against a 393px viewport (`scrollWidth: 1440`); users see only the left third of every page | All 10 routes |
| 2 | Blocker | Navigation is unusable: only the logo is on-screen. Shop All (x=409), Programs (x=499), About (x=617), FAQ (x=693), search (x=1098), account (x=1302), and the request-list badge (x=1360) are all off-screen; there is no mobile menu | `EvoShopNav.tsx` |
| 3 | Blocker | Tapping "Add to Request List" appears to do nothing: the drawer (`fixed right-0 w-[470px]`) opens at x=970–1440, fully off-screen; only the dimmed overlay is visible. Verified on `/products/nad` | `RequestDrawer.tsx:110` |
| 4 | Blocker | The request wizard is unusable: the form column is `w-form` (1160px) with a `grid-cols-[1fr_380px]` split, so fields and the summary card extend ~900px past the viewport | `/request/*` pages |
| 5 | High | Product page and `/index-alt` sticky CTA bars span the full 1440px with the button right-aligned at x≈1217 — the CTA is invisible | `ProductPage.tsx:304`, `StickyRequestBar.tsx:27` |
| 6 | High | Shop page: the filter sidebar is visible but the entire product grid is off-screen to the right | `/shop` |
| 7 | High | Hero headlines and copy are clipped mid-word on `/`, `/shop`, `/faq` (fixed 720px/430px/372px hero heights with 1440px-positioned text) | home / shop / faq heroes |
| 8 | Medium | Announcement-bar text (612px span centered in 1440px) starts at x=414 — never visible on mobile | `EvoShopNav` top bar |
| 9 | Medium | Tap targets well below the 44px minimum throughout: nav links 23px tall, search input 24px, footer links 16–20px, "Edit" button 22×16 | global |
| 10 | Medium | No `viewport` export in `app/layout.tsx`; the Next default (`width=device-width`) is the worst pairing with a 1440px canvas — it also triggers the classic iOS expanded-layout-viewport bug that pushes `fixed` elements off-screen (bug #3) | `app/layout.tsx` |

No JavaScript console errors on any route — these are all layout/viewport issues.

## Decision point

Two valid strategies; pick one before starting:

**A. Stay desktop-only, scale-to-fit (stopgap, ~half a day). ✅ SHIPPED 2026-08-06.**
`app/layout.tsx` exports `viewport = { width: '1440', initialScale: undefined }`.
The explicit `initialScale: undefined` is load-bearing: Next.js otherwise merges
its default `initial-scale=1` into the meta, which pins phones at 100% zoom and
re-crops the page. With plain `width=1440` phones render the whole frame zoomed
out (~0.27×) like a classic desktop site: everything is visible and tappable
(via pinch-zoom), the drawer pins to the frame edge and becomes visible, and
nothing is cut off. Verified on iPhone 16 emulation: all 10 routes overflow-free,
add-to-request drawer fully visible. Text is small; this is a stopgap, not a
mobile UX. Fixes bugs 1–8 in the "not broken" sense.

**B. Responsive refactor (the real fix, phased below). ✅ SHIPPED 2026-08-06.**
All four phases below are implemented. The option-A viewport stopgap was
reverted to `width=device-width` as part of Phase 1 (a fixed-width viewport
would suppress the responsive breakpoints). Desktop ≥1024px (`lg:`) keeps the
original 1440 design; below that, layouts stack. Verified: zero horizontal
overflow on all 10 routes at 360/393/430px, hamburger nav + drawer + wizard
functional at 393px, production build green. Regression guard:
`zsh scripts/mobile-audit.sh` (needs `npm run dev` on :3000).

## Phase 1 — Frame & shell (unblocks everything)

1. `tailwind.config.ts`: keep `frame: '1440px'` but use it as a *max*:
   `AppShell.tsx` `w-frame` → `w-full max-w-frame`.
2. Add `export const viewport: Viewport = { width: 'device-width', initialScale: 1 }`
   to `app/layout.tsx` (explicit, and prevents regressions).
3. Sweep global fixed paddings: `px-14` (56px) → `px-4 sm:px-8 lg:px-14`.

## Phase 2 — Blockers (nav, drawer, wizard)

4. **Nav** (`EvoShopNav.tsx`): below `lg`, collapse links + search into a
   hamburger sheet; keep logo, cart badge, and menu button in the 76px bar.
   Announcement bar: shorter copy on mobile (`hidden sm:inline` for the long span).
5. **Request drawer** (`RequestDrawer.tsx`): `w-[470px]` → `w-full max-w-[470px]`;
   add `pb-[env(safe-area-inset-bottom)]`; re-test the add flow on `/products/nad`.
6. **Request wizard** (`/request/*`): `w-form` → `w-full max-w-form px-4`;
   `grid-cols-[1fr_380px]` → `grid-cols-1 lg:grid-cols-[1fr_380px]` with the
   summary card stacked first (or collapsed) on mobile; `w-card` (704px) →
   `w-full max-w-card`; heading `text-[40px]` → `text-3xl lg:text-[40px]`.

## Phase 3 — High-visibility pages

7. **Heroes** (home, home-alt, shop, faq): fixed heights → `min-h` +
   viewport-relative (`h-[560px]` / `md:h-[720px]`); headline sizes stepped
   down with responsive text classes; `hero-rise` media block on `/index-alt`
   (820px) → `w-full max-w-[820px]`.
8. **Sticky CTA bars** (`ProductPage.tsx`, `StickyRequestBar.tsx`): on mobile
   drop the spec text, keep thumbnail + name + full-width CTA button;
   `px-14` → `px-4`.
9. **Shop**: filter sidebar → a "Filter" button opening a bottom sheet below
   `lg`; product grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`.
10. **Product page**: gallery/detail two-column → stacked; thumbnail rail →
    horizontal scroll-snap.
11. **Home grids**: `grid-cols-4` sections and `StatBand` → `grid-cols-2` on
    mobile (StatBand: wrap, drop the divider hairlines below `md`); card rails →
    horizontal scroll-snap rows.
12. **Footer**: multi-column → stacked accordion or single column.

## Phase 4 — Polish & guardrails

13. Tap targets: bring all interactive elements to ≥44×44 via padding
    (nav links, footer links, qty steppers, "Edit").
14. Typography sweep of remaining fixed sizes (`text-[46px]`, `text-[40px]`, …).
15. Video heroes: `preload="none"` + poster on mobile to cut data cost.
16. **Regression guard**: commit the audit as `scripts/mobile-audit.sh`
    (agent-browser: per-route overflow + tap-target check) and run it in CI
    alongside `npm test` (Vitest is now set up; `CountUp.test.tsx` is the
    template for component tests).

## Suggested order & effort

| Phase | Scope | Estimate |
|-------|-------|----------|
| 1 | Frame/shell/viewport | 0.5 day |
| 2 | Nav, drawer, wizard | 1.5–2 days |
| 3 | Heroes, shop, product, home grids, footer | 2–3 days |
| 4 | Polish + CI guard | 1 day |

Test matrix per phase: 360, 393, 430 (phones), 768, 1024 (iPad), 1440
(reference — must remain pixel-identical to the current design).
