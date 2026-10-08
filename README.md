# Rafeeq Site

Marketing and documentation site for [Rafeeq](https://github.com/Ayoub-EDAHLOULI/Rafeeq), a fully offline desktop AI assistant. Built with Next.js (App Router) and self-hosted on a VPS.

## Pages

- **Home** — product overview and hero
- **Features** — chat, model manager, code help, document Q&A, RAG, sessions, offline verification
- **Download** — standard and bundled-model build variants
- **Docs** — getting started guide

## Internationalization

The site is available in 6 languages via [`next-intl`](https://next-intl.dev), with URL-prefixed routes (`/en`, `/fr`, `/es`, `/de`, `/ar`, `/zh`):

- English (default)
- French
- Spanish
- German
- Arabic (right-to-left layout)
- Chinese

Translation files live in [`messages/`](messages/), one JSON file per locale. Routing config is in [`src/i18n/routing.ts`](src/i18n/routing.ts).

## Design tokens

Colors, fonts and the type scale follow the redesign in [`design/`](design/) (see `design/TOKENS.md`), which matches the desktop app. They are defined in [`src/app/[locale]/globals.css`](src/app/%5Blocale%5D/globals.css) with Tailwind v4's `@theme` syntax: light values by default, dark values when the theme toggle sets `data-theme="dark"`, and the OS preference until a theme is chosen. Components use the tokens (`bg-panel`, `text-muted`, `text-accent-fg`, …), never raw hex values.

Fonts are self-hosted at build time: Hanken Grotesk and JetBrains Mono through `next/font/google`, and the Arabic subset of IBM Plex Sans Arabic from [`src/assets/fonts/`](src/assets/fonts/) (OFL license included).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the default locale (`/en`).

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
- `npm run check:copy` — check that all six locale files have the same keys and contain no bracketed placeholders

## Environment

See [`.env.example`](.env.example). Put real values in `.env.local` (never committed) or in the server's environment.

- `GROQ_API_KEY` — key for the website assistant (`/api/chat`). Without it the assistant shows an "unavailable" message.
- `SITE_URL` — public address, e.g. `https://example.com`. Enables canonical links, `hreflang` alternates and the sitemap. Set it in the environment where `npm run build` runs: some pages are pre-rendered at build time.

## Deployment

The site runs on a VPS as a Node.js server (`npm run build`, then `npm run start`) behind nginx. nginx must pass the visitor's address with `proxy_set_header X-Real-IP $remote_addr;`, which the assistant's rate limit relies on.

Release data for the Download page (file URLs, sizes, SHA-256 checksums, requirements) lives in [`src/lib/release.ts`](src/lib/release.ts); update that file for each new release.
