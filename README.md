# momo-cafe

A static [Astro](https://astro.build) site, deployed to GitHub Pages at
<https://momo-cafe.github.io>.

## Local development

```sh
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # static build into ./dist
npm run preview  # serve the built ./dist locally
```

## Project structure

```
src/
  layouts/Layout.astro   shared page shell (head, nav, footer, global styles)
  pages/                 one file per route: index.astro -> /, about.astro -> /about/
public/                  copied verbatim to the site root (favicons, images, robots.txt)
astro.config.mjs         site URL and Astro options
.github/workflows/deploy.yml   build + deploy on push to main
```

## Deployment

`.github/workflows/deploy.yml` builds the site with
[`withastro/action`](https://github.com/withastro/action) on every push to `main`
and publishes it with `actions/deploy-pages`.

One-time setup in the GitHub repo: **Settings -> Pages -> Build and deployment**,
set **Source** to **GitHub Actions**. Without that the workflow's deploy step fails.

Because this repo is a user/org Pages repo (`momo-cafe.github.io`), the site is
served from the domain root, so `astro.config.mjs` sets only `site` and no `base`.
If you ever move this to a regular project repo, add
`base: '/<repo-name>'` to the config.
