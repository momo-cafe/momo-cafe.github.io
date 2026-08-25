## Layout

This is a monorepo with two independent apps side by side:

```
web/      the Astro site (deployed to GitHub Pages at momo-cafe.nl)
studio/   the Sanity Studio (deployed on its own to <name>.sanity.studio)
scripts/  one-off content ops, e.g. seeding the dataset from web/src/content
docs/     the design language and the original brief
```

Each app owns its own `package.json` and `node_modules`. There is deliberately
**no** npm workspace hoisting: the Studio has to resolve its own React copy for
Sanity's auto-updates to work, which hoisting breaks. The root `package.json`
carries no runtime dependencies - only convenience scripts that delegate with
`npm --prefix`, plus `@sanity/client` as a devDependency, because
`scripts/seed-sanity.mjs` lives at the root and has to resolve it from there.

## Development

Run everything from the repo root:

```sh
npm run setup          # install both apps
npm run dev            # the site on :4321
npm run studio         # the studio on :3333
npm run build          # static build into web/dist
npm run studio:deploy  # publish the studio
npm run seed           # push web/src/content/*.json into the dataset
```

`npm run build` fails on purpose while the KVK number and btw-id are still
placeholders; prefix with `MOMO_ALLOW_PLACEHOLDERS=1` for a pre-launch preview.

When starting the site's dev server yourself, prefer background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
