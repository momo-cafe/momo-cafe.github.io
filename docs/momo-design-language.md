# Café Momo: design language

Oude Kijk in 't Jatstraat 69, Groningen. Coffee, matcha, breakfast and lunch.
Audience: students and locals within walking distance, plus people who found the
place on Instagram and want to know if it is open right now.

The site has one job: get someone through the door. Everything else is secondary.

---

## 1. The concept: glasblok

The bar is built from glass blocks. That single material already contains the
whole brief: it is a gradient, it is blurred, it is cool and metallic, and it is
built from a repeating grid of soft-cornered squares that echo the blobby
letterforms of the wordmark.

So the site does not use a decorative gradient. It uses the counter.

A grid of frosted squares sits behind the hero. Photographs and colour bleed
through it, diffused, the way you see the espresso machine through the bar. It is
the one bold element. Everything around it stays quiet: off-white, thin type,
lots of air, hard shadows like the ones the windows throw across the floor at
two in the afternoon.

Why this and not a mesh gradient: a mesh gradient would look like every other
café site built this year. The glass block is theirs. Nobody else has it.

---

## 2. Colour

Sampled from the interior photographs, not invented.

| Token | Hex | Where it comes from | Use |
|---|---|---|---|
| `--ink` | `#0F0F0E` | The wordmark | All type, the mascot line art |
| `--paper` | `#EFEDE8` | Micro-cement floor and walls | Page background |
| `--paper-lift` | `#F7F6F3` | Sunlit patches on the floor | Cards, raised surfaces |
| `--glass` | `#AFBDB8` | Glass block, cool green-grey | Glass grid, dividers |
| `--glass-deep` | `#7E8F8B` | Shadowed blocks at the bar end | Glass grid depth, hover states |
| `--ply` | `#A9714B` | The plywood back wall | Warm accent, section breaks |
| `--chrome` | `#C6CBCF` | Chair frames, La Marzocco panel | Metal gradients, borders |
| `--zon` | `#F2C31B` | The yellow bench out front | The one loud accent. CTAs only |

**Discipline rules**

- `--zon` appears at most twice per screen. It is a button colour and a status
  dot, never a background.
- Metal is a gradient, never a flat fill:
  `linear-gradient(150deg, #FFF 0%, #C6CBCF 38%, #8E969C 62%, #E4E7E9 100%)`.
  Use it on hairlines, the language toggle ring, and the top edge of a card.
  Never on type.
- `--ply` warms up long text sections so the page does not go cold. Use it as a
  block behind the story section, with `--paper` text on top.
- No pure white and no pure black anywhere.

---

## 3. Typography

Three roles. The custom face you are getting fills role one only.

**1. Wordmark: their blobby custom face.**
Ship it as `momo-wordmark.svg`, never as live text. Set the SVG to
`fill: currentColor` so it inverts on dark sections for free. Never stretch it,
never outline it, never put it on a busy photo. Minimum width 88px on mobile.

**2. Display and body: one soft, low-contrast grotesk, set light.**
The menu card already establishes the rule: everything lowercase, light weight,
generous letter-spacing. Follow it.

- Recommendation: **General Sans** or **Satoshi** (both free on Fontshare).
  Paid alternative if there is budget: **ABC Diatype** or **PP Neue Montreal**.
- Weights: 300 for display, 400 for body. Nothing bolder. The wordmark carries
  all the weight the page needs.
- Display sizes get `letter-spacing: -0.02em`. Body gets `0`.
- **Everything lowercase** except proper nouns: Groningen, Momo, the street name.
  This is the strongest existing brand cue they have. Do not break it for
  headings.

**3. Utility: tabular numerals for anything that lines up.**
Prices, opening hours, house numbers. Same family, `font-variant-numeric:
tabular-nums`, `letter-spacing: 0.04em`, `--glass-deep` as the colour. A price
column that does not align is the fastest way to make a menu look amateur.

**Scale** (mobile / desktop, `clamp()` between them)

```
display   2.75rem / 4.5rem    line-height 0.98
h2        1.75rem / 2.5rem    line-height 1.1
body      1.0625rem / 1.125rem line-height 1.55
utility   0.8125rem            line-height 1.4   uppercase off, tracked +0.04em
```

Body copy caps at 62 characters per line.

---

## 4. Photography: polaroids

The Instagram photos are already the right thing: hard directional light, real
plates, no styling. Do not filter them.

The polaroid frame is the container, and it is honest about being a physical
object:

- Aspect ratio 1:1.19 for the image, with a wider bottom border. Real polaroid
  proportions: `padding: 12px 12px 44px`.
- Background `--paper-lift`, not white.
- Radius 2px only. Polaroids have sharp corners.
- Shadow is hard and offset, matching the window light:
  `box-shadow: 6px 10px 0 rgba(15,15,14,0.07)`. No soft blurry glows.
- Each one sits at a small random rotation between `-2.5deg` and `2.5deg`. Seed
  the rotation from the array index so it is stable between page loads and does
  not jump around on hydration.
- Handwritten caption in the bottom border, in their hand-drawn marketing style
  if you can get a font of it, otherwise the grotesk at utility size.

On hover or tap, a polaroid straightens to `0deg` and lifts 3px. That is the
whole interaction.

---

## 5. The mascot

`momo-mascot.svg`: the woman in sunglasses with the iced coffee. She is the
personality valve for a page that is otherwise very restrained. Three uses, no
more:

1. **Footer, large.** She sits at the bottom left, elbow on the horizon line,
   and her table line becomes the top border of the footer. The drawing already
   has a horizontal line through it, so extend that line the full width of the
   viewport. This is the best use.
2. **Empty and closed states.** When the café is closed, she appears next to
   "we zijn nu gesloten". She is already slouching. It fits.
3. **Favicon,** cropped to her head and sunglasses.

She is `--ink` on `--paper`. Never coloured in, never given a gradient. The
hand-drawn line is the counterweight to all the glass and chrome, so keep it raw.

---

## 6. Motion

Restraint. Three moments, then stop.

1. **Load.** The glass grid fades its blur from 14px to 6px over 900ms while the
   wordmark scales from 0.97 to 1. Reads as focus pulling in through glass. Runs
   once.
2. **Scroll reveal.** Polaroids and menu rows arrive with 12px of travel and a
   40ms stagger. Spring, not ease: stiffness 180, damping 22 in Framer Motion
   terms.
3. **Hover.** Polaroid straightens. Buttons shift their metal gradient angle by
   20deg. Nothing else moves.

No parallax. No scroll-jacked sections. No looping ambient animation. A café site
that fights the scroll is annoying on a phone in the street.

`prefers-reduced-motion: reduce` kills all three. Content still renders at final
position.

**On Framer Motion in Astro:** it needs a React island, so it drags React into
the bundle for a mostly static site. Use CSS transitions plus one
IntersectionObserver for the reveals, which handles all three moments above in
about 30 lines and ships zero JavaScript framework. Reach for Framer Motion only
if you end up wanting real spring physics on a specific element. If you do, keep
it to a single `client:visible` island.

---

## 7. Layout

Mobile-first, single column, one page with anchor navigation. No route changes
except the language switch.

```
┌─────────────────────────┐
│ [momo]         nl | en  │  sticky, blurs the glass grid behind it
├─────────────────────────┤
│ ░░░░ glass block ░░░░░░ │
│ ░░  ● nu open tot 17:00 │  live status, computed from hours
│ ░░  koffie, matcha en   │
│ ░░  iets lekkers        │
│ ░░  [route]  [menu]     │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────┤
│  ma-vr  08:30 - 17:00   │  tabular, the most-visited block
│  za-zo  09:00 - 17:00   │
│  Oude Kijk in 't        │
│  Jatstraat 69           │
├─────────────────────────┤
│  koffie                 │
│  espresso        2,80   │  no photos here, just a clean price list
│  cappuccino      3,60   │
│  ...                    │
│  niet koffie            │
│  ...                    │
│  [allergenen]           │
├─────────────────────────┤
│   ▨ polaroid  ▨ polaroid│  horizontal scroll on mobile
├─────────────────────────┤
│  ░ ply block ░          │
│  over momo              │  short story, warm background
├─────────────────────────┤
│  ✎ mascot ────────────  │  her table line is the footer rule
│  kvk · btw · privacy    │
└─────────────────────────┘
```

The live open/closed status in the hero is the highest-value element on the page.
Someone standing on the Jatstraat at 16:50 wants exactly that. Compute it from
the hours JSON in Europe/Amsterdam, and let an `exceptions` array override it for
holidays so the owner can close the shop from her phone.

---

## 8. Quality floor

Not negotiable, not worth discussing in a design review.

- Hours, address and a tappable phone number reachable without scrolling.
- Menu as real HTML text. No PDF, no image of a menu.
- Address is a real link to Google Maps and Apple Maps.
- Focus rings visible, 2px `--ink` offset 2px. Do not remove outlines.
- Photos as AVIF with WebP fallback, `loading="lazy"` below the fold, explicit
  width and height so nothing shifts.
- Contrast: `--glass-deep` on `--paper` passes AA at body size. `--glass` does
  not, so it is for lines and fills only, never for type.
- Target: no layout shift, interactive under 1.5s on 4G.

---

## 9. What this deliberately is not

- Not a warm cream page with a big serif. That is the current default for every
  café and it would bury a brand this specific.
- Not a full-bleed video hero. It costs 4MB to say less than the status line.
- Not a mesh gradient. The glass block does the same job and it belongs to them.
- Not dark mode. The room is flooded with daylight. A dark site would be lying.
