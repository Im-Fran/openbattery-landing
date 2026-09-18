# openbattery-landing

Landing page for **[OpenBattery](https://github.com/Im-Fran/openbattery)**, a native macOS
menu bar app that reads your battery straight from IOKit. Ships to
**[openbattery.app](https://openbattery.app)**.

## Overview

Two static documents — the landing page and `/support` — built from one React codebase. No router,
no CSS framework, no state library: each page is its own Vite entry with its own `<head>`, so
`/support` keeps a real canonical URL and still says how to get help with JavaScript switched off.
Every section is a component under `src/components/`, and all user-facing copy lives in two JSON
files so both pages render in English (default) or Spanish.

The design is dark-only and sized in `clamp()` against the 2880×1620 artboard the hero was
ported from, so the layout scales continuously instead of snapping between breakpoints. There is
one media query, at 900 px, where the hero drops to a single column.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (no router, no state library) |
| Pages | Two Vite entries: `index.html` and `support/index.html` |
| Language | TypeScript 6 |
| Build | Vite 8 (`@vitejs/plugin-react`) |
| Styles | Plain CSS, one file per component, custom properties in `src/index.css` |
| i18n | Two JSON dictionaries + a React context (`src/i18n/`) |
| Linting | oxlint |
| Fonts | IBM Plex Mono, self-hosted via `@fontsource/ibm-plex-mono` |

The only runtime dependencies are `react`, `react-dom` and the font package.

## Requirements

- **Node.js** 20.19+ or 22.12+ (Vite 8's minimum)
- **npm** (a `package-lock.json` is committed)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

There are no environment variables to configure. The page has no backend and makes no network
calls at all — the font is bundled, not fetched from a CDN.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | Type-checks with `tsc -b`, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` on port 4173 |
| `npm run lint` | oxlint over the project |

## Project structure

```
index.html              The landing page: SEO, Open Graph, Twitter card, JSON-LD
support/index.html      The support page, with its own canonical and ContactPage JSON-LD
public/
  badges/               Apple's Mac App Store lockups, one SVG per locale
  shots/                App screenshots used by the hero deck and the tabs
  og-image.png          1200×630 social preview
  robots.txt, sitemap.xml
src/
  main.tsx              Entry for index.html
  support.tsx           Entry for support/index.html
  App.tsx               Section order of the landing page
  index.css             Design tokens (--ob-*) and shared primitives
  i18n/
    en.json, es.json    All copy, same shape in both files
    index.ts            Dictionaries, context, useI18n hook
    provider.tsx        <I18nProvider>: detection, persistence, <html lang>
  components/           One .tsx + .css pair per section
```

## Working with translations

`src/i18n/index.ts` declares the dictionaries with `satisfies Record<Lang, Dict>`, where `Dict`
is `typeof en`. A key present in `en.json` but missing from `es.json` fails `npm run build` —
the type checker is the only guard against a half-translated page, so don't remove it.

The active language is picked once, in this order: the `?lang=` query parameter →
`localStorage["ob-lang"]` → `navigator.language` → `en`. A shared link wins over what the browser
remembers, because whoever sent the link chose that language on purpose.

`?lang=` and `localStorage` are only written when someone actually uses the switch. Writing the
parameter on every load would mean anyone copying the URL pins their own language onto whoever
opens it.

Both `localStorage` calls are wrapped in `try`/`catch`. Reading it throws outright where storage
is blocked (Safari's "Block all cookies"), and the read happens during the provider's first
render — unguarded, it takes the whole page down to a blank root.

To add a locale: drop a `<code>.json` next to the others, add the code to the `Lang` union, and
add a matching App Store badge at `public/badges/mac-app-store-<code>.svg` (download the lockup
for that storefront from [Apple's marketing resources](https://developer.apple.com/app-store/marketing/guidelines/)).

Each language has a shareable URL (`/?lang=es`), which is what makes a Spanish link worth sending
to someone. It is deliberately *not* declared to search engines: the page is client-rendered, so
the server returns the same English HTML at every URL, and `hreflang` alternates would promise
Google a Spanish document no crawler can fetch. Indexing Spanish properly means prerendering a
real per-locale file with its own canonical, title, description and `og:locale`.

## Building and deploying

```bash
npm run build
```

Output lands in `dist/` as fully static files: `index.html`, `support/index.html`, hashed JS and
CSS chunks (the shared React chunk is split out, so the support page costs ~1.5 kB of its own),
the bundled font files, and the contents of `public/`. Any static host works; there is no
server-side piece. `/support` resolves to `dist/support/index.html` with no rewrite rules.

The absolute URLs in `index.html`, `support/index.html`, `sitemap.xml` and `robots.txt` are
hardcoded to `https://openbattery.app`. Change them together if the domain ever moves.

## License

The OpenBattery app is MIT licensed — see the [app repository](https://github.com/Im-Fran/openbattery).

The Mac App Store badges under `public/badges/` are Apple artwork, covered by
[Apple's marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines/), not
by this project's license. Don't recolor or re-typeset them.

---

© 2026 FranciscoSolis E.I.R.L.
