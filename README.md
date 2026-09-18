# openbattery-landing

Landing page for **[OpenBattery](https://github.com/Im-Fran/openbattery)**, a native macOS
menu bar app that reads your battery straight from IOKit. Ships to
**[openbattery.app](https://openbattery.app)**.

## Overview

A single-page React app: no router, no CSS framework, no state library. Every section is a
component under `src/components/`, and all user-facing copy lives in two JSON files so the page
can render in English (default) or Spanish.

The design is dark-only and sized in `clamp()` against the 2880×1620 artboard the hero was
ported from, so the layout scales continuously instead of snapping between breakpoints. There is
one media query, at 900 px, where the hero drops to a single column.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (no router, no state library) |
| Language | TypeScript 6 |
| Build | Vite 8 (`@vitejs/plugin-react`) |
| Styles | Plain CSS, one file per component, custom properties in `src/index.css` |
| i18n | Two JSON dictionaries + a React context (`src/i18n/`) |
| Linting | oxlint |
| Fonts | IBM Plex Mono via Google Fonts |

No runtime dependencies beyond `react` and `react-dom`.

## Requirements

- **Node.js** 20.19+ or 22.12+ (Vite 8's minimum)
- **npm** (a `package-lock.json` is committed)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

There are no environment variables to configure — the page has no backend and makes no network
calls beyond the Google Fonts stylesheet.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | Type-checks with `tsc -b`, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` on port 4173 |
| `npm run lint` | oxlint over the project |

## Project structure

```
index.html              SEO, Open Graph, Twitter card and JSON-LD live here
public/
  badges/               Apple's Mac App Store lockups, one SVG per locale
  shots/                App screenshots used by the hero deck and the tabs
  og-image.png          1200×630 social preview
  robots.txt, sitemap.xml
src/
  App.tsx               Section order
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

The active language is picked once, in this order: `localStorage["ob-lang"]` → `navigator.language`
→ `en`. Switching writes `localStorage` and updates `document.documentElement.lang`.

To add a locale: drop a `<code>.json` next to the others, add the code to the `Lang` union, and
add a matching App Store badge at `public/badges/mac-app-store-<code>.svg` (download the lockup
for that storefront from [Apple's marketing resources](https://developer.apple.com/app-store/marketing/guidelines/)).

Note that the language switch is client-side only: the site serves one URL, so search engines
index the English copy. Indexing the Spanish version would need per-locale routes and prerendering.

## Building and deploying

```bash
npm run build
```

Output lands in `dist/` as fully static files — HTML, one JS bundle, one CSS bundle and the
contents of `public/`. Any static host works; there is no server-side piece.

The absolute URLs in `index.html` (canonical, `og:url`, `sitemap.xml`, JSON-LD) are hardcoded to
`https://openbattery.app`. Change them together if the domain ever moves.

## License

The OpenBattery app is MIT licensed — see the [app repository](https://github.com/Im-Fran/openbattery).

The Mac App Store badges under `public/badges/` are Apple artwork, covered by
[Apple's marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines/), not
by this project's license. Don't recolor or re-typeset them.

---

© 2026 FranciscoSolis E.I.R.L.
