# Build prompt: Café Momo

Paste this into Claude Code from the root of the existing Astro project. Have
`momo-design-language.md`, `momo-wordmark.svg`, `momo-mascot.svg`,
`src/content/site.json` and `src/content/menu.json` in place first.

---

Build the website for Café Momo, a coffee bar at Oude Kijk in 't Jatstraat 69 in
Groningen. Read `momo-design-language.md` first and treat it as binding: every
colour, type and motion decision comes from it. Do not introduce colours or
typefaces that are not in that document.

## Stack

- Existing Astro project. Zero client-side framework unless a step below asks
  for one.
- Plain CSS with custom properties in a single `src/styles/tokens.css`. No
  Tailwind, no CSS-in-JS. The palette is small enough that a utility framework
  costs more than it saves.
- All content from the JSON files in `src/content/`. No copy hardcoded in
  components, with the sole exception of `aria-label` values.
- Static output. Deploys to Cloudflare Pages.

## Internationalisation

Dutch is the default and lives at `/`. English lives at `/en/`. Use Astro's
built-in i18n:

```js
// astro.config.mjs
i18n: {
  defaultLocale: 'nl',
  locales: ['nl', 'en'],
  routing: { prefixDefaultLocale: false }
}
```

Every translatable value in the JSON is an object shaped `{ nl, en }`. Write one
helper, `src/lib/t.js`, exporting `t(field, locale)` that returns
`field?.[locale] ?? field?.nl ?? ''`. Never index into a locale key directly in a
component. This helper is the seam that makes the Sanity migration cheap later.

The language toggle reads `nl | en`, sits top right, and links to the same
section on the other locale. Set `<html lang>` correctly and emit
`hreflang` alternates for both locales.

## Components to build

Each one in `src/components/`, each taking props and reading nothing from global
state.

1. **`Wordmark.astro`** Inlines `momo-wordmark.svg` so it inherits
   `currentColor`. Prop for width. Wrapped in a link to `/` on inner pages.

2. **`GlassGrid.astro`** The signature element. A CSS grid of soft-cornered
   squares, roughly 64px on mobile and 92px on desktop, each with a subtle
   inset highlight on its top-left edge so it reads as pressed glass rather than
   flat tiles. Sits behind the hero, absolutely positioned, `aria-hidden`. The
   hero image sits behind it at low opacity so colour bleeds through, diffused.
   Build this with `background-image` and gradients, not hundreds of DOM nodes.
   Must not cost layout shift.

3. **`OpenStatus.astro`** Computes open or closed from `site.hours` in the
   `Europe/Amsterdam` timezone, honouring the `exceptions` array. Renders a dot
   in `--zon` when open, `--glass-deep` when closed, and the matching string from
   `site.status` with `{time}` interpolated. This is the highest-value element on
   the page, so get the edge cases right: after closing time, before opening
   time, and a day with an empty hours array. Since the site is statically built,
   compute this client-side in a small inline script, and server-render the
   plain hours as the no-JavaScript fallback so the information is never missing.

4. **`Hours.astro`** Groups consecutive identical days into ranges, so the
   current data renders as `ma-vr 08:30-17:00` and `za-zo 09:00-17:00` rather
   than seven lines. Tabular numerals. Today's row is marked with `--ink` while
   the others sit at `--glass-deep`.

5. **`MenuList.astro`** Renders `menu.json` as real HTML. Section heading,
   then rows of name, optional note, allergen codes as small superscript letters,
   and a right-aligned price with tabular numerals and a leading `€` only in the
   section heading, not on every row. Rows with `highlight: true` get a small
   `--zon` dot before the name. Allergen codes link to the allergen block below.
   No photographs in this component. Never a PDF.

6. **`Allergens.astro`** Lists the codes used from `menu.allergenCodes` plus
   `menu.allergenNotice`. This satisfies the Dutch signposting requirement:
   allergen information must be freely accessible, legible and understandable.

7. **`Polaroid.astro`** Per the photography rules in the design language. The
   rotation must be derived from the item's index, not `Math.random()`, so it is
   stable across builds. `<picture>` with AVIF and a WebP fallback, explicit
   width and height, `loading="lazy"`.

8. **`Gallery.astro`** Horizontal scroll-snap row on mobile, a loose staggered
   grid on desktop. Not a carousel: no arrows, no dots, no autoplay.

9. **`Mascot.astro`** Inlines `momo-mascot.svg`. The footer treatment extends
   the drawing's own horizontal table line across the full viewport width as the
   footer's top rule. Get this right, it is the best detail on the page.

10. **`Footer.astro`** Contains, in `--glass-deep` at utility size: legal name,
    legal form, full address, email, KVK number, btw-id, and links to the privacy
    statement and the Instagram. The KVK number and btw-id are legally required
    on a Dutch commercial website, so render them from `site.business` and make
    them impossible to omit: if either value still contains the string
    `PLACEHOLDER`, fail the build with a clear message.

11. **`Announcement.astro`** Renders only when `announcement.active` is true and
    the text is non-empty. A single line in `--ply` with `--paper` text, directly
    below the header. This is how the owner announces a closure without calling
    anyone.

## Page

One page per locale, `src/pages/index.astro` and `src/pages/en/index.astro`,
sharing a single `src/layouts/Base.astro`. Section order exactly as the ASCII
wireframe in the design language document. Plus:

- `src/pages/privacy.astro` and its English twin. Plain text, no cookie banner
  needed because there is no analytics. If analytics is added later it must be a
  cookieless one, and then the banner becomes mandatory.

## Motion

Implement the three moments described in the design language with CSS
transitions plus one shared `IntersectionObserver` in a single inline script. Do
not install Framer Motion. Everything must be wrapped in a
`@media (prefers-reduced-motion: no-preference)` guard so reduced-motion users
get final positions with no animation.

## SEO and structured data

Emit a `LocalBusiness` JSON-LD block in the head, populated from
`site.business` and `site.hours`, with `@type: "CafeOrCoffeeShop"`,
`openingHoursSpecification`, `geo`, and `sameAs` pointing at the Instagram. This
is what makes the hours show up correctly in Google. Generate a sitemap covering
both locales.

## Acceptance criteria

Do not consider this done until all of these hold:

1. Opening hours, full address and a tappable phone link are visible on a
   375px-wide viewport without scrolling.
2. Switching to English and back preserves scroll position and never shows a
   Dutch string on the English page or vice versa.
3. The menu is selectable text. `Ctrl+F` for `pistache` finds it.
4. KVK number and btw-id are present in the footer on both locales.
5. Lighthouse on mobile: performance 95 or above, accessibility 100.
6. Zero cumulative layout shift, verified with the glass grid and all images in
   place.
7. Every interactive element is reachable by keyboard with a visible focus ring.
8. With JavaScript disabled, the hours and menu still render and the open/closed
   line degrades to the plain hours table.
9. `prefers-reduced-motion: reduce` produces a completely static page.

## Out of scope

No reservations, no online ordering, no newsletter, no cookie banner, no dark
mode, no blog. If any of these come up later they are separate work.
