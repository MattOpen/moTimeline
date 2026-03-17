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
- **Category filtering** — tag items with `categories` and call `filterByCategory()` to show/hide by category; active filter persists automatically through lazy-loaded batches
- **Dynamic items** — append, insert, or inject `<li>` elements at any time via `initNewItems()`, `addItems()`, or `insertItem()`
- **Custom card renderer** — pass `renderCard(item, cardEl)` to inject any HTML, vanilla JS, or full React components into each card slot; the library handles everything else
- **Publisher-ready ad slots** — the most publisher-friendly timeline on npm: `adSlots` injects viewport-triggered `<li>` placeholders at configurable cadences (`every_n` or `random`), fires `onEnterViewport` exactly once per slot at ≥ 50% visibility, works seamlessly with infinite scroll, and cleans up on `destroy()`. Drop in AdSense, house ads, or any network with three lines of code.
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

### Rendered DOM (after init)

The library injects classes and elements into your markup. Here is what a fully rendered item looks like:

```html
<!-- Container gets mo-timeline, mo-theme, mo-twocol added -->
<ul class="mo-timeline mo-theme mo-twocol">

  <!-- Left-column item: mo-item + js-mo-item added to every <li> -->
  <li class="mo-item js-mo-item">
    <span class="mo-arrow js-mo-arrow"></span>   <!-- injected when showArrow: true -->
    <span class="mo-badge js-mo-badge">1</span>  <!-- injected when showBadge: true -->
    <div class="mo-card">
      <div class="mo-card-image">
        <img class="mo-banner" src="banner.jpg" alt="">
        <img class="mo-avatar" src="avatar.jpg" alt="">
      </div>
      <div class="mo-card-body">
        <h3>Title</h3>
        <p class="mo-meta">Date</p>
        <p>Text…</p>
      </div>
    </div>
  </li>

  <!-- Right-column item: also gets mo-inverted + js-mo-inverted -->
  <li class="mo-item js-mo-item mo-inverted js-mo-inverted">
    ...
  </li>

</ul>
```

> `js-mo-*` classes are JS-only selector mirrors of their `mo-*` counterparts — use them in your own scripts to avoid coupling to styling class names.

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
| `cardMargin` | string | `'0.5rem 1.25rem 0.5rem 0.5rem'` | Margin of left-column themed cards. The larger right value creates space toward the center line. Sets `--mo-card-margin` on the container. |
| `cardMarginInverted` | string | `'0.5rem 0.5rem 0.5rem 1.25rem'` | Margin of right-column (inverted) themed cards. The larger left value creates space toward the center line. Sets `--mo-card-margin-inverted` on the container. |
| `cardMarginFullWidth` | string | `'0.5rem'` | Margin of full-width themed cards. Sets `--mo-card-margin-fullwidth` on the container. |
| `randomFullWidth` | number \| boolean | `0` | `0`/`false` = off. A number `0–1` sets the probability that each item is randomly promoted to full-width during init. `true` = 33% chance. Items can also be set manually by adding the `mo-fullwidth` class to the `<li>`. |
| `animate` | string \| boolean | `false` | Animate items as they scroll into view using `IntersectionObserver`. `'fade'` — items fade in. `'slide'` — left-column items slide in from the left, right-column items from the right. `true` = `'fade'`. Disable for individual items by adding `mo-visible` manually. Control speed via `--mo-animate-duration`. |
| `renderCard` | function \| null | `null` | `(item, cardEl) => void`. When set, called for every item instead of the built-in HTML renderer. `cardEl` is the `.mo-card` div already placed inside the `<li>`. Populate it via `innerHTML` or DOM methods. The library still owns the `<li>`, column placement, spine, badge, arrow, `addItems()`, and scroll pagination. |
| `adSlots` | object \| null | `null` | Inject ad slot placeholders into the timeline and observe them. See **Ad slots** below. |

---

## Data attributes

| Attribute | Element | Description |
|---|---|---|
| `data-mo-icon` | `<li>` | URL of the image shown inside the badge when `showCounterStyle: 'image'`. Accepts any web-safe format including inline SVG data URIs. Falls back to a built-in SVG icon if absent. Also set automatically by `addItems()` when an `icon` field is provided. |
| `data-categories` | `<li>` | Space-separated list of category tokens this item belongs to (e.g. `"development architecture"`). Used by `filterByCategory()`. Set automatically by `addItems()` / `insertItem()` when a `categories` field is provided. Can also be set manually in HTML. |

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
| `mo-filtered-out` | `<li>` | Added by `filterByCategory()` to items that do not match the active filter. Sets `display: none` and excludes the item from column-placement calculations. Removed when the filter is cleared or the item's category is selected. |

---

## API

```js
const tl = new MoTimeline(elementOrSelector, options);

tl.refresh();                      // re-layout all items (called automatically on resize)
tl.initNewItems();                 // pick up manually appended <li> elements
tl.addItems(items);                // create and append <li> from an array of item objects (or JSON string)
tl.insertItem(item, index);        // insert a single item at a specific index (or random if omitted)
tl.filterByCategory(category);    // show only items matching category; null / 'all' shows everything
tl.clear();                        // remove all items and ad slots, reset counters — instance stays alive
tl.destroy();                      // remove listeners and reset DOM classes
```

### insertItem

```js
// Insert at a specific 0-based index:
tl.insertItem({ title: 'Breaking news', meta: 'Now', text: '...' }, 2);

// Insert at a random position (omit the index):
tl.insertItem({ title: 'Surprise!', meta: 'Now', text: '...' });

// Insert as a full-width item:
tl.insertItem({ title: 'Featured', meta: 'Now', text: '...', fullWidth: true }, 0);
```

Badge numbers are automatically re-sequenced after insertion. Returns the inserted `<li>` element.

### addItems — item schema

```js
tl.addItems([
  {
    title:  "Project kickoff",         // <h3> heading
    meta:   "January 2024",            // date / subtitle line
    text:   "Kicked off the roadmap.", // body paragraph
    banner: "images/banner.jpg",       // img.mo-banner (optional)
    avatar: "images/avatar.jpg",       // img.mo-avatar (optional)
    icon:       "images/icon.svg",        // data-mo-icon on <li>, used by showCounterStyle:'image'
    categories: ["development", "architecture"] // used by filterByCategory() — array or space-separated string
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

## Ad slots

Inject ad placeholder `<li>` elements at configurable positions, observe them with `IntersectionObserver`, and fire a callback exactly once when each slot reaches 50% visibility. The library owns the slot element — you own what goes inside it.

```js
const tl = new MoTimeline('#my-timeline', {
  adSlots: {
    mode:     'every_n', // 'every_n' | 'random'
    interval: 10,        // every_n: inject after every N real items
                         // random:  inject once at a random position per N-item page
    style:    'card',    // 'card' | 'fullwidth'
    onEnterViewport: (slotEl, position) => {
      // slotEl   = the <li class="mo-ad-slot"> element
      // position = its 0-based index in the container at injection time
      const ins = document.createElement('ins');
      ins.className        = 'adsbygoogle';
      ins.style.display    = 'block';
      ins.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
      ins.dataset.adSlot   = '1234567890';
      ins.dataset.adFormat = 'auto';
      slotEl.appendChild(ins);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    },
  },
});
```

### `adSlots` option shape

| Property | Type | Description |
|---|---|---|
| `mode` | `'every_n' \| 'random'` | `'every_n'` — inject after every `interval` real items. `'random'` — inject one slot at a random position within each `interval`-item page. |
| `interval` | number | Cadence for slot injection (see `mode`). |
| `style` | `'card' \| 'fullwidth'` | `'card'` — slot sits in the normal left/right column flow. `'fullwidth'` — slot spans both columns (adds `mo-fullwidth`). |
| `onEnterViewport` | `(slotEl: HTMLElement, position: number) => void` | Called once per slot when ≥ 50% of it enters the viewport. `position` is the 0-based child index of the slot in the container at injection time. |

**What the library provides:**
- A `<li class="mo-ad-slot">` element with `min-height: 100px` (so the observer can detect it before content loads)
- `fullwidth` layout via the existing `mo-fullwidth` mechanism when `style: 'fullwidth'`
- Exactly-once `IntersectionObserver` (threshold 0.5) per slot
- Automatic slot cleanup on `tl.destroy()`

**What you provide:** everything inside the slot — the ad creative, network scripts, markup.

Slots are injected after each `addItems()` call, so they work seamlessly with infinite scroll.

## Category filter recipe

Tag items with `categories` (array or space-separated string) and wire `filterByCategory()` to your own filter buttons. The active filter is stored on the instance — items added later via `addItems()` are filtered automatically, making it fully compatible with infinite scroll.

```js
const tl = new MoTimeline('#my-timeline', { theme: true, showBadge: true });

// Load items with categories
tl.addItems([
  { title: 'API cleanup',   meta: 'Jan 2025', text: '...', categories: ['development', 'architecture'] },
  { title: 'Sprint review', meta: 'Feb 2025', text: '...', categories: 'management' },
]);

// Wire filter buttons
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tl.filterByCategory(btn.dataset.cat); // pass null or 'all' to show everything
  });
});

// Active filter persists through lazy-loaded batches
tl.addItems(moreItemsFromServer); // auto-filtered to match current selection
```

Or set `data-categories` directly in HTML and use `initNewItems()`:

```html
<li data-categories="development architecture">...</li>
<li data-categories="management">...</li>
```

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
  --mo-avatar-size:          50px;
  --mo-card-margin:            0.5rem 1.25rem 0.5rem 0.5rem;
  --mo-card-margin-inverted:   0.5rem 0.5rem 0.5rem 1.25rem;
  --mo-card-margin-fullwidth:  0.5rem;
  --mo-animate-duration:       0.5s;
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

### v2.13.0
- New: **category filtering** — tag items with `categories` (array or space-separated string) and call `filterByCategory(category)` to show only matching items. Pass `null` or `'all'` to clear the filter. The active filter is stored on the instance and applied automatically to items added via `addItems()` or `initNewItems()`, making it fully compatible with infinite scroll / server-side pagination. Column placement recalculates on every filter change so the two-column layout stays correct. New class `mo-filtered-out` is used internally (`display: none`) and new attribute `data-categories` is set on each `<li>`.

### v2.12.1
- Fix: badge width — use `width` instead of `min-width` to prevent oversized badges ([#8](https://github.com/MattOpen/moTimeline/issues/8))

### v2.12.0
- New method `clear()` — removes all `.mo-item` and `.mo-ad-slot` elements from the container and resets internal counters (`lastItemIdx`, `_adRealCount`) without destroying the instance. Active `IntersectionObserver`s are disconnected but kept alive so they re-observe items added by the next `addItems()` call. Use this in React wrappers to reinitialize timeline content when props change without recreating the instance.

### v2.11.0
- New option `adSlots` — inject ad slot `<li>` placeholders at configurable positions (`every_n` or `random` mode) and receive an `onEnterViewport(slotEl, position)` callback exactly once per slot when ≥ 50% of it is visible. Works with `addItems()` and infinite scroll. Slots are removed on `tl.destroy()`. See **Ad slots** section.

### v2.10.0
- New option `renderCard(item, cardEl)` — custom card renderer. When provided, the library skips its built-in card HTML and calls this function instead, passing the item data object and the `.mo-card` div already inserted into the DOM. The library continues to own column placement, spine, badge, arrow, `addItems()`, and scroll pagination. Enables full React component injection via `createRoot(cardEl).render(...)`.

### v2.9.0
- New option `animate` — scroll-triggered animations via `IntersectionObserver`. `'fade'` fades items in as they enter the viewport; `'slide'` slides left-column items from the left and right-column items from the right. `true` defaults to `'fade'`. Speed controlled via `--mo-animate-duration` (default `0.5s`). Works for initial load, `addItems()`, and `insertItem()`.

### v2.8.1
- New method `insertItem(item, index)` — inserts a single item at a specific 0-based index, or at a random position when index is omitted. Badge numbers are re-sequenced automatically.

### v2.8.0
- New: full-width items — add `mo-fullwidth` class to any `<li>` to make it span both columns (two-column mode only). Badge and arrow are hidden automatically; card margin collapses to equal sides via `--mo-card-margin-fullwidth`
- New option `randomFullWidth` (number 0–1 or boolean) — randomly promotes items to full-width during init (`true` = 33% probability)
- New option `cardMarginFullWidth` (string, default `'0.5rem'`) — controls the themed card margin for full-width items

### v2.7.5
- New options `cardMargin` (default `'0.5rem 1.25rem 0.5rem 0.5rem'`) and `cardMarginInverted` (default `'0.5rem 0.5rem 0.5rem 1.25rem'`) — control themed card margins via `--mo-card-margin` and `--mo-card-margin-inverted`

### v2.7.4
- Fix: wrong column placement when adjacent left and right items share the same bottom y-coordinate ([#3](https://github.com/MattOpen/moTimeline/issues/3)) — adds a 1 px tolerance to the column algorithm to absorb `offsetHeight`/`offsetTop` rounding mismatches

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
