# Café Momo

The website for Café Momo, a coffee bar at Oude Kijk in 't Jatstraat 69 in
Groningen. Static Astro, no client framework, deployed to GitHub Pages at
<https://momo-cafe.nl>.

The site has one job: get someone through the door. The live open/closed line in
the hero is the highest-value element on the page.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into ./dist
npm run preview  # serve the built ./dist
```

`npm run build` **fails on purpose** until the KVK number and btw-id are filled
in — see [Before launch](#before-launch). For a pre-launch preview:

```sh
MOMO_ALLOW_PLACEHOLDERS=1 npm run build
```

## How it is put together

```
docs/
  momo-design-language.md   binding: every colour, type and motion decision
  BUILD-PROMPT.md           the original brief
src/
  content/site.json         business data, hours, hero, about, ui strings, privacy
  content/menu.json         the menu, transcribed from the printed cards
  lib/t.js                  t(field, locale) — the only place a locale key is read
  lib/hours.js              open/closed + day grouping, Europe/Amsterdam
  lib/content.js            content loaders, placeholder detection, map links
  lib/mascot.js             measured geometry of the mascot artwork
  styles/tokens.css         the whole design system, as custom properties
  components/               one component per element, all props-in
  layouts/Base.astro        head, header, footer, and the single client script
  pages/index.astro         nl at /
  pages/en/index.astro      en at /en/
  pages/privacy.astro       + en/privacy.astro
public/fonts/               self-hosted General Sans and Darumadrop One
public/CNAME                the custom domain, required in the build artifact
```

### Content

All copy lives in `src/content/*.json`. Components hardcode no visitor-facing
text; the only exception the brief allows is `aria-label` values. Every
translatable value is an object shaped `{ nl, en }`, which mirrors Sanity's
`localeString` pattern, so moving to a CMS later is a schema mapping rather than
a rewrite.

Read those values through `t(field, locale)` from `src/lib/t.js`. Nothing else
may index a locale key directly — that function is the seam.

### Internationalisation

Dutch is the default and unprefixed (`/`); English lives at `/en/`. The language
toggle links to the same page in the other locale, carries the current anchor
across, and restores the scroll position via `sessionStorage`.

### Hours and the live status

`src/lib/hours.js` is dependency-free and side-effect-free, because the same code
runs at build time and in the browser. The site is statically built, so a
build-time open/closed answer would be stale within the hour: the server renders
the collapsed week as the no-JavaScript fallback, and the client script
recomputes the live line in `Europe/Amsterdam` every minute. The status dot only
appears once that script has actually computed something.

`hours.exceptions` overrides the regular week for a single date, which is how the
café closes for a holiday. `announcement.active` plus a line of text is how the
owner announces a closure without calling anyone.

### JavaScript

One bundled module script, in `src/layouts/Base.astro`, doing three things: the
live status, the scroll reveal, and the language-switch scroll position. There is
no framework and no island. With scripting off, the page renders complete: hours,
menu, address and all copy. Under `prefers-reduced-motion: reduce` the page is
completely static.

The reveal start state is `opacity: 0`, gated on a `has-js` class set in `<head>`.
A failsafe there revokes the class after 2.5s if the module script never claims
it, so a blocked bundle can never leave the content invisible.

### Colour and contrast

`src/styles/tokens.css` holds the palette from the design language. Two tokens
are additions: `--glass-ink` and `--ply-deep`, the same hues darkened until body
text passes WCAG AA. The design document asserts that `--glass-deep` on `--paper`
passes AA; measured, it is 2.9:1, and `--paper` on `--ply` is 3.5:1. Fills, dots,
lines and hover states still use the original tokens.

## Deployment

`.github/workflows/deploy.yml` builds with
[`withastro/action`](https://github.com/withastro/action) on every push to `main`
and publishes with `actions/deploy-pages`. Two things in it are load-bearing:

- `node-version: 22` — Astro 7 requires Node >= 22.12 and the action defaults to 20.
- `MOMO_ALLOW_PLACEHOLDERS: '1'` — **delete this** once the KVK number and btw-id
  are real, so the guard protects the live site instead of being waved through.

`public/CNAME` must stay in the build artifact: that is how an Actions-based Pages
deploy claims the custom domain. Removing it reverts the site to
`momo-cafe.github.io`.

DNS for the apex domain: four `A` records on `@` to `185.199.108-111.153`, four
`AAAA` to `2606:50c0:800{0,1,2,3}::153`, and `www` as a `CNAME` to
`momo-cafe.github.io.`.

## Before launch

The build refuses to run while the legally required fields are placeholders. In
`src/content/site.json`, these must be confirmed with the owner:

- `business.legalName`, `business.legalForm`
- `business.kvk`, `business.btwId` — **these two fail the build** (a Dutch
  commercial website must show them)
- `business.email`, `business.phone` — the hero shows a tappable `tel:` link only
  once the phone number is real
- `business.mapsUrl` — falls back to a generated Google Maps search until then
- `about.body` — two or three sentences in the owner's own words

Also outstanding:

- **Photography.** `src/assets/gallery/*.jpg` and `src/assets/hero.jpg` are
  generated placeholders. Drop the real photos in over those filenames; Astro
  generates AVIF and WebP from whatever is there.
- **Allergens.** Every `allergens` array in `menu.json` is deliberately empty:
  the printed cards carry no allergen data, and guessing it is unsafe. The
  ask-at-the-bar notice satisfies the Dutch signposting requirement in the
  meantime. Per-item codes have to come from the owner's recipes.
- **Dutch food translations.** The food card was only photographed in English, so
  the `nl` values in that section need her sign-off.

## Out of scope

No reservations, no online ordering, no newsletter, no cookie banner, no dark
mode, no blog. There is no analytics, which is why there is no cookie banner; if
analytics is ever added it has to be a cookieless one, and then the banner
becomes mandatory.
