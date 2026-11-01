# moTimeline — Steckbrief

**As of:** 2026-11-01 · **Type:** library (npm `motimeline`) · **Version:** 2.15.0

> One-page summary of the repository's current state. History lives in the changelog of the [README](../README.md).
> Whoever changes the repository updates this file in the same commit.

## What it does

Responsive two-column timeline as a dependency-free vanilla JS library: cards, badges, arrows, categories, fill and
stacked layout, animations, infinite scroll and ad slots (`adSlots`). Since 2.15.0 it can render an ads list into the
ad slots (`adSlots.ads`).

## Where things are

| | |
|---|---|
| Code | `src/moTimeline.js`, `src/moTimeline.css` (ES module, imports its CSS) |
| Build | `npm run build` (vite) → `dist/` (not tracked); the npm package ships only `dist` and `src` (`package.json` → `files`) |
| Demo | `docs/index.html` = GitHub Pages, contains an **inlined minified copy** of the library |
| Release | [`MAINTENANCE.md`](../MAINTENANCE.md); a `v*` tag starts the "Publish to npm" workflow |

## Rules

- Every change in `src/` is mirrored into the inlined copy in `docs/index.html` (short names there: `_d` getData,
  `_cas` createAdSlot, `_rad` renderAd, `_obs` observeItems, `_rh` resize handler, `_aro` ad ResizeObserver).
- The version lives in five places: `package.json`, `package-lock.json` (2×), the JS and CSS banners, the version span
  in `docs/index.html`.
- `refresh()` always runs last, after ad slots are injected; if a slot grows later, its ResizeObserver re-runs the
  layout (`src/moTimeline.js`, `init()`).
- Entries of the ads list are data, never HTML: built with DOM APIs and `textContent` only (`_renderAd`); links only for `http(s)`
  (`safeAdHref`), always `target="_blank" rel="noopener sponsored"`.
- Weight: missing = 1, ≤ 0 or not a number = never shown (`adWeight`, `pickAd`).
- A filled slot (`mo-ad-filled`) keeps the card gap to edge and spine via padding (`--mo-ad-margin`, `-inverted`,
  `-fullwidth`, defaulting to the card margins under `.mo-theme`); empty slots stay unstyled (`src/moTimeline.css`,
  section "AD SLOTS").
- Ad slots take part in column placement like cards: in `fill` a slot goes to the shorter column, so it can end up on
  either side.

## Picture

Live demo: https://mattopen.github.io/moTimeline/ (tab "Ad Slots", switch "Source" → "ads list").
