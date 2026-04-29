# Nuro — Publish Repo

This repo holds the static, browser-ready build of **Nuro** (a calm life-skills app
for autistic young adults) for GitHub Pages.

## Source

The site is built from `adulting-coach-app` (Expo / React Native Web). The
contents of `adulting-coach-app/dist/` after a web export are copied directly
into the root of this repo.

## Publish flow

From the `adulting-coach-app` workspace:

```
npx expo export --platform web
```

Then copy the contents of `dist/` over the root of this repo:

- `index.html`
- `metadata.json`
- `favicon.ico`
- `_expo/` (hashed JS bundles)
- `assets/` (hashed images / fonts)

Make sure these stay in place at the repo root:

- `.nojekyll` — required so GitHub Pages serves the `_expo/` folder
- `DEPLOY.md` — this file

After copying, delete any stale hashed bundles in `_expo/static/js/web/` that
the new `index.html` no longer references.

Commit and push to publish.

## Notes

- The build references a few asset paths as absolute URLs (e.g. `/assets/...`).
  This works when Pages serves the site at the domain root; if you switch to a
  sub-path deployment, set `experiments.baseUrl` in `adulting-coach-app`'s
  Expo config and re-export.
