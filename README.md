# Café Momo

Static site for Café Momo (Groningen). SolidJS + Tailwind + solid-motionone, deployed to GitHub Pages.

## Content

All copy lives in `src/data/site.json`. Components read from it directly and stay presentation-only.

## Develop

```
npm install
npm run dev
```

## Deploy

Pushing to `main` builds and deploys via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages.
Enable Pages in repo settings with source "GitHub Actions" once, and it takes care of the rest.
