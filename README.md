# Café Momo

The website for Café Momo, a coffee bar at Oude Kijk in 't Jatstraat 69 in
Groningen. Static Astro, no client framework, deployed to GitHub Pages at
<https://momo-cafe.nl>.

The site has one job: get someone through the door. The live open/closed line in
the hero is the highest-value element on the page.

## Local development

Two apps live side by side, each with its own dependencies; the root
`package.json` only delegates. Run everything from the repo root:

```sh
npm run setup    # install web/ and studio/
npm run dev      # the site, http://localhost:4321
npm run studio   # the studio, http://localhost:3333
npm run build    # static build into web/dist
npm run preview  # serve the built web/dist
```

There is deliberately no npm workspace hoisting: Sanity's auto-updates need the
Studio to resolve its own React copy, and hoisting breaks that.

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
web/src/
  content/site.json         business data, hours, hero, about, ui strings, privacy
  content/menu.json         the menu, transcribed from the printed cards
  lib/t.js                  t(field, locale) — the only place a locale key is read
  lib/hours.js              open/closed + day grouping, Europe/Amsterdam
  lib/content.js            content loader (Sanity, JSON fallback), placeholders, map links
  lib/sanity.js             the build-time fetch, and the normalisation back to those shapes
  lib/mascot.js             measured geometry of the mascot artwork
  styles/tokens.css         the whole design system, as custom properties
  components/               one component per element, all props-in
  layouts/Base.astro        head, header, footer, and the single client script
  pages/index.astro         nl at /
  pages/en/index.astro      en at /en/
  pages/privacy.astro       + en/privacy.astro
web/public/fonts/           self-hosted General Sans and Darumadrop One
web/public/CNAME            the custom domain, required in the build artifact
scripts/seed-sanity.mjs     one-time push of web/src/content/*.json into the dataset
studio/                     the Sanity Studio, its own package, deployed on its own
package.json                root: delegating scripts + the seed script's client
```

### Content

All copy lives in `web/src/content/*.json`. Components hardcode no visitor-facing
text; the only exception the brief allows is `aria-label` values. Every
translatable value is an object shaped `{ nl, en }`, which mirrors Sanity's
`localeString` pattern, so moving to a CMS later is a schema mapping rather than
a rewrite.

Read those values through `t(field, locale)` from `web/src/lib/t.js`. Nothing else
may index a locale key directly - that function is the seam.

### Photos

Gallery photos are uploaded in the studio. The uploaded file is the source of
truth: the build fetches it from `cdn.sanity.io`, cropped around whatever focal
point was set with the crop tool, and Astro re-encodes it to AVIF and WebP like
any bundled asset. Visitors are therefore served photos from momo-cafe.nl, and
the built site does not depend on Sanity being reachable.

`galleryItem.filename` is the fallback for the three photos that shipped in the
repo before the studio existed. It only applies when nothing has been uploaded,
so new photos never need it. A photo with neither is skipped with a warning.

### Sanity

The same content also lives in Sanity (project `drw50awd`, dataset
`production`), edited in the studio under `studio/`. `web/src/lib/content.js` fetches
it once at build time and `web/src/lib/sanity.js` normalises the two singleton
documents back into exactly the shapes `web/src/content/*.json` have, which is why
no component knows a CMS is involved. If Sanity is unreachable, empty, or
`MOMO_CONTENT=local` is set, the build uses the JSON instead and logs which
source it used. The JSON is therefore both the fallback and the seed.

```sh
npm run setup                                          # both apps
npm --prefix studio exec sanity login                  # once, to edit content
npm run studio                                         # studio on :3333
npm run studio:deploy                                  # to <name>.sanity.studio

npm run seed -- --dry-run                              # what would be written
SANITY_WRITE_TOKEN=sk... npm run seed                  # one-time bootstrap
```

`studio/` is deliberately not part of the root package.json: the website builds
without ever installing the studio. See `.env.example` for the tokens.

### Internationalisation

Dutch is the default and unprefixed (`/`); English lives at `/en/`. The language
toggle links to the same page in the other locale, carries the current anchor
across, and restores the scroll position via `sessionStorage`.

### Hours and the live status

`web/src/lib/hours.js` is dependency-free and side-effect-free, because the same code
runs at build time and in the browser. The site is statically built, so a
build-time open/closed answer would be stale within the hour: the server renders
the collapsed week as the no-JavaScript fallback, and the client script
recomputes the live line in `Europe/Amsterdam` every minute. The status dot only
appears once that script has actually computed something.

`hours.exceptions` overrides the regular week for a single date, which is how the
café closes for a holiday. `announcement.active` plus a line of text is how the
owner announces a closure without calling anyone.

### JavaScript

One bundled module script, in `web/src/layouts/Base.astro`, doing three things: the
live status, the scroll reveal, and the language-switch scroll position. There is
no framework and no island. With scripting off, the page renders complete: hours,
menu, address and all copy. Under `prefers-reduced-motion: reduce` the page is
completely static.

The reveal start state is `opacity: 0`, gated on a `has-js` class set in `<head>`.
A failsafe there revokes the class after 2.5s if the module script never claims
it, so a blocked bundle can never leave the content invisible.

### Colour and contrast

`web/src/styles/tokens.css` holds the palette from the design language. Two tokens
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
`web/src/content/site.json`, these must be confirmed with the owner:

- `business.legalName`, `business.legalForm`
- `business.kvk`, `business.btwId` — **these two fail the build** (a Dutch
  commercial website must show them)
- `business.email`, `business.phone` — the hero shows a tappable `tel:` link only
  once the phone number is real
- `business.mapsUrl` — falls back to a generated Google Maps search until then
- `about.body` — two or three sentences in the owner's own words

Also outstanding:

- **Photography.** `web/src/assets/gallery/*.jpg` and `web/src/assets/hero.jpg` are
  generated placeholders. Gallery photos are best replaced by uploading them in
  the studio (see [Photos](#photos)); the hero still comes from the repo.
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
