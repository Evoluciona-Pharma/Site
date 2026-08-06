# Instructions for Claude Code

You are implementing the **Evoluciona Pharma provider portal** in **React + Next.js (App Router)
+ Tailwind CSS**.

## Read first, in this order

1. `README.md` — the complete design spec. Self-sufficient; everything else supports it.
2. `data/catalog.json` — the real product, program, and FAQ content. Use it; don't retype copy.
3. `tokens/tailwind.config.ts` + `tokens/globals.css` — paste into the app before building screens.

## What the HTML files are

`design-reference/*.dc.html` are **design references**, not source to port. They are written in a
proprietary streaming-HTML format (inline-styled template + a `class Component extends DCLogic`
logic block). Do **not** copy that format, and do **not** try to run `support.js`.

Use them as the source of truth for exact values — every color, size, radius, shadow, duration,
and string is in there. The logic block at the bottom of each file holds the state machines,
data tables, and handlers, and that logic **is** directly portable to React hooks.

## Verify behavior against the running prototype

`standalone/evoluciona-site-clean.html` opens in any browser with no build and no server. Every
interaction works. When the README doesn't answer a question, open that file and look.

## Screenshots

- `screenshots/full-*.png` — full-page render of each screen at the 1440px design width.
- `screenshots/state-*.png` — interaction states: request drawer, search typeahead, programs menu,
  filtered shop, search results, product pending state, the step-2 validation error.

## Non-negotiables

- **Fidelity is high.** Match the references pixel-for-pixel.
- **No pricing anywhere.** The cart is a "Request List"; checkout is a 4-step information request.
- **Compliance copy is verbatim.** Never paraphrase the strip, notices, disclaimer, or footer legal.
- **`MOTS-C` presentation and `Lipo-C` concentration render as "pending".** Never estimate them.
- **URL owns filter/search/topic state** (searchParams) and product identity (path). README §4.
- **Headings are Instrument Serif at weight 400.** Never bold them.
- Read README §10 before "fixing" anything that looks broken — placeholders, inert links, and
  pending values are deliberate and blocked on the client.

## Ask before you invent

There is **no responsive design** — every screen is a fixed 1440px desktop frame. Do not improvise
mobile breakpoints for a regulated pharmacy UI; ask for direction. Same for auth/verification,
the "Open assistant" button, and whether `shop-classic` ships at all.
