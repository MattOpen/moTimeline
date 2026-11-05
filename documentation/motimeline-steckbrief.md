# moTimeline — Steckbrief

**As of:** 2026-11-05 · **Type:** library (npm `motimeline`) · **Version:** 2.18.0

> One-page summary of the repository's current state. History lives in the changelog of the [README](../README.md).
> Whoever changes the repository updates this file in the same commit.

## What it does

Responsive two-column timeline as a dependency-free vanilla JS library: cards, badges, arrows, categories, fill and
stacked layout, animations, infinite scroll and ad slots (`adSlots`). Since 2.15.0 it can render an ads list into the
ad slots (`adSlots.ads`); since 2.16.0 each ad can set its own slot width (`style`); since 2.17.0 `theme` takes a
name (`'default'` or `'gap'`); since 2.18.0 `prependItems()` puts newer items on top without the page jumping.

## Where things are

| | |
|---|---|
| Code | `src/moTimeline.js`, `src/moTimeline.css` (ES module, imports its CSS) |
| Build | `npm run build` (vite) → `dist/` (not tracked); the npm package ships only `dist` and `src` (`package.json` → `files`) |
| Demo | `docs/index.html` = GitHub Pages, contains an **inlined minified copy** of the library |
| Release | [`MAINTENANCE.md`](../MAINTENANCE.md); a `v*` tag starts the "Publish to npm" workflow |

## Rules

- Every change in `src/` is mirrored into the inlined copy in `docs/index.html` (short names there: `_d` getData,
  `_cas` createAdSlot, `_rad` renderAd, `_obs` observeItems, `_rh` resize handler, `_aro` ad ResizeObserver,
  `_su` setUp, `_ps` prependStarts, `_rnb` renumberBadges, `_iast` injectAdSlotsTop, `_reg` registerAdSlots,
  `_anb` anchorBefore, `_hs`/`_cs`/`_rs` hold/correct/release scroll, `_h` the running hold).
- The version lives in five places: `package.json`, `package-lock.json` (2×), the JS and CSS banners, the version span
  in `docs/index.html`.
- `refresh()` always runs last, after ad slots are injected; if a slot grows later, its ResizeObserver re-runs the
  layout (`src/moTimeline.js`, `init()`).
- Entries of the ads list are data, never HTML: built with DOM APIs and `textContent` only (`_renderAd`); links only for `http(s)`
  (`safeAdHref`), always `target="_blank" rel="noopener sponsored"`.
- Weight: missing = 1, ≤ 0 or not a number = never shown (`adWeight`, `pickAd`).
- Width per ad: `_createAdSlot` picks the ad first; a valid `ad.style` (`card`/`fullwidth`) overrides `adSlots.style`
  before the slot enters the DOM, so `_layout()` needs no special case. The library sets no aspect ratio: the image
  fills the slot width at its own proportions (`.mo-ad-image`); format and `style` are the caller's choice per ad.
- A filled slot (`mo-ad-filled`) keeps the card gap to edge and spine via padding (`--mo-ad-margin`, `-inverted`,
  `-fullwidth`, defaulting to the card margins under `.mo-theme` or `.mo-gap`); empty slots stay unstyled
  (`src/moTimeline.css`, section "AD SLOTS").
- `theme` is resolved by `themeClass()`: `'default'`/`true` → `mo-theme` (look plus gap), `'gap'` → `mo-gap` (gap only),
  anything else → no class, cards flush. The gap is a `margin` on `.mo-card` (section "CARD GAP"), never padding on the
  `li` (padding does not collapse in one column). Own cards opt in by also carrying `mo-card`. In one column
  (`.mo-gap:not(.mo-twocol):not(.mo-rows)`: fill below the breakpoint, stacked) the card takes the full-width margin and
  the `li` is `display: flow-root` so neighbouring margins add up (16 px) instead of collapsing; `:not(.mo-filtered-out)`
  keeps filtered items hidden. `.mo-theme` deliberately keeps the 2.16.0 single-column look (8 px, 8/20).
- `init()` writes `--mo-card-*` and `--mo-avatar-size` inline only for options the caller passed (`this._options`,
  `CSS_VAR_OPTIONS`), never from `DEFAULTS`; the stylesheet carries the defaults as fallbacks.
- Ad slots take part in column placement like cards: in `fill` a slot goes to the shorter column, so it can end up on
  either side.
- `_initItems()` sets up exactly the children not in the WeakSet `_setUp` (ad slots excluded), never "the last N
  children". New children above the first known one are a prepend: that known child goes into `_prependStarts`,
  `_layout()` starts it level (fill: both column heights to the maximum; rows: side counter to 0) and marks the first
  visible child of the block with `mo-prepend-start` (`clear: both`), so a block once laid out never changes sides.
- Ad cadence upward: `_adTopPos` is the position of the top entry (starts at 1, prepended entries count 0, -1, …);
  `_adTopPending` holds an incomplete `random` block. `_adRealCount` (downward) stays untouched.
- Scroll hold (`_anchorBefore`, `_holdScroll`): the anchor is measured with the new items `display: none`, so it also
  works after the DOM insert (`initNewItems()`). While the hold runs, `overflow-anchor` is `none` on the scroller and a
  ResizeObserver on the list scrolls by the anchor's drift; a scroll the hold did not cause moves the anchor's target.
  The hold ends `SCROLL_HOLD_SETTLE_MS` (300) after the last image of the new items loaded or failed.

## Picture

Live demo: https://mattopen.github.io/moTimeline/ (tab "Ad Slots", switch "Source" → "ads list").
