# moTimeline

Responsive two-column timeline layout library — plain JavaScript, zero dependencies, MIT licensed.

**[Live demo & docs → mattopen.github.io/moTimeline](https://mattopen.github.io/moTimeline/)**

[![npm](https://img.shields.io/npm/v/motimeline.svg)](https://www.npmjs.com/package/motimeline)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[![Preview](images/preview1.PNG)](https://mattopen.github.io/moTimeline/)

---

## Features

- **Zero dependencies** — no jQuery, no frameworks required
- **Responsive** — two columns on desktop, single column on mobile
- **Configurable breakpoints** — control column count at xs / sm / md / lg
- **Badges & arrows** — numbered badges on the center line, directional arrows
- **Optional theme** — built-in card theme with image banners and overlapping avatars
- **CSS custom properties** — override colors and sizes with one line of CSS
- **Dynamic items** — append new `<li>` elements at any time via `initNewItems()`
- **Bootstrap compatible** — wrap the `<ul>` in a Bootstrap `.container`, no config needed
- **ESM · CJS · UMD** — works with any bundler or as a plain `<script>` tag

---

## Installation

```bash
npm install motimeline
```

### ESM

```js
import MoTimeline from 'motimeline';
import 'motimeline/dist/moTimeline.css';
```

### UMD (no bundler)

```html
<link rel="stylesheet" href="moTimeline.css">
<script src="moTimeline.umd.js"></script>
```

---

## Quick start

```html
<ul id="my-timeline">
  <li>
    <div class="mo-card">
      <div class="mo-card-body">
        <h3>Title</h3>
        <p class="mo-meta">Date</p>
        <p>Text…</p>
      </div>
    </div>
  </li>
  <!-- more <li> items -->
</ul>

<script type="module">
  import MoTimeline from 'motimeline';

  const tl = new MoTimeline('#my-timeline', {
    badgeShow: true,
    arrowShow: true,
    theme:     true,
  });
</script>
```

### With banner image and avatar (`theme: true`)

```html
<li>
  <div class="mo-card">
    <div class="mo-card-image">
      <img class="mo-banner" src="banner.jpg" alt="">
      <img class="mo-avatar" src="avatar.jpg" alt="">  <!-- optional -->
    </div>
    <div class="mo-card-body">
      <h3>Title</h3>
      <p class="mo-meta">Date</p>
      <p>Text…</p>
    </div>
  </div>
</li>
```

---

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `columnCount` | object | `{xs:1, sm:2, md:2, lg:2}` | Columns at each responsive breakpoint: `xs` < 600 px · `sm` < 992 px · `md` < 1 200 px · `lg` ≥ 1 200 px. Set any key to `1` to force single-column at that width. The center line, badges, and arrows are only visible in two-column mode. |
| `badgeShow` | boolean | `false` | Render a circular badge on the center line for every item, numbered sequentially. Badges are automatically hidden when single-column mode is active. |
| `arrowShow` | boolean | `false` | Render a triangle arrow pointing from each card toward the center line. Automatically hidden in single-column mode. |
| `theme` | boolean | `false` | Enable the built-in card theme: white cards with drop shadow, full-width image banners (160 px), overlapping circular avatars, and styled badges. Adds `mo-theme` to the container — can also be set manually in HTML. |
| `showCounter` | boolean | `true` | Controls badge content visibility in two-column mode. `false` sets `opacity: 0` — the badge stays in the DOM to preserve center-line spacing without displaying a number or icon. |
| `showCounterStyle` | string | `'counter'` | `'counter'` — sequential item number (1, 2, 3…). `'image'` — image from `data-mo-icon` on the `<li>`; falls back to a built-in flat SVG dot if the attribute is absent. |

---

## Data attributes

| Attribute | Element | Description |
|---|---|---|
| `data-mo-icon` | `<li>` | URL of the image shown inside the badge when `showCounterStyle: 'image'`. Accepts any web-safe format including inline SVG data URIs. Falls back to a built-in SVG icon if absent. Also set automatically by `addItems()` when an `icon` field is provided. |

---

## CSS classes reference

| Class | Applied to | Description |
|---|---|---|
| `mo-timeline` | container `<ul>` | Core layout class. Added automatically on init; safe to add in HTML before init. |
| `mo-twocol` | container | Present when two-column mode is active. Triggers the center vertical line and badge/arrow positioning. |
| `mo-theme` | container | Activates the built-in card theme. Added by `theme: true` or set manually. |
| `mo-item` | `<li>` | Applied to every timeline item. Controls 50 % width and float direction. |
| `mo-inverted` | `<li>` | Added to right-column items. Flips float, badge, arrow, and avatar positions. |
| `mo-offset` | `<li>` | Added when a badge would overlap the previous badge — nudges badge and arrow down to avoid collision. |
| `mo-badge` | `<span>` | Badge circle on the center line. Style via CSS custom properties. |
| `mo-badge-icon` | `<img>` inside badge | Image inside the badge when `showCounterStyle: 'image'`. |
| `mo-arrow` | `<span>` | Triangle arrow pointing from the card toward the center line. |
| `mo-card` | `<div>` | Card wrapper. Shadow, border-radius, and margins when `mo-theme` is active. |
| `mo-card-image` | `<div>` | Optional image container inside a card. Required for the avatar-over-banner overlap. |
| `mo-banner` | `<img>` | Full-width banner image at the top of a themed card. |
| `mo-avatar` | `<img>` | Circular avatar overlapping the bottom of the banner. Mirrors position on right-column items. |
| `mo-card-body` | `<div>` | Text content area. Padding and typography when `mo-theme` is active. |
| `mo-meta` | `<p>` | Date / subtitle line inside a card body. Muted colour, smaller font. |
| `js-mo-item` · `js-mo-inverted` | `<li>` | JS-only selector mirrors of `mo-item` / `mo-inverted`. Use in your own JS queries to avoid coupling to styling class names. |

---

## API

```js
const tl = new MoTimeline(elementOrSelector, options);

tl.refresh();          // re-layout all items (called automatically on resize)
tl.initNewItems();     // pick up manually appended <li> elements
tl.addItems(items);    // create and append <li> from an array of item objects (or JSON string)
tl.destroy();          // remove listeners and reset DOM classes
```

### addItems — item schema

```js
tl.addItems([
  {
    title:  "Project kickoff",         // <h3> heading
    meta:   "January 2024",            // date / subtitle line
    text:   "Kicked off the roadmap.", // body paragraph
    banner: "images/banner.jpg",       // img.mo-banner (optional)
    avatar: "images/avatar.jpg",       // img.mo-avatar (optional)
    icon:   "images/icon.svg"          // data-mo-icon on <li>, used by showCounterStyle:'image'
  },
]);

// A JSON string is also accepted:
tl.addItems('[{"title":"From JSON","meta":"Today","text":"Parsed automatically."}]');
```

---

## CSS custom properties

```css
#my-timeline {
  --mo-line-color:      #dde1e7;
  --mo-badge-bg:        #4f46e5;
  --mo-badge-color:     #fff;
  --mo-badge-size:      26px;
  --mo-badge-font-size: 12px;
  --mo-arrow-color:     #dde1e7;
}
```

---

## Bootstrap integration

No framework option needed. Wrap the `<ul>` inside a Bootstrap `.container`:

```html
<div class="container">
  <ul id="my-timeline">…</ul>
</div>
```

---

## Examples

| Folder | Description |
|---|---|
| [`example/`](example/) | Main example — run with `npm run dev` |
| [`example/mattopen/`](example/mattopen/) | Bootstrap 5 integration |
| [`example/livestamp/`](example/livestamp/) | Livestamp.js + Moment.js relative timestamps |

---

## Changelog

### v2.4.0
- Added `addItems(items)` — creates and appends `<li>` elements from an array of item objects or a JSON string, then initializes them in one batch
- Badges and arrows now hidden in single-column mode (center-line elements have no meaning without a center line)

### v2.3.0
- Added `showCounter` (opacity toggle) and `showCounterStyle` (`'counter'` | `'image'`) badge options
- `data-mo-icon` attribute on `<li>` sets a custom icon in image mode; built-in flat SVG used as fallback

### v2.2.0
- All library-managed classes renamed to consistent `mo-` prefix (`mo-item`, `mo-badge`, `mo-arrow`, `mo-twocol`, `mo-offset`)
- Added parallel `js-mo-*` classes for JS-only selectors alongside `mo-*` styling classes

### v2.1.0
- Opt-in card theme (`theme: true`) with `mo-card`, `mo-banner`, `mo-avatar`
- Badges repositioned to the center line with directional arrows
- CSS custom properties for easy color/size overrides
- Badge offset algorithm: later DOM item always gets the offset on collision

### v2.0.0
- Complete rewrite — removed jQuery, zero dependencies
- Class-based API: `new MoTimeline(element, options)`
- Vite build pipeline: ESM, CJS, UMD outputs
- Debounced resize listener, `WeakMap` instance data storage

---

## License

MIT © [MattOpen](http://www.mattopen.com)
