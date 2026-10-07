# Design tokens (website)

Same colors and fonts as the desktop app redesign, so site and app match. Values are exact. Names are suggestions.

## Colors

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0a0c10` | `#f5f6f8` | Page background, inset boxes inside cards |
| `--panel` | `#11141a` | `#ffffff` | Cards, closing call-to-action box, alternating section bands |
| `--panel2` | `#181c24` | `#eceef2` | Icon tiles, pills, code highlights |
| `--line` | `#252b36` | `#dcdfe6` | Borders and dividers |
| `--text` | `#e9ecf1` | `#12151b` | Headings and primary text |
| `--muted` | `#9ba4b3` | `#4d5666` | Body copy, inactive links |
| `--faint` | `#8791a1` | `#5b6575` | Small labels, metadata |
| `--accent` | `#2f6fed` | `#2257d6` | Buttons, user chat bubbles, active tabs |
| `--accentFg` | `#8ab4ff` | `#1d4fc4` | Accent used as text, eyebrow labels, links |
| `--onAccent` | `#ffffff` | `#ffffff` | Text on accent fills |
| `--dot` | `#4ade80` | `#15803d` | "Model loaded" dot in product visuals |

Rules:
- White text on `--accent` meets 4.5:1 in both themes. Do not lighten the fill.
- Use `--accentFg`, not `--accent`, for accent-colored text.
- Cards use a 1 px `--line` border and no shadow. A highlighted card uses a 1 px `--accent` border.
- Alternating sections use the `--panel` band with a 1 px `--line` border on top and bottom.

## Typography

- Body: Hanken Grotesk 400, 500, 600. Fallback `system-ui, sans-serif`.
- Mono: JetBrains Mono 400, 500, for file names, sizes, numbers and labels. Fallback `monospace`.
- Load both with `next/font` so they are self-hosted at build time.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero title | `clamp(38px, 6vw, 68px)` | 600 | line-height 1.04, letter-spacing -0.035em |
| Page title (Features, Download, Docs) | `clamp(34px, 5.5vw, 60px)` | 600 | line-height 1.05, letter-spacing -0.035em |
| Section title | `clamp(30px, 4vw, 44px)` | 600 | line-height 1.1, letter-spacing -0.03em |
| Feature block title | 32 px | 600 | line-height 1.15, letter-spacing -0.025em |
| Card title | 22 to 26 px | 600 | letter-spacing -0.02em |
| Lead paragraph | 20 px | 400 | line-height 1.55, `--muted` |
| Body | 16 to 18 px | 400 | line-height 1.5, `--muted` for secondary |
| Eyebrow label | 13 px | 600 | uppercase, letter-spacing 0.08em, `--accentFg` |
| Small label | 12 px | 600 | uppercase, letter-spacing 0.08em, `--faint` |
| Mono caption | 13 px | 400 | `--faint` |

## Layout and spacing

- Container: max-width 1120 px, centered, 24 px side padding.
- Section padding: 72 to 96 px top and bottom on desktop.
- Nav height: 72 px minimum. Footer top padding: 56 px.
- Gaps: 20 px between cards, 40 to 64 px between a text column and a visual.
- Two-column rows are `display: flex; flex-wrap: wrap` with each side `flex: 1 1 380px` to `420px`, so they stack on narrow screens. Alternating rows use `wrap-reverse` so the visual comes second on phones.

## Controls

- Primary button: height 52 px, padding 0 26 px, radius 12 px, accent fill, 17 px 600 text.
- Secondary button: same size, 1 px `--line` border, `--panel` fill, 500 weight.
- Nav links and nav button: height 44 px. Nav button radius 10 px.
- Select and theme toggle: 44 px.
- Visible focus ring on every control: 2 px solid `--accentFg`, 2 px offset.

## Radii

| Radius | Use |
|---|---|
| 6 px | Inline code chips |
| 9 to 10 px | Nav button, select, logo mark |
| 12 px | Buttons, icon tiles, inset boxes |
| 16 to 18 px | Cards and product visuals |
| 20 px | Closing call-to-action box |
| 999 px | Pills |

## Icons

Inline SVG, 24 px grid, stroke `currentColor`, stroke width 1.75, round caps and joins. Sizes: 22 px in feature tiles, 18 px in buttons, 14 to 16 px inline. No emoji. The Windows logo glyph is a filled four-pane shape.

## CSS variables

```css
:root {
  --bg: #0a0c10; --panel: #11141a; --panel2: #181c24; --line: #252b36;
  --text: #e9ecf1; --muted: #9ba4b3; --faint: #8791a1;
  --accent: #2f6fed; --accentFg: #8ab4ff; --onAccent: #ffffff; --dot: #4ade80;
}
[data-theme="light"] {
  --bg: #f5f6f8; --panel: #ffffff; --panel2: #eceef2; --line: #dcdfe6;
  --text: #12151b; --muted: #4d5666; --faint: #5b6575;
  --accent: #2257d6; --accentFg: #1d4fc4; --onAccent: #ffffff; --dot: #15803d;
}
```

Map these into the site's existing theme setup and keep its current light/dark mechanism. Components should use the tokens, never raw hex values.
