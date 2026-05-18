# Gulchharre Design System

Last revised: **May 2026** (replaces the prior warm cream / gold / crimson system used by the Qala Chowk brand).

## Philosophy

Gulchharre runs on a strict **neutral + magenta/green duotone**. Black, white, and grey carry every structural surface and every word of body copy. Color appears only with intent:

- **Magenta `#D82788`** — commerce and affection. Used for prices, primary CTAs, italic editorial emphasis, the cart badge, active-link underlines, and hover affordances.
- **Green `#27D877`** — affirmation. Used for the active/“new” signal, scroll-progress lines, and as the third layer of the wordmark echo.

Every other moment on the page is neutral. The two accent hues stay loud precisely because they are rare.

The design language is editorial luxury (think Aesop, Acne, COS) crossed with the layered VIVID display-type echo of the Gulchharre wordmark — a heavy condensed Anton uppercase with a hard ink offset and a green shadow behind.

---

## 1. Color Tokens

All tokens are defined in `src/app/globals.css` on `:root`. They are also mirrored on `.qc-root` in `src/styles/design-system.css` for any document fragments that opt-in via that class.

### Brand duotone

| Token       | Hex       | Role                                                                 |
| ----------- | --------- | -------------------------------------------------------------------- |
| `--magenta` | `#D82788` | Prices, primary CTAs, italic emphasis, cart badge, active underline. |
| `--green`   | `#27D877` | Active/“new” badges, scroll line, third layer of the wordmark echo.  |

### Neutral system

| Token       | Hex       | Role                                                                 |
| ----------- | --------- | -------------------------------------------------------------------- |
| `--bg`      | `#FFFFFF` | Page background, navbar background, card background.                 |
| `--surface` | `#F5F5F5` | Tonal-break sections (Pillars, “Join the Circle”), card image wells. |
| `--ink`     | `#1A1A1A` | Headings, body text, icons on light surfaces, footer background.     |
| `--muted`   | `#6B6B6B` | Secondary text, marquee copy, descriptions, regional tags.           |
| `--border`  | `#E5E5E5` | Hairlines, dividers, input underlines.                               |
| `--on-dark` | `#FFFFFF` | Text and icons placed over dark surfaces (footer, hero scrim).       |

### Legacy aliases (kept for backwards compatibility)

| Old token         | Resolves to | Original meaning               |
| ----------------- | ----------- | ------------------------------ |
| `--s`, `--c`      | `--ink`     | Near-black                     |
| `--p`             | `--bg`      | Cream paper background         |
| `--l`             | `--surface` | Lighter paper                  |
| `--br`            | `--muted`   | Warm gray secondary text       |
| `--bo`            | `--border`  | Warm border                    |
| `--t`             | `--magenta` | Warm gold accent → now magenta |
| `--g`             | `--magenta` | Dark goldenrod price → magenta |
| `--btn`           | `--magenta` | Deep crimson CTA → magenta     |
| `--hover-outline` | `--green`   | Gold hover → green             |

You can continue using `var(--p)`, `var(--t)`, etc. in existing modules — they map to the new system automatically. New modules should reach for the semantic names (`--bg`, `--magenta`).

### Mantine integration

`src/theme.ts` exposes a `brand` color tuple anchored at `#D82788` (index 6 = primary). Mantine `<Button>`, `<Title>`, `<Input>`, and `<Modal>` are pre-configured to use the brand palette and CSS variables defined above.

### Status colors

| Token                     | Hex         | Use                                             |
| ------------------------- | ----------- | ----------------------------------------------- |
| `--color-danger`          | `#C0392B`   | Destructive actions, error states.              |
| `--wishlist-hover-bg`     | `#FDEAF2`   | Wishlist heart hover background (magenta tint). |
| `--wishlist-hover-border` | `--magenta` | Wishlist heart hover border.                    |

---

## 2. Color Application Rules

These are firm. Any new component should pass all of them.

1. **No warm tones.** No gold, no cream, no crimson, no terracotta. The previous palette is retired.
2. **Text on imagery is always white.** Hero copy, editorial-section headlines, scroll indicators, glass pills — all white (`var(--on-dark)` or `rgba(255,255,255,…)` for muted variants). The only color that may appear on top of imagery is white (and the magenta/green accents on text never touch image backgrounds).
3. **Backgrounds are only white, light grey, or black.** White for primary surfaces, `#F5F5F5` for tonal-break sections and card wells, ink black for the footer.
4. **Magenta is the only price color.** Prices, sale tags, total bars — all magenta.
5. **Magenta is the only primary-CTA color.** Subscribe, add-to-cart, place-order. Hover state lifts to ink with magenta underline (text CTAs) or stays magenta with white-text lift (filled CTAs).
6. **Green is rare.** Limit to: “New” product badges, the hero scroll-progress line, and the wordmark echo. Never on body copy, never on CTAs.
7. **Borders are always neutral.** Use `--border` for all hairlines. No tinted borders except the wishlist hover state.
8. **Don't use gradients for impact.** No gradient text on headings or metrics.
9. **The footer is the only dark surface.** It uses `--ink` as background and white-alpha for body text (`rgba(255,255,255,0.55)` for muted, full white for active/headings).

---

## 3. Typography

Loaded via `next/font/google` in `src/app/layout.tsx`. Each font is exposed as a CSS variable so it can be referenced from any module.

| Family                    | CSS variable                          | Role                                                     |
| ------------------------- | ------------------------------------- | -------------------------------------------------------- |
| **Anton**                 | `--font-anton`                        | Wordmark only — the VIVID echo. Uppercase, weight 400.   |
| **Cormorant Garamond**    | `--font-cormorant-garamond`           | Editorial headlines, prices, quotes, italic emphasis.    |
| **Playfair Display**      | `--font-playfair-display`             | Mantine `<Title>` default (legacy).                      |
| **DM Sans**               | `--font-dm-sans`                      | Labels, UI text, buttons, navigation, eyebrow text.      |
| **Inter**                 | `--font-inter`                        | Available for body/UI variants (from wireframe handoff). |
| **Kalam, Patrick Hand**   | `--font-kalam`, `--font-patrick-hand` | Available from wireframe handoff.                        |
| **Tiro Devanagari**       | `--font-tiro-devanagari`              | Hindi headlines.                                         |
| **Noto Serif Devanagari** | `--font-noto-serif-devanagari`        | Hindi body copy.                                         |

### Type roles

- **Wordmark / logo:** Anton uppercase, `letter-spacing: 0.02em`. Navbar 40px / footer 36px. Magenta fill with `text-shadow: -2px 2px 0 #1A1A1A, -4px 4px 0 var(--green)`. On dark backgrounds (footer) the middle shadow becomes white.
- **Section eyebrow:** DM Sans 12–13px, weight 600, uppercase, `letter-spacing: 0.25em`, color `--magenta`.
- **Section heading:** Cormorant Garamond 28–42px (clamp), weight 600, color `--ink`. Italics inside the heading take `--magenta`.
- **Body / paragraph:** Cormorant Garamond italic 15px for editorial copy; DM Sans 13–15px for UI copy. Light surfaces use `--ink` for primary copy and `--muted` for secondary; dark surfaces use white and `rgba(255,255,255,0.55–0.85)`.
- **Price:** Cormorant Garamond, color `--magenta`.
- **Nav links:** DM Sans 13px, weight 600, uppercase, `letter-spacing: 0.12em`, color `--muted`; hover → `--ink`; active → `--ink` with `border-bottom: 1px solid var(--magenta)`.

---

## 4. Layout & Spacing

| Token               | Value  | Use                                                |
| ------------------- | ------ | -------------------------------------------------- |
| `--navbar-height`   | `80px` | Fixed navbar height. Used by every sticky element. |
| `--pageTopMargin`   | `80px` | Default page-top padding to clear the navbar.      |
| `--space-section-x` | `64px` | Horizontal section gutter (desktop).               |
| `--space-section-y` | `88px` | Vertical section padding.                          |

Sections collapse to 24–32px gutters at the 1024px breakpoint.

### Radius scale

| Token           | Value |
| --------------- | ----- |
| `--radius-none` | `0`   |
| `--radius-sm`   | `2px` |
| `--radius-md`   | `4px` |
| `--radius-lg`   | `8px` |
| `--radius-full` | `50%` |

Cards (e.g. review cards) use 14px corners directly — that's a one-off and not in the scale because it pairs visually with the review-card aspect ratio.

### Transitions

| Token                 | Value       |
| --------------------- | ----------- |
| `--transition-fast`   | `0.2s ease` |
| `--transition-medium` | `0.3s ease` |
| `--transition-slow`   | `0.7s ease` |

---

## 5. Component Conventions

### Navbar (`src/components/navbar/Navbar.module.css`)

- Always opaque white with a neutral bottom border. No transparent-over-hero state.
- Height 80px, 48px horizontal padding (24px below 1024px).
- Logo wordmark: 40px Anton with full VIVID echo. Logo icon: 48px PNG with `mix-blend-mode: multiply` so it lays cleanly onto the white bar.
- Nav links: muted resting, ink hover, ink + magenta underline for the active page.
- Cart badge: 16px magenta circle, weight-600 white digit, sits at top-right of the cart icon.

### Footer (`src/components/footer/Footer.module.css`)

- Background ink `#1A1A1A`. Single dark surface in the system.
- Body text white at 55% alpha; hover lifts to magenta. Section headings (SHOP, SUPPORT…) sit in magenta at weight 600.
- Subscribe button: magenta text, neutral hairline underline; hover → white text with magenta underline.
- Logo echo middle layer flipped from ink to white for legibility on the dark bg.

### Reviews marquee (`src/components/reviews/ReviewsMarquee`)

- White section background. Cards are white with a neutral hairline border, light-grey image well.
- Stars: filled `#D82788` magenta, empty `#E5E5E5` neutral grey.
- Customer handle: magenta. Comment & name: ink. Product tag: muted.

### Homepage (`src/app/page.module.css`)

- White as the dominant ground. Pillars and “Join the Circle” use `--surface` for tonal break.
- Editorial sections with video/imagery have dark scrims (`rgba(0,0,0,…)`) and white text.
- Wishlist heart on product cards: white-alpha background; filled state uses magenta.
- "New" product badge: green.

---

## 6. What Changed From the Old System

| Area                 | Was                                | Now                                               |
| -------------------- | ---------------------------------- | ------------------------------------------------- |
| Page background      | Cream `#F6F3EC`                    | White `#FFFFFF`                                   |
| Card / image surface | Paper `#FDFBF6`                    | Light grey `#F5F5F5`                              |
| Secondary text       | Warm gray `#8A847B`                | Neutral grey `#6B6B6B`                            |
| Borders              | Warm `#D5D0C8`                     | Neutral `#E5E5E5`                                 |
| Accent / icons       | Warm gold `#C8956C`                | Magenta `#D82788`                                 |
| Price color          | Dark goldenrod `#B8860B`           | Magenta `#D82788`                                 |
| Primary CTA          | Deep crimson `#7D0531`             | Magenta `#D82788`                                 |
| Hover outline        | Gold `#B8860B`                     | Green `#27D877`                                   |
| Footer               | Cream, same as page                | Ink black `#1A1A1A`                               |
| Navbar               | Transparent over hero, cream solid | Always opaque white                               |
| Navbar height        | 64px                               | 80px                                              |
| Wordmark font        | Cormorant Garamond serif           | Anton uppercase with magenta+ink+green VIVID echo |

---

## 7. Files of Record

| File                                               | Purpose                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                              | Source of truth for the live CSS token set.                                                       |
| `src/styles/design-system.css`                     | Mirror palette + reusable utility classes (`.qc-eyebrow`, `.qc-headline`, etc.) under `.qc-root`. |
| `src/theme.ts`                                     | Mantine theme (brand color tuple, component defaults).                                            |
| `src/brand.config.ts`                              | Brand metadata consumed by invoices / metadata APIs.                                              |
| `src/components/navbar/Navbar.module.css`          | Navbar reference implementation.                                                                  |
| `src/components/footer/Footer.module.css`          | Footer reference implementation (only dark surface).                                              |
| `src/components/reviews/ReviewsMarquee.module.css` | Card pattern reference.                                                                           |
| `src/app/page.module.css`                          | Section, eyebrow, badge, scrim reference implementation.                                          |

---

## 8. When in Doubt

- **Need a color?** Pick `--ink`, `--muted`, `--border`, `--bg`, or `--surface`. If none of those work, ask whether the element is a CTA/price (→ `--magenta`) or an affirmation/new-state (→ `--green`).
- **Need to layer text on a photo?** White. Always.
- **Need a new container?** Reach for the existing utility classes in `design-system.css` (`.qc-eyebrow`, `.qc-headline`, `.qc-button-primary`, etc.) before writing fresh CSS.
- **Need a tone break between two adjacent sections?** Alternate `--bg` (white) and `--surface` (`#F5F5F5`). Don't introduce new shades.
