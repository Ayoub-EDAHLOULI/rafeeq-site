# Rafeeq website redesign: build plan

Status: proposal. Nothing in `src/` or `messages/` has been changed. Each step below waits for your OK before I implement it.

This plan is based on `design/README.md`, `design/TOKENS.md`, the four previews in both themes, and the current code at commit `7364c93`. It was also checked against the desktop app source in `rafeeq-desktop` and the live 0.1.0 GitHub release.

---

## 1. Decisions you need to make

Each decision has my recommendation. Steps that depend on a decision say so.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Logo | (a) Keep the current `logo.png` mark. (b) Switch to the design's chat-bubble SVG on an accent tile. | (a), unless the desktop app adopts the new mark too. The site, the app icon, the favicon and the chat assistant should show the same mark. Switching only the site splits the brand. |
| D2 | Particle background on Home | (a) Keep it as it is, behind the hero and pillars. (b) Keep it behind the hero only, more subtle. (c) Drop it. | **(b).** See section 6.5. |
| D3 | Mobile navigation | (a) Let the nav wrap, as the design does. (b) Keep a menu button below about 768 px. | **(b).** At 390 px the design's seven items wrap into three rows above the hero. The current site already has a working menu, which I would restyle. |
| D4 | Arabic font | (a) IBM Plex Sans Arabic. (b) Noto Sans Arabic. (c) System font only. | **(a)**, weights 400/500/600. Hanken Grotesk has no Arabic glyphs, so without this Arabic text falls back to whatever the OS has, and weights won't match. Plex pairs well with a grotesk. |
| D5 | Digits in Arabic (step numbers, `01 02 03`, sizes) | (a) Eastern Arabic-Indic (١ ٢ ٣), as the current `ar.json` uses. (b) Western digits (1 2 3), as is common in Morocco. | Your call as the native speaker. Whichever you choose, I'll apply it everywhere through `Intl.NumberFormat`, instead of typing digits into strings. |
| D6 | Feature-block visuals on Home (the four small UI mockups) | (a) Build them in HTML, with every visible string in the locale files. (b) Use cropped screenshots. (c) Build them in HTML with only language-neutral content (file names, code, mode tabs) and no prose. | **(c), with one exception.** The Documents block needs a sample question and answer, so those two lines go into the locale files and are clearly marked as illustrative. HTML stays sharp in both themes and adds no screenshots. Note that the design's sample text (the code explanation and the "facility status" answer) is placeholder and will not be copied. |
| D7 | Product window before the redesigned app exists | (a) Placeholder frame until the redesigned app ships. (b) Screenshots of the *current* app now, replaced later. | **(b)** if the current UI looks presentable, otherwise (a). Both are honest. The HTML stand-in in the design must not ship (design/README already says this). |
| D8 | Docs "On this page" active state | (a) Static list, with no highlight. (b) Highlight the section currently in view (small IntersectionObserver, no dependency). | **(b).** It's about 30 lines in the existing client component. Without it, the highlighted first item in the design would be misleading. |
| D9 | Copy tweaks in the design that only reword existing text ("Setting up local RAG" → "Set up local RAG", "Verifying it's really offline" → "Verify it is really offline", em dashes removed from the subtitle and pillars) | (a) Adopt them, which means re-translating all six locales. (b) Keep the existing strings. | **(b).** The changes are cosmetic and the current translations are already reviewed. I'll only change strings where the design changes the *structure* (see section 4). |
| D10 | "Read the docs" (hero) and "Explore the docs" (closing CTAs) | Two strings, or one shared string. | **One** (`cta.docs` = "Read the docs"). Six fewer translations, and the same action has the same label everywhere. |
| D11 | Production domain | Needed for canonical links, `hreflang` alternates and Open Graph URLs. | Tell me the domain. Until then, step 12 adds per-locale titles and descriptions only. |
| D12 | Fonts: Google at build time, or files in the repo | (a) `next/font/google`: downloaded during `next build`, self-hosted, no browser request to Google. (b) `next/font/local` with the font files committed. | **(a)**, as long as your VPS has internet during the build. Pick (b) if you build in a restricted environment. |
| D13 | Arabic hero tagline | The design says "رفيق means 'companion' in Arabic". On the Arabic page this explains an Arabic word to Arabic readers. The current `ar.json` even keeps the English word "companion". | Write an Arabic-specific line (for example, a short phrase on what the companion does) and I'll keep the other five locales as designed. You should write or approve the Arabic yourself. |

---

## 2. Facts I checked, and what they change

### 2.1 Document truncation (Features "Good to know" item)

The site copy is **accurate**. The desktop app truncates; it does not reject.
- `rafeeq-desktop/src-tauri/src/documents.rs` truncates the extracted text to `CONTEXT_SIZE - RESERVED_TOKENS` = 4096 − 1024 = **3,072 tokens**. That keeps the beginning of the document, roughly 2,000 words.
- `ChatView.tsx:463-466` tells the user: "Document was too long and was truncated to fit the model's context."
- The "rejected" behavior in the desktop *design mock* is not what the shipped app does. If the redesigned app keeps truncating, the mock should be corrected. RAG mode is not affected, because it indexes documents in chunks.

Suggested sharper English for the "Good to know" item: *"Long documents are truncated. Only the beginning of a long document fits the model's context (about 2,000 words). Rafeeq tells you when this happens."*

### 2.2 Download links and sizes

- The design's download buttons point to the generic `/releases` page. **The current site links to the actual `.exe` files** (`download/page.tsx:30,37`), and that will stay. Release data moves into one file, `src/lib/release.ts`, so the next release is a one-file change.
- The real 0.1.0 files are: standard `.exe` 3.1 MB, starter `.exe` 482 MB (shown as ~460 MB in Windows), plus `.msi` versions of both. The design's "~3 MB" and "~460 MB" are correct.
- I recommend adding a small "Other formats (.msi) on GitHub" link under the cards, for company deployment. The design doesn't include it; it's one new string.

### 2.3 Placeholders: two of the three can be filled now

| Placeholder | Status | Plan |
|---|---|---|
| SHA-256 checksums | **Available now.** The GitHub API publishes a `digest` for every 0.1.0 file (for example, standard `.exe` `b80df16b…5b559`). | Store them in `release.ts` per file. Show the two `.exe` checksums in a copyable mono box, with a link to the release page for the MSIs. |
| Windows versions | Partly known. Tauri's installer needs WebView2. It ships with Windows 11 and Windows 10 (April 2018 / 1803 or later). Builds are x64 only. | Candidate text: "Windows 10 (1803 or later) or Windows 11, 64-bit". Confirm on a test VM first. |
| Minimum RAM | Not verified, as design/README says. The desktop README claims 8 GB minimum, 16 GB recommended. | Hide the row until you've tested on a real 8 GB machine. |

How brackets will never ship:
1. Every fact lives in `release.ts` as a typed value, or `null`. A requirements row or card with a `null` value **is not rendered**. Brackets never go into a locale file or a component.
2. A small `npm run check:copy` script (Node, no dependency) fails if any locale file or page contains `[`…`]` placeholder patterns such as `[to confirm]` or `[you]`. It is added in step 5 and can run before every build.

**Desktop-app risk (outside this site, but it affects what the site claims).** `tauri.conf.json` doesn't set `webviewInstallMode`, so the installer uses Tauri's default: it *downloads* the WebView2 bootstrapper when WebView2 is missing, and that needs internet. On an air-gapped machine that lacks WebView2 (old or stripped Windows 10 images), installation would fail. That contradicts the "no internet needed" message. Consider `offlineInstaller` or `embedBootstrapper` for the desktop build, and test on a clean offline VM. A related check: confirm the shipped llama.cpp binary doesn't require newer CPU instructions than AVX2, by testing on an older CPU.

The site assistant (`src/lib/assistant/prompt.ts`) states 8 GB RAM and AVX2 as facts. Once you decide what the Requirements card says, the assistant's knowledge must say the same thing. I'll flag it in the step where the card ships.

### 2.4 Contrast (WCAG AA), computed from the token values

| Pair | Dark | Light | Verdict |
|---|---|---|---|
| `text` on bg / panel / panel2 | 16.5 / 15.6 / 14.4 | 16.9 / 18.3 / 15.7 | Pass |
| `muted` on bg / panel / panel2 | 7.8 / 7.3 / 6.8 | 6.8 / 7.4 / 6.4 | Pass |
| `faint` on bg / panel / panel2 | 6.1 / 5.8 / 5.4 | 5.5 / 5.9 / 5.1 | Pass |
| `accentFg` on bg / panel / panel2 | 9.4 / 8.8 / 8.2 | 6.5 / 7.1 / 6.1 | Pass |
| `onAccent` (white) on `accent` | **4.5** | 6.2 | Passes, but only just in dark |
| `accent` used *as text* | **4.3** / 4.1 / 3.8 | 5.7 / 6.2 / 5.3 | **Fails in dark.** Never use `accent` for text. |
| `line` (borders) on bg / panel | 1.38 / 1.30 | 1.23 / 1.33 | Fine for decoration, but **too faint as the only visible edge of a form field** (WCAG 1.4.11 asks for 3:1) |

Consequences:
- The current code uses `text-primary` as a text color in 6 places (`DocsContent.tsx:27,71`, `download/page.tsx:91`, `page.tsx:29`, `ChatWidget.tsx:33`, `Footer.tsx:16`). All six move to `text-accent-fg` in step 1.
- Accent buttons must not get a hover effect that lightens them. The current `hover:opacity-90` darkens over the dark background, which is acceptable, but I'll replace it with an explicit hover color.
- Form fields (the language select and the assistant's input) get a stronger border. I'll add one token, `--line-strong`, used **only** for inputs. The values are dark `#5a6373` (3.2:1 on bg, 3.0:1 on panel) and light `#858d9b` (3.1:1 on bg, 3.3:1 on panel), both computed.
- `--danger` (kept from the current site) passes on panels: dark `#ff453a` 5.4:1 and light `#d92d20` 4.8:1. But light `danger` on the page background is **4.47:1**, just under AA. So error text stays on panel surfaces, which is where the assistant shows it today. Decorative borders keep `--line`.

### 2.5 Things the current site already gets right (keep them)

- `<html lang dir>` is set per locale (`[locale]/layout.tsx`).
- All six locale files have the same 87 keys.
- No component uses physical left/right classes yet.
- The chat widget already uses logical positioning (`inset-e-6`, `rtl:origin-bottom-left`).
- Animations respect `prefers-reduced-motion` (MotionProvider and ParticleField).
- The proxy matcher (`src/proxy.ts`) skips `/api`, `_next` and files, so no change is needed there.

### 2.6 Gaps the design doesn't mention

- **Theme flash.** `ThemeToggle` sets `data-theme` in a `useEffect`, after the first paint. Someone who chose light on a dark OS sees a dark flash on every load. It also has a lint error, `react-hooks/set-state-in-effect`. Next 16's own guide (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`) prescribes an inline `<head>` script plus `suppressHydrationWarning`. That's step 2.
- **Untranslated labels.** The language select (`aria-label="Select language"`) and theme toggle (`aria-label="Toggle theme"`) have hardcoded English labels, so screen-reader users hear English on every locale.
- **Missing metadata.** The Docs page has no meta description, and no page has `hreflang` alternates or a canonical URL.
- **The site assistant** (floating robot) isn't in the design. It must be restyled with the new tokens and must not cover the new footer columns on phones.
- **Unused fonts.** `globals.css` sets `font-family: Inter, …`, but Inter is never loaded, while the Geist fonts that *are* loaded are unused. The site currently renders in system fonts. Step 3 fixes this.

---

## 3. Mapping the design's tokens onto the current theme

The current mechanism stays as it is: `:root` holds the light values, `[data-theme="dark"]` the dark ones, and an `@media (prefers-color-scheme: dark)` block covers the first visit. I'll rename the design's camelCase tokens to kebab-case so they work with Tailwind v4's `@theme inline`.

| Design token | CSS var | Tailwind class root | Replaces current |
|---|---|---|---|
| `--bg` | `--bg` | `bg-bg` | `--background` |
| `--panel` | `--panel` | `bg-panel` | `--card` |
| `--panel2` | `--panel-2` | `bg-panel-2` | `--input-bg` |
| `--line` | `--line` | `border-line` | `--border` |
| (new) | `--line-strong` | `border-line-strong` | form fields only (2.4) |
| `--text` | `--text` | `text-text` | `--text` (new value) |
| `--muted` | `--muted` | `text-muted` | `--subtext` |
| `--faint` | `--faint` | `text-faint` | (new) |
| `--accent` | `--accent` | `bg-accent` | `--primary` (fills only) |
| `--accentFg` | `--accent-fg` | `text-accent-fg` | `--primary` used as text |
| `--onAccent` | `--on-accent` | `text-on-accent` | `text-white` |
| `--dot` | `--dot` | `bg-dot` | (new) |
| (kept) | `--danger` | `text-danger` | `--danger`. Not in the design but needed for the assistant's errors. Contrast checked in 2.4: use it on panels only. |
| (kept) | `--particle-color` | none | Set to `--accent-fg` values if D2 keeps the particles |

During steps 1 to 11, the old names (`background`, `card`, `subtext`, `primary`, `border`, `input-bg`) stay as **aliases** that point to the new variables. That way step 1 can re-theme the whole site without touching every component, and every later step leaves a working site. Step 13 removes the aliases.

---

## 4. Gap analysis per page

Legend: **(a)** visual only, **(b)** new or changed components and layout, **(c)** new copy for all six locales. Strings marked "reuse" already exist in all six files.

### 4.0 Shared: nav, footer, page shell

| Area | Exists | Change |
|---|---|---|
| Container | `max-w-5xl` (1024 px) with `px-6` | (a) 1120 px max with 24 px padding, as a `Container` component |
| Nav | Logo, Home, Features, Download, Docs, Download button, language, theme, plus a mobile menu (`nav.openMenu`/`closeMenu`) | (b) 72 px tall. Items: Features, Docs, GitHub, language, theme, Download button. Drop the "Home" and "Download" text links. 44 px targets. Keep the menu button below 768 px (D3). Add `aria-current` on the active link. (c) none, since "GitHub" is a proper noun and stays literal. `nav.home` becomes unused and is removed in step 13. |
| Language select | Native `<select>`, English `aria-label` | (a) 44 px, `line-strong` border. (c) `nav.language` = "Language" |
| Theme toggle | Works. Flashes on load. English `aria-label` | (b) No-flash script (step 2), and render a fixed-size placeholder instead of `null` so the nav doesn't shift. (c) `nav.theme` = "Switch light or dark theme" |
| Footer | One row: © year Rafeeq. MIT licensed. · Built by | (b) Brand block plus description, a "Product" column (Features, Download, Docs) and a "Project" column (GitHub, README), then the bottom row. (c) `footer.description`, `footer.product`, `footer.project`. "GitHub" and "README" stay literal. Reuse `footer.rights` and `footer.builtBy`. |
| Assistant widget | Floating robot, current tokens | (a) Restyle with the new tokens. Check it doesn't cover footer links at 390 px. |

### 4.1 Download

| Section | Exists | Change |
|---|---|---|
| Header | Title and subtitle | (a) Eyebrow plus page title scale. (c) Eyebrow reuses `nav.download`. |
| Two installer cards | Name, size, description, "Best for:", button with the **real `.exe` link** | (a)/(b) New card layout, "Best for" as a small label in an inset box, Windows glyph in the button. **Keep the real file links.** Data moves to `src/lib/release.ts`. Sizes are formatted per locale with `Intl.NumberFormat(…, {style:"unit", unit:"megabyte"})`, which gives "Mo" in French, for example. (c) `download.bestFor` currently includes a colon ("Best for:", "الأنسب لـ:", "适用场景："). It changes to a label without the colon in all six locales. |
| Installing on a machine with no internet | Not present | (b) Two-column band with a numbered list. (c) New: `download.offlineTitle`, `offlineIntro`, `offlineStep{1,2,3}Title`, `offlineStep{1,2,3}Body` (8 strings) |
| Requirements | Not present | (b) A `<dl>` card driven by `release.ts`, where `null` rows are hidden. (c) New: `requirementsTitle`, `reqOs`, `reqCpu`, `reqMemory`, `reqDisk`, plus value strings `reqCpuValue` ("CPU only. No GPU required.") and `reqDiskValue` ("~{size} for the app, plus each model you add."). The OS and memory values come from `release.ts`. Should the CPU row mention AVX2 (2013 or newer CPUs)? The desktop README requires it and the design omits it. I recommend adding it once confirmed. |
| Verify your download | Not present | (b) Card with copyable checksums (mono, `dir="ltr"`, `break-all`). (c) New: `verifyTitle`, `verifyBody`, `copy` / `copied` button labels |
| Footer note | "macOS and Linux builds are on the way. Source is available on GitHub." | (a) Moves inside the Verify card. Reuse `download.footer`. (c) New: `download.otherFormats` (the MSI link, section 2.2) |

### 4.2 Docs

| Section | Exists | Change |
|---|---|---|
| Header | Title only | (a) Eyebrow plus title. (c) Eyebrow reuses `nav.docs`. New: `docs.subtitle` ("From installer to first answer, in three steps."). design/README missed this. |
| "On this page" | Not present | (b) Side nav on desktop, stacked above the content on phones. Logical border (`border-s`), anchor ids, `scroll-margin-top`, active state (D8). (c) New: `docs.onThisPage`, plus short labels `navInstall`, `navModel`, `navChat`, `navRag`, `navOffline`, `navMore` (7 strings) |
| Step titles | `step1Title` = "1. Install Rafeeq", with the number **inside the string** in every locale (ar: "١. تثبيت رفيق") | (b) The number is rendered separately in mono accent (D5). (c) **Changed** in all six locales: remove the numbers from `step1Title` to `step3Title`, and split "(standard installer only)" out of `step2Title` into a new `docs.step2Note`. design/README says these are "reused"; they aren't, they need editing. |
| Step 2 sub-list (a/b/c) | `<ol>` with three items | (b) Bordered rows. Latin letters don't work for Arabic or Chinese, so I'll use the same numerals as D5 instead of a/b/c. |
| Models-folder note | Not present | (b) Inset box. (c) New: `docs.modelsFolderLabel` and `docs.modelsFolderHint`. The path stays literal in mono with `dir="ltr"`: `%LOCALAPPDATA%\com.ayoubedahlouli.rafeeq\models`. **Not** the design's `C:\Users\[you]\…`, which is a bracket placeholder (section 2.3). It's the correct standard-build path; the starter build ends in `.bundled`. |
| Step 3 mode cards | Not present | (b) Four small cards. (c) New: `modes.general`, `modes.code`, `modes.document`, `modes.rag` (shared with the Home visual, D6), plus four one-line descriptions (8 strings) |
| RAG, Offline, More | Present | (a) Restyle. Offline section gets the "Offline · no network calls" badge. (c) New: `common.offlineBadge`. Titles reuse the existing strings (D9). |
| Metadata | Title only | (c) Description reuses `docs.subtitle`. |

### 4.3 Features

| Section | Exists | Change |
|---|---|---|
| Header | Title and subtitle | (a) Eyebrow plus page title scale. Eyebrow reuses `nav.features`. |
| Seven cards | 2-column grid, title and description | (a)/(b) Rows of 2 / 3 / 2, a 44 px icon tile per card, and the "Verifiably offline" card highlighted with an accent border. Seven inline SVG icons (24 px grid, 1.75 stroke). (c) Reuse all 14 strings. |
| Good to know | Not present | (b) Two-column band with a bordered list. (c) New: `goodTitle`, `goodIntro`, and five title + body pairs (12 strings). Use the sharper truncation wording from section 2.1. |
| Closing CTA | Not present | (b) `CtaBox` component, reused by Home. (c) New: `features.ctaTitle` ("See it run with the network off."), `features.ctaBody`. Buttons reuse `download.downloadButton` and the shared `cta.docs` (D10). design/README missed this section. |

### 4.4 Home

| Section | Exists | Change |
|---|---|---|
| Hero | Tagline, animated title, subtitle, two buttons, particle background | (a) New type scale. (b) Tagline row with `رفيق` in a `dir="rtl"` span, plus a mono caption under the buttons. (c) **Changed** `home.tagline`, split into the Arabic word plus a meaning phrase, and Arabic-specific (D13). New: `home.caption` ("~3 MB installer · MIT licensed · macOS and Linux on the way"), built from parts so the size comes from `release.ts`. Buttons: reuse `download.downloadButton`; the shared `cta.docs` replaces `home.featuresCta` ("See what it can do"), which becomes unused. |
| Product window | Not present | (b) `ProductShot` image slot (section 5). (c) New: `home.shotAlt` (alt text) and `home.shotPlaceholder` (only for D7a) |
| Pillars band | "No API keys…" banner (bottom) and three highlight cards | (b) Moves directly under the product window, as a panel band with three numbered columns. (c) Reuse `bannerTitle`, `bannerSubtitle`, `highlight1-3Title/Description`. |
| Four feature blocks | Not present | (b) Alternating text and visual rows. **Build them in text-then-visual DOM order** and alternate with `md:flex-row-reverse`, *not* the design's `wrap-reverse`. That keeps screen-reader order sensible and mirrors correctly in RTL. Visuals per D6. (c) Eyebrows: reuse `features.managerTitle` and `features.offlineTitle`. New: `home.blockCodeEyebrow` ("Code help", which can reuse `modes.code`) and `home.blockDocsEyebrow` ("Documents"). New headings ×4, new Documents body ×1 (the other three bodies reuse the feature descriptions), new offline steps ×3, Documents sample question and answer ×2 (D6). Visual labels: `modes.*`, `common.offlineBadge`, `home.visualProfile` ("Profile"), `home.visualLoaded` ("Loaded"). design/README missed the Documents body and these visual labels. |
| Closing CTA | Not present | (b) Reuse `CtaBox`. (c) New: `home.ctaTitle`, `home.ctaBody`. Buttons are reused. |
| Animations | Stagger, word-by-word title (`AnimatedWords`), card hover lift | Keep the entrance animations but calmer: drop the blur on the hero title, which is the LCP element. Apply the same rise to the new sections. Reduced motion is already respected. |

### 4.5 Corrections to design/README "What reuses current copy and what is new"

- **Correct as listed:** the pillars, the seven feature descriptions, the installer cards, the RAG and offline text, the new Home headings, the offline steps, the Home CTA, Features "Good to know", Download offline/requirements/verify, Docs menu, mode cards, models note, and the footer "Project" label.
- **Missing from the "new" list:**
  - Features closing CTA (title and body).
  - Docs subtitle.
  - Home hero caption, and the docs-button label (it replaces "See what it can do").
  - Home Documents block body.
  - Labels inside the Home visuals.
  - Footer "Product" label and footer description.
  - Two accessibility labels (language and theme).
  - MSI link (if adopted).
  - Copy and copied labels.
- **Listed as "reused" but needing edits in all six locales:**
  - `docs.step1Title` to `step3Title`, because the numbers are inside the strings.
  - `docs.step2Title`, to split out the "(standard installer only)" part.
  - `download.bestFor`, to drop the trailing colon.
  - `home.tagline`, which is restructured and needs an Arabic-specific version.
- **Becoming unused (removed in step 13):** `nav.home`, `home.featuresCta`.
- **Rough total:** about 75 new strings × 6 locales, and 7 edited strings × 6 locales.

---

## 5. Product window: image slot and screenshots

The `ProductShot` component works like this:
- **Frame:** a frame with a fixed aspect ratio, so the image can't cause layout shift.
- **Two images:** one for each theme, both rendered through `next/image` (AVIF/WebP, responsive `sizes`), with the inactive one hidden via a `[data-theme]` CSS selector. Both download, which costs about 2 × 120–200 KB. Swapping images in JavaScript would avoid that, but it would flash or cause a hydration mismatch. A plain `<picture>` with `prefers-color-scheme` ignores the manual theme toggle. Both images are lazy-loaded below about 900 px viewport height and loaded eagerly on desktop, where the window is visible on load.
- **Alt text:** comes from the locale files. The images aren't mirrored in RTL, because the app's interface is English and LTR.
- **Placeholder (D7a):** the same frame, with a neutral skeleton (a title bar, a few grey bars) and one localized line "Screenshot coming soon". No fake chat.

**Screenshots I need from you**
- **Size:** the app's default window size (`tauri.conf.json`: 1180 × 760), captured at 200% display scaling, which gives **2360 × 1520 px** (an aspect ratio of about 1.553). That's sharp at the 1072 px display width on 2× screens.
- **Format:** PNG masters. Leave the compression to `next/image`.
- **Two shots, identical content:** `home-shot-dark.png` and `home-shot-light.png`, with the same conversation, the same model and the same window state. Only the theme differs.
- **Content:** a real, short exchange in **General** mode, with a real model loaded (name and quantization visible in the header) and the offline indicator visible. Use an honest question, for example about what Q4_K_M means. Nothing private, no personal file paths or usernames, no scrollbar mid-scroll.
- **Optional, only if you choose D6b:** four block crops at **1040 × 720 px** (2× of 520 × 360), in both themes: Code help, Model manager, Document, and the offline indicator.

The files go in `public/screens/` (or `src/assets/screens/` for static imports with automatic width and height; I recommend the latter).

---

## 6. Constraints checklist

### 6.1 i18n
- No visible string is written into a component. Exceptions: brand and proper nouns (Rafeeq, رفيق, GitHub, README, Windows), file names, paths, code and checksums.
- **For every step with new copy:** I write the English first, then draft the five other languages. Each drafted string is listed in my step summary as **"needs native review"**, and nothing is marked as reviewed until you approve. All six files keep the same keys; a parity check like the one I ran for this plan runs after each step.
- Numbers and sizes are formatted with `Intl.NumberFormat(locale)` according to D5, never typed into strings.

### 6.2 RTL (Arabic)

Parts of the design that assume left-to-right, and the fix for each:

| Design detail | Fix |
|---|---|
| Docs menu `border-left` | `border-s` |
| Step number `margin-right: 12px` | `me-3` |
| Chat bubble radii `16px 16px 4px 16px` / `4px 16px 16px 16px` | `rounded-ss-sm` / `rounded-se-sm` (the assistant widget already does this) |
| Product window sidebar `border-right` | Inside the screenshot, so nothing to do. If built as HTML, `border-e`. |
| Alternating rows with `wrap-reverse` | `md:flex-row-reverse` with text first in the DOM (section 4.4) |
| `align-self: flex-end` user bubbles | Flex alignment follows the writing direction, so these mirror correctly on their own |
| File names, paths, `Q4_K_M`, code, checksums, the "~3 MB" caption | Wrap in `dir="ltr"` / `<bdi>`, so the punctuation and slashes don't reorder |
| Arrows | None in the design. Any added later (for example "→ GitHub") go through a mirrored icon component. |

Every step's verification includes `/ar` at 390 px and 1440 px.

### 6.3 Fonts
- `next/font/google` for Hanken Grotesk (400/500/600, latin + latin-ext), JetBrains Mono (400/500) and IBM Plex Sans Arabic (D4: 400/500/600, `arabic` subset, `preload: false`, so non-Arabic pages don't fetch it).
- All are downloaded at build time and served from your own domain. The browser makes no request to Google (Next docs, `03-api-reference/02-components/font.md`).
- Chinese uses the system stack (`"PingFang SC", "Microsoft YaHei", "Noto Sans SC"`), because a CJK web font is several MB.
- The unused Geist fonts and the broken `Inter` declaration are removed.

### 6.4 Theme persistence without a flash

These steps follow the Next 16 guide named in 2.6:
1. **Inline script:** an inline `<head>` script in `[locale]/layout.tsx` reads `localStorage["rafeeq-site-theme"]` (the existing key) and sets `data-theme` before the first paint. It's wrapped in try/catch.
2. **Hydration:** `suppressHydrationWarning` on `<html>`.
3. **Toggle:** `ThemeToggle` reads the current attribute instead of guessing. That also fixes the existing lint error.
4. **Mobile browser bar:** add a `theme-color` meta tag per theme.

### 6.5 Particle background (D2)

| Option | Performance | Fit with the design | Reduced motion |
|---|---|---|---|
| (a) Keep as it is | About 106 + 53 particles and their pair checks per frame, at 60 fps, while visible. It already pauses when off-screen or when the tab is hidden. | Poor. It would run behind the product window and pillars, and the design is flat. | Already static |
| (b) **Hero only, subtle** | About half the cost: the hero area is roughly 40% of today's canvas, and the alpha is lowered. It stops entirely once the hero scrolls away. | Good. It gives some life behind the headline and ends where the product window starts. | Already static |
| (c) Drop it | Zero cost, and removes about 9 KB of JavaScript | Exact match | n/a |

**I recommend (b).** The particles set Rafeeq apart from other local-LLM sites, and confined to the hero they don't compete with the product window. If they look busy next to the window once built, (c) is a one-line change. The color comes from `--accent-fg`, so it follows the theme.

### 6.6 Metadata
- Every page already has a localized title through `generateMetadata`. Step 12 adds the Docs description, plus `alternates.languages` (hreflang for all six locales and `x-default`), a canonical URL and Open Graph title/description per locale. The last three wait on the domain (D11).

### 6.7 Mobile nav (D3)
- **Below 768 px:** logo, Download button and menu button. The menu holds Features, Docs, GitHub, language and theme.
- **Behavior:** Escape and choosing a link both close the menu, and focus returns to the button. `aria-expanded` and `aria-controls` are set.
- **Placement:** no layout shift, and 44 px targets. The Download button stays visible because it's the main action.

---

## 7. Ordered build plan

Every step:
- leaves the site building (`npm run build`), passing lint on the files it touches, and deployable;
- keeps the six locale files at the same keys;
- is verified by hand in **dark and light**, **`/en` and `/ar`**, at **390 px and 1440 px**;
- ends with me telling you how to verify it, and a commit message for you to paste. I don't run `git commit`.

The order follows your suggestion, with three changes:
- **Theme persistence becomes its own step 2.** It's independent and makes every later screenshot review reliable.
- **Download comes before Docs.** It introduces `release.ts` and the copy check, which later steps reuse.
- **Home is split into hero/pillars/CTA and feature blocks.** The blocks are the largest piece of copy.

**Features stays before Home** because it introduces the `CtaBox` component that Home reuses.

---

### Step 1. Design tokens and theme variables
- **Goal:** the whole site switches to the new palette, with no layout changes.
- **Files:** `src/app/[locale]/globals.css`; the 6 `text-primary` → `text-accent-fg` uses; `text-white` → `text-on-accent` in `Nav.tsx`, `page.tsx`, `download/page.tsx` and `ChatWidget.tsx`; `ParticleField` fallback color.
- **Acceptance:** colors match TOKENS.md in both themes. No raw hex remains in components (`grep` shows hex only in `globals.css`). Accent text uses `accent-fg`. The assistant widget is readable in both themes.
- **Verify:** toggle the theme on every page and compare against `design/preview/{dark,light}`. Check that the first visit follows the OS theme. Open the assistant and trigger an error to see the `danger` color on the new panel.
- **Risks:** the aliases hide old names that are still in use (removed in step 13). Light `danger` must stay on panel surfaces (2.4).
- **Commit:** `Adopt redesign color tokens with aliases for existing classes`

### Step 2. Theme persistence without flash
- **Goal:** the saved theme applies before the first paint, and the toggle is accessible and lint-clean.
- **Files:** `src/app/[locale]/layout.tsx`, `src/components/ThemeToggle.tsx`, `messages/*.json` (`nav.theme`).
- **Acceptance:** with "light" saved and a dark OS, a hard reload shows no dark frame. Same the other way round. No hydration warning in the console. `npx eslint src` no longer reports `ThemeToggle.tsx:22`.
- **Verify:** DevTools → Performance → reload with 6× CPU throttling and inspect the first frames. Set OS dark, choose light, then reload, switch locale and navigate. Use a screen reader or the accessibility tree to check the toggle label in `/ar`.
- **Risks:** an inline script and a future strict Content Security Policy (none exists today). Hydration mismatch if the toggle renders theme-specific markup on the server, so it will render a fixed-size neutral button.
- **Commit:** `Apply saved theme before first paint and localize toggle label`

### Step 3. Fonts
- **Goal:** Hanken Grotesk, JetBrains Mono and the Arabic font (D4), self-hosted. Type tokens (`font-sans`, `font-mono`) in `@theme`.
- **Files:** `src/app/[locale]/layout.tsx`, `globals.css`.
- **Acceptance:** the Network tab shows font files served from `/_next/static/media/` only, with no `fonts.googleapis.com` or `gstatic` requests. Latin text is in Hanken, mono labels in JetBrains Mono, Arabic in Plex Sans Arabic, Chinese in a system font. Fallbacks are size-adjusted, so there's no visible layout shift.
- **Verify:** hard reload `/en`, `/ar`, `/zh` with cache disabled and check the Network tab filtered by "font". Lighthouse CLS stays at or near 0.
- **Risks:** the build needs internet (D12). Arabic and Latin metrics differ, so check line heights in `/ar`.
- **Commit:** `Self-host Hanken Grotesk, JetBrains Mono and an Arabic companion font`

### Step 4. Nav, footer and shared primitives
- **Goal:** the new header and footer on every page. Introduces `Container`, `Button` (primary and secondary, as link or anchor), `Eyebrow`, the icon set and the Windows glyph.
- **Files:** `Nav.tsx`, `Footer.tsx`, `LocaleSwitcher.tsx`, new `src/components/ui/*`, `messages/*.json` (`nav.language`, `footer.description`, `footer.product`, `footer.project`).
- **Acceptance:** 72 px nav with the design's items. Below 768 px, the menu (D3) behaves as in 6.7. The active page is marked with `aria-current`. 44 px targets and a visible 2 px `accent-fg` focus ring. The footer has its columns, and the assistant button doesn't cover footer links at 390 px. The logo follows D1.
- **Verify:** Tab through the nav in both themes. Open and close the mobile menu with the keyboard and with Escape. In `/ar`, the logo sits on the right and the Download button on the left, and the footer columns mirror.
- **Risks:** the language-switch route logic in `LocaleSwitcher` must stay unchanged; only styles and the label change.
- **Commit:** `Rebuild nav and footer on the redesign layout`

### Step 5. Download page
- **Goal:** the designed Download page with real links and no placeholders.
- **Files:** `download/page.tsx`, new `src/lib/release.ts`, new `scripts/check-copy.mjs` plus a `check:copy` npm script (no dependency), `messages/*.json` (about 18 new strings and the `bestFor` edit).
- **Acceptance:**
  - Both buttons still download the exact `.exe` files. The links match the current ones.
  - Sizes come from `release.ts` and are formatted per locale.
  - The checksums are the real GitHub digests and can be copied.
  - The Windows row shows only once you've confirmed it, and the RAM row stays hidden until you've tested it.
  - The MSI link goes to the release page.
  - `npm run check:copy` passes, and fails if you put `[to confirm]` in any locale.
- **Verify:**
  - Click both buttons and confirm the file names.
  - Copy a checksum and compare it against `Get-FileHash` on the downloaded file.
  - In `/ar`, checksums and sizes must read left to right without punctuation jumping.
  - At 390 px, the cards stack and the requirements `<dl>` doesn't overflow.
- **Risks:** someone edits a link in the page instead of in `release.ts`. Mitigation: the page imports links only from `release.ts`.
- **Also:** update `prompt.ts` (the assistant's knowledge) so its requirements match the card.
- **Commit:** `Redesign Download page with release data, requirements and checksums`

### Step 6. Docs page
- **Goal:** the designed Docs page with the "On this page" menu.
- **Files:** `docs/DocsContent.tsx`, `docs/page.tsx` (description), `messages/*.json` (about 20 new strings and the step-title edits).
- **Acceptance:**
  - On desktop, the menu sits beside the content. On phones it's stacked above it.
  - Anchor links scroll to each section without hiding the heading under the nav, and the active item follows the scroll position (D8).
  - Step numbers are rendered separately (D5).
  - The models-folder path is correct, in `dir="ltr"` mono, with no brackets.
  - The four mode cards and the offline badge are shown.
- **Verify:** click each menu link, then scroll back up and check the highlight. Use the keyboard. In `/ar`, the menu border is on the right. Check the `/zh` step titles no longer start with "1.".
- **Risks:** splitting the numbers out of six translated titles. I'll show you each before and after.
- **Commit:** `Redesign Docs page with section menu and mode overview`

### Step 7. Features page
- **Goal:** the designed Features page.
- **Files:** `features/page.tsx`, new `src/components/CtaBox.tsx`, icon additions, `messages/*.json` (about 14 new strings).
- **Acceptance:** cards in rows of 2/3/2 with icons; the offline card has an accent border. The "Good to know" band uses the accurate truncation wording (2.1). The closing CTA has the real Download link and the docs link.
- **Verify:** at 1440 px, the rows match the preview. At 390 px, everything stacks in one column. Compare both themes against the previews. In `/ar`, the icon tiles sit at the start (right) of the cards.
- **Commit:** `Redesign Features page with good-to-know list and closing CTA`

### Step 8. Home: hero, pillars band and closing CTA
- **Goal:** the Home page structure without the product window or feature blocks. The particle background follows D2.
- **Files:** `src/app/[locale]/page.tsx`, `ParticleField.tsx` (D2 changes), `motion/Reveal.tsx` (calmer hero), `messages/*.json` (tagline restructure, `home.caption`, `cta.docs`, `home.ctaTitle`, `home.ctaBody`).
- **Acceptance:** the hero matches the preview's type scale. `رفيق` shows correctly, and in `/ar` the tagline is the Arabic-specific line (D13). The caption's size comes from `release.ts`. The pillars band sits under the hero (with a slot reserved for the window). The CTA box is reused from step 7. With reduced motion, everything is static, including the particles.
- **Verify:** both themes and both locales. Emulate reduced motion in DevTools. In the Performance panel, check the particle loop stops once the hero is scrolled away. Lighthouse LCP on `/en` is not worse than before this step.
- **Risks:** LCP changes if the title animation changes. I'll measure before and after.
- **Commit:** `Rebuild Home hero, pillars band and closing call to action`

### Step 9. Home: four feature blocks
- **Goal:** alternating text and visual rows with the D6 visuals.
- **Files:** `src/app/[locale]/page.tsx`, new `src/components/home/BlockVisual*.tsx`, `messages/*.json` (about 15 new strings, including the illustrative Documents Q&A).
- **Acceptance:** text comes first in the DOM in every row. The rows alternate on desktop and stack text-then-visual on phones. In `/ar`, the alternation mirrors. Mono samples (code, file names) read left to right inside the RTL page. No design sample prose is hardcoded.
- **Verify:** check with a screen reader or the accessibility tree that each block reads eyebrow → heading → body → visual. 390 px and 1440 px, both themes.
- **Commit:** `Add Home feature blocks with localized product visuals`

### Step 10. Home: product window
- **Goal:** the `ProductShot` image slot, as described in section 5.
- **Files:** new `src/components/home/ProductShot.tsx`, `src/assets/screens/*` (your screenshots, or the placeholder per D7), `page.tsx`, `messages/*.json` (`home.shotAlt`, optionally `home.shotPlaceholder`).
- **Acceptance:** the correct image shows for each theme, and toggling the theme swaps it instantly. No layout shift (CLS ≈ 0). Without screenshots, the placeholder shows and no fake chat text appears. The images are served through `next/image` as AVIF or WebP.
- **Verify:** toggle the theme. Check the Network tab for the image formats and sizes. Hard reload on a 390 px phone, where the window loads lazily. Read the alt text in `/ar`.
- **Risks:** both images download (section 5). Don't publish the redesigned Home with the *redesigned-app* screenshots before the app UI matches (design/README).
- **Commit:** `Add theme-aware product screenshot slot to Home`

### Step 11. Assistant widget and leftover polish
- **Goal:** the assistant uses the new tokens, fonts and `line-strong` input border, and its position works with the new footer. A full RTL and contrast pass across all pages.
- **Files:** `components/assistant/ChatWidget.tsx`, small fixes found in the pass.
- **Acceptance:** the widget matches the design language in both themes. The input border meets 3:1. Nothing overlaps at 390 px.
- **Commit:** `Restyle site assistant to match the redesign`

### Step 12. Per-locale metadata
- **Goal:** complete titles and descriptions per locale, plus hreflang, canonical and Open Graph once the domain is known (D11).
- **Files:** `[locale]/layout.tsx`, the four `page.tsx` files, `messages/*.json` (meta descriptions where missing).
- **Acceptance:** view-source on each page in each locale shows a localized `<title>` and `<meta name="description">`. With a domain, there are 7 `<link rel="alternate" hreflang>` entries and one canonical URL.
- **Verify:** `curl -s http://localhost:3000/ar/docs | grep -E "<title>|description|hreflang"`.
- **Commit:** `Add localized metadata and language alternates`

### Step 13. Cleanup
- **Goal:** remove the token aliases, unused keys (`nav.home`, `home.featuresCta`, anything else that's orphaned) and the old `max-w-5xl` container.
- **Files:** `globals.css`, `messages/*.json`, any component still using an alias.
- **Acceptance:** `grep` finds no alias class names. The locale parity check passes with no unused keys. The build, lint and `check:copy` all pass.
- **Commit:** `Remove legacy theme aliases and unused copy`

---

## 8. Things in the design I'd push back on

1. **Download buttons pointing to the generic `/releases` page** would make every download one click longer and hide which file is which. Keep the direct links (section 2.2).
2. **`C:\Users\[you]\…` in Docs** is a placeholder in disguise. Use `%LOCALAPPDATA%\…` (section 4.2).
3. **No mobile menu.** A wrapping nav at phone width pushes the hero below the fold (D3).
4. **`wrap-reverse` alternation** puts the visual before the text for screen readers on half the rows (section 4.4).
5. **Letters a/b/c in Docs** have no natural equivalent in Arabic or Chinese (section 4.2).
6. **"رفيق means 'companion' in Arabic"** doesn't make sense on the Arabic page (D13).
7. **The CPU row says only "CPU only. No GPU required."** The README requires AVX2. Omitting it invites failed installs on old machines, once it's confirmed.
8. **The product window's HTML stand-in** shows sample text styled as real output. It must stay a design artifact (section 5).
9. **Minor:** the Docs preview shows a broken character in the offline badge ("Offline � no network calls"). It's an encoding error in the export; the intended separator is "·".
