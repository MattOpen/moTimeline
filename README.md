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
    showBadge: true,
    showArrow: true,
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
| `showBadge` | boolean | `false` | Render a circular badge on the center line for every item, numbered sequentially. Badges are automatically hidden when single-column mode is active. |
| `showArrow` | boolean | `false` | Render a triangle arrow pointing from each card toward the center line. Automatically hidden in single-column mode. |
| `theme` | boolean | `false` | Enable the built-in card theme: white cards with drop shadow, full-width image banners (160 px), overlapping circular avatars, and styled badges. Adds `mo-theme` to the container — can also be set manually in HTML. |
| `showCounterStyle` | string | `'counter'` | `'counter'` — sequential item number (1, 2, 3…). `'image'` — image from `data-mo-icon` on the `<li>`; falls back to a built-in flat SVG dot if the attribute is absent. `'none'` — badge element is created (preserving center-line spacing) but rendered with `opacity: 0`. |
| `cardBorderRadius` | string | `'8px'` | Border radius of the themed card and its banner image top corners. Sets `--mo-card-border-radius` on the container. Any valid CSS length is accepted (e.g. `'0'`, `'16px'`, `'1rem'`). |
| `avatarSize` | string | `'50px'` | Width and height of the circular avatar image. Sets `--mo-avatar-size` on the container. Any valid CSS length is accepted (e.g. `'40px'`, `'4rem'`). |

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
| `mo-avatar` | `<img>` | Circular avatar overlapping the bottom of the banner. Always positioned on the right side of the card. |
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

## React

moTimeline manipulates the DOM directly, so use a `useRef` + `useEffect` wrapper to bridge it with React's rendering. Save the snippet below as `Timeline.jsx`:

```jsx
import { useEffect, useRef } from 'react';
import MoTimeline from 'motimeline';
import 'motimeline/dist/moTimeline.css';

/**
 * items shape: [{ id, title, meta, text, banner, avatar, icon }]
 * All item fields are optional except a stable `id` for React keys.
 */
export default function Timeline({ items = [], options = {} }) {
  const ulRef  = useRef(null);
  const tlRef  = useRef(null);
  const lenRef = useRef(0);

  // Initialise once on mount
  useEffect(() => {
    tlRef.current = new MoTimeline(ulRef.current, options);
    lenRef.current = items.length;
    return () => tlRef.current?.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When items array grows, pick up the new <li> elements React just rendered
  useEffect(() => {
    if (!tlRef.current) return;
    if (items.length > lenRef.current) {
      tlRef.current.initNewItems();
    } else {
      // Items removed or reordered — full reinit
      tlRef.current.destroy();
      tlRef.current = new MoTimeline(ulRef.current, options);
    }
    lenRef.current = items.length;
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul ref={ulRef}>
      {items.map((item) => (
        <li key={item.id} {...(item.icon && { 'data-mo-icon': item.icon })}>
          <div className="mo-card">
            {item.banner && (
              <div className="mo-card-image">
                <img className="mo-banner" src={item.banner} alt="" />
                {item.avatar && <img className="mo-avatar" src={item.avatar} alt="" />}
              </div>
            )}
            <div className="mo-card-body">
              {item.title && <h3>{item.title}</h3>}
              {item.meta  && <p className="mo-meta">{item.meta}</p>}
              {item.text  && <p>{item.text}</p>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
```

### Usage

```jsx
import { useState } from 'react';
import Timeline from './Timeline';

export default function App() {
  const [items, setItems] = useState([
    { id: '1', title: 'Project kickoff', meta: 'Jan 2024', text: 'Team aligned on goals.' },
    { id: '2', title: 'Design system',   meta: 'Feb 2024', text: 'Component library shipped.',
      banner: 'banner.jpg', avatar: 'avatar.jpg' },
  ]);

  const addItem = () =>
    setItems(prev => [...prev, {
      id:    String(Date.now()),
      title: 'New event',
      meta:  'Just now',
      text:  'Added dynamically from React state.',
    }]);

  return (
    <>
      <Timeline
        items={items}
        options={{ showBadge: true, showArrow: true, theme: true }}
      />
      <button onClick={addItem}>Add item</button>
    </>
  );
}
```

> **How it works:** React renders the `<li>` elements. moTimeline initialises once on mount and reads the DOM. When the `items` array grows, `initNewItems()` picks up the new `<li>` nodes React just appended. When items are removed or reordered React re-renders the list and the instance is fully reinitialised.

---

## Infinite scroll recipe

moTimeline handles the layout — you own the data fetching. Wire an `IntersectionObserver` to a sentinel element below the list and call `addItems()` when it comes into view.

```html
<!-- Place a sentinel element right after the <ul> -->
<ul id="my-timeline"></ul>
<div id="sentinel"></div>
```

```js
const tl       = new MoTimeline('#my-timeline', { theme: true, showBadge: true });
const sentinel  = document.getElementById('sentinel');
let   loading   = false;
let   page      = 1;
let   exhausted = false;

const observer = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || loading || exhausted) return;

  loading = true;
  const items = await fetchPage(page); // your own async data fetch

  if (items.length === 0) {
    exhausted = true;
    observer.disconnect();
  } else {
    tl.addItems(items);                // moTimeline creates <li> and lays out
    page++;
  }
  loading = false;
});

observer.observe(sentinel);

// Example fetch — replace with your real API call
async function fetchPage(page) {
  const res  = await fetch(`/api/events?page=${page}`);
  const data = await res.json();
  return data.items; // [{ title, meta, text, banner, avatar }, …]
}
```

> `IntersectionObserver` is supported in all modern browsers with no polyfill needed. The `loading` flag prevents duplicate requests if the sentinel stays visible while a fetch is in flight. Set `exhausted = true` and disconnect when your API returns an empty page.

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
  --mo-card-border-radius: 8px;
  --mo-avatar-size:     50px;
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

### v2.7.3
- Fix: cards misaligned on first load when items contain images ([#2](https://github.com/MattOpen/moTimeline/issues/2)) — layout now re-runs automatically after each unloaded image fires its `load` event, so column placement is correct once images are rendered

### v2.7.2
- Fix: cards misaligned on first load ([#2](https://github.com/MattOpen/moTimeline/issues/2)) — reverted to sequential `offsetTop`-based column algorithm; the batch `offsetHeight` fill-shorter approach produced non-alternating columns

### v2.7.1
- Fix: resize listener not attached when container is empty at init time ([#1](https://github.com/MattOpen/moTimeline/issues/1)) — `addItems()` on an empty timeline now correctly responds to window resize

### v2.7.0
- New option `cardBorderRadius` (string, default `'8px'`) — controls card and banner border radius via `--mo-card-border-radius`
- New option `avatarSize` (string, default `'50px'`) — controls avatar width/height via `--mo-avatar-size`

### v2.6.0
- **Breaking:** `badgeShow` renamed to `showBadge`; `arrowShow` renamed to `showArrow` — consistent `show*` naming alongside `showCounterStyle`

### v2.5.0
- **Breaking:** `showCounter` (boolean) removed — replaced by `showCounterStyle: 'none'`, which preserves center-line spacing with an invisible badge
- `showCounterStyle` now accepts three values: `'counter'` · `'image'` · `'none'`

### v2.4.0
- Added `addItems(items)` — creates and appends `<li>` elements from an array of item objects or a JSON string, then initializes them in one batch
- Badges and arrows now hidden in single-column mode (center-line elements have no meaning without a center line)

### v2.3.0
- Added `showCounterStyle` (`'counter'` | `'image'`) and `showCounter` opacity toggle (consolidated into `showCounterStyle: 'none'` in v2.5.0)
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
