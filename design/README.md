# Rafeeq website redesign

Visual designs for the Rafeeq marketing site (Next.js), made on a Claude Design canvas. This folder is the reference for rebuilding the site's pages. It is a design spec, not production code.

The structure follows a common pattern for local-LLM app sites (minimal nav with one download button, big headline, large product window, a few alternating feature blocks, closing call to action, columned footer). The look is Rafeeq's own and uses the same colors, fonts and tokens as the desktop app redesign. Nothing is copied from another site.

## How to view

- Open `preview/index.html` in a browser, about 1440 px wide. Each page has a dark and a light version, and the links between pages work inside one theme folder.
- `screens/*.dc.html` are the original canvas sources. They need the canvas runtime to render, so use them only to read exact inline styles. The `preview/` files are the same markup with the template tags resolved.
- `canvas.json` is the canvas layout. You can ignore it when building.
- `TOKENS.md` has the colors, type scale, spacing and sizes.

## Pages

| Preview file | Source file | Page |
|---|---|---|
| `Home` | `Main` | Hero, product window, three pillars, four feature blocks, closing call to action |
| `Features` | `Features` | Grid of the seven features, "Good to know" list |
| `Download` | `Download` | Two installers, install guide for offline machines, requirements, checksum |
| `Docs` | `Docs` | Getting started with an "On this page" menu |

## Shared layout

- Nav (72 px): logo, Features, Docs, GitHub, language select, theme toggle, Download button. On narrow screens it wraps. A hamburger menu was not designed.
- Content container: 1120 px maximum, 24 px side padding.
- Footer: brand and one-line description, Product column, Project column, then "© 2026 Rafeeq. MIT licensed." and "Built by Ayoub Edahlouli".
- All pages are fluid and should work from phone width up. Sections wrap instead of using breakpoints.

## What reuses current copy and what is new

Reused from the current site, close to word for word: the hero headline and subtitle, the three pillars, the seven feature descriptions, the two installer cards, the getting-started steps, the offline verification text.

New, so each needs adding to every locale file:
- Home: the four feature-block headings and the short step list under "Verifiably offline", the closing call to action ("Get Rafeeq on a machine that has no internet."), and the two button labels around it.
- Features: the intro line above the "Good to know" list and its five items.
- Download: "Installing on a machine with no internet" with its three steps, the Requirements card, the "Verify your download" card.
- Docs: the "On this page" menu labels, the four mode cards in step 3, and the models-folder note.
- Nav and footer: the "Project" footer column label and its links.

## Placeholders to fill

These appear in square brackets in the design because the facts are not confirmed:
- Windows versions supported.
- Minimum RAM. Test on a real 8 GB machine before stating a number.
- SHA-256 checksums, published with each release.

Do not ship the brackets. Either fill them in or remove the card.

## The product window on Home

The window under the hero is a stand-in built from HTML. It shows the redesigned desktop app, which may not be built yet. Replace it with real screenshots (one dark, one light) of the shipped app, and do not publish the redesigned Home page before the app UI matches what it shows.

The chat content in that window is sample text.

## Not in the design

- The animated particle background that the current Home page has. The design is flat. Decide whether to keep a subtle version behind the hero or drop it.
- Language options other than English, and right-to-left (Arabic) layout. The design is left-to-right only.
- A mobile menu, a 404 page, privacy or terms pages.
- Per-locale page titles and descriptions for search engines.

## Known mismatch

The Features page says long documents are truncated to fit the model's context, which matches the current site. The desktop design mock says a document that does not fit is rejected. Decide which behavior is correct. If it truncates, the app should say so when it happens.

## Accessibility

Controls are at least 44 px tall, links and buttons are real elements, the language select has a label, and text colors were chosen for readable contrast in both themes. Keep that when porting. In the dark theme, accent-colored text uses `--accentFg`, not `--accent`.
