/*!
 * moTimeline v2.18.0
 * Responsive two-column timeline layout library
 * https://github.com/MattOpen/moTimeline
 * MIT License
 */

import './moTimeline.css';

const instanceData = new WeakMap();


const DEFAULTS = {
  columnCount: { xs: 1, sm: 2, md: 2, lg: 2 },
  layout: 'fill',     // 'fill' = shorter column wins | 'rows' = alternating sides | 'stacked' = one side
  mirrorText: false,  // right-hand cards align their text toward the centre line
  showBadge: false,
  showArrow: false,
  theme: false,       // false | 'default' (or true) = look + card gap | 'gap' = card gap only
  showCounterStyle: 'counter', // 'counter' | 'image' | 'none'
  cardBorderRadius: '8px',
  avatarSize: '50px',
  cardMargin: '0.5rem 1.25rem 0.5rem 0.5rem',
  cardMarginInverted: '0.5rem 0.5rem 0.5rem 1.25rem',
  cardMarginFullWidth: '0.5rem',
  randomFullWidth: 0, // 0 = off; 0–1 = probability per item; true = 0.33
  animate: false,     // false | 'fade' | 'slide'
  renderCard: null,   // (item, cardEl) => void — custom card renderer; skips built-in HTML
  adSlots: null,      // { mode, interval, style, onEnterViewport, ads, onAdView, onAdClick } — see docs
};

// Options mirrored into CSS variables. Written inline only when passed, so the
// stylesheet's defaults stay overridable from the page's own CSS.
const CSS_VAR_OPTIONS = {
  cardBorderRadius: '--mo-card-border-radius',
  avatarSize: '--mo-avatar-size',
  cardMargin: '--mo-card-margin',
  cardMarginInverted: '--mo-card-margin-inverted',
  cardMarginFullWidth: '--mo-card-margin-fullwidth',
};

// Container class for a theme name; true is the original boolean form of 'default'.
function themeClass(theme) {
  if (theme === true || theme === 'default') return 'mo-theme';
  if (theme === 'gap') return 'mo-gap';
  return null;
}

// Ad object shown in each slot filled from `adSlots.ads`, read by onAdView/onAdClick.
const slotAds = new WeakMap();

// Weight of an `ads` entry: missing = 1, anything not a positive number = never shown.
function adWeight(ad) {
  if (!ad || typeof ad !== 'object') return 0;
  const w = ad.weight == null ? 1 : Number(ad.weight);
  return Number.isFinite(w) && w > 0 ? w : 0;
}

// Picks one entry at random, proportional to its weight; null if none can be shown.
function pickAd(ads) {
  if (!Array.isArray(ads)) return null;
  const total = ads.reduce((sum, ad) => sum + adWeight(ad), 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  let last = null;
  for (const ad of ads) {
    const w = adWeight(ad);
    if (w <= 0) continue;
    last = ad;
    r -= w;
    if (r < 0) return ad;
  }
  return last; // float rounding at the upper edge
}

// Only http(s) URLs become links, so a `javascript:` URL never reaches an href.
function safeAdHref(url) {
  if (url == null || url === '') return null;
  try {
    const u = new URL(String(url), document.baseURI);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

// prependItems(): how long the scroll hold stays after the last image of the
// new items settled; covers the 100 ms debounced re-layout.
const SCROLL_HOLD_SETTLE_MS = 300;

const DEFAULT_BADGE_ICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='11' fill='%234f46e5'/><circle cx='12' cy='12' r='4.5' fill='white'/></svg>";

function getBreakpoint() {
  const w = window.innerWidth;
  if (w < 600) return 'xs';
  if (w < 992) return 'sm';
  if (w < 1200) return 'md';
  return 'lg';
}

function debounce(fn, delay = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


export class MoTimeline {
  static instances = new Set();

  constructor(element, options = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) throw new Error('moTimeline: element not found');

    this.element = element;
    this._options = options;
    this.settings = Object.assign({}, DEFAULTS, options);
    this.settings.columnCount = Object.assign({}, DEFAULTS.columnCount, options.columnCount);
    this._resizeHandler = debounce(() => this.refresh(), 100);
    this._initialized = false;
    // Children the library has set up; _initItems() picks up every other child.
    this._setUp = new WeakSet();
    // First child of each block below a prepend; _layout() starts it level.
    this._prependStarts = new WeakSet();

    this.init();
  }

  init() {
    const el = this.element;

    // Already initialized — just refresh
    if (instanceData.has(el)) {
      this.refresh();
      return;
    }

    const data = Object.assign({}, this.settings, { lastItemIdx: 0 });
    instanceData.set(el, data);
    MoTimeline.instances.add(this);

    el.classList.add('mo-timeline');
    const theme = themeClass(data.theme);
    if (theme) el.classList.add(theme);
    Object.entries(CSS_VAR_OPTIONS).forEach(([option, prop]) => {
      if (this._options[option] != null) el.style.setProperty(prop, this._options[option]);
    });

    if (data.animate) {
      const type = data.animate === true ? 'fade' : data.animate;
      el.classList.add('mo-animate', `mo-animate-${type}`);
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mo-visible');
            this._observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
    }

    if (data.adSlots) {
      data._adRealCount = 0;
      // Cadence position of the top entry; prepended entries count 0, -1, -2 …
      data._adTopPos = 1;
      const { onEnterViewport, onAdView } = data.adSlots;
      if (typeof onEnterViewport === 'function' || typeof onAdView === 'function') {
        this._adObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const slot = entry.target;
              this._adObserver.unobserve(slot);
              if (typeof onEnterViewport === 'function') {
                onEnterViewport(slot, Number(slot.dataset.moAdPosition));
              }
              if (typeof onAdView === 'function' && slotAds.has(slot)) {
                onAdView(slotAds.get(slot), slot);
              }
            }
          });
        }, { threshold: 0.5 });
      }
      // Column placement uses slot heights at refresh() time; a slot filled
      // later (sync or async, e.g. AdSense) re-runs the layout once it resizes.
      if (typeof ResizeObserver === 'function') {
        this._adResizeObserver = new ResizeObserver(this._resizeHandler);
      }
    }

    this._initialized = true;
    window.addEventListener('resize', this._resizeHandler);

    if (Array.from(el.children).length > 0) {
      this._initItems();
    }
  }

  refresh() {
    MoTimeline.instances.forEach((instance) => {
      const el = instance.element;
      const data = instanceData.get(el);
      if (!data) return;

      data.col = data.columnCount[getBreakpoint()];
      instance._setDivider();
      instance._layout();
    });
  }

  /**
   * Set up every child not set up yet. Children placed above the first item
   * are handled like prependItems(), scroll hold included.
   */
  initNewItems() {
    this._initItems();
  }

  /**
   * Create <li> elements from an array of item objects (or a JSON string) and
   * append them to the timeline, then initialize them in one batch.
   *
   * Item shape:
   *   { title, meta, text, banner, avatar, icon }
   *   — banner / avatar / icon are all optional
   *   — icon sets data-mo-icon on the <li> for showCounterStyle:'image'
   */
  addItems(items) {
    if (typeof items === 'string') items = JSON.parse(items);
    items.forEach((item) => this.element.appendChild(this._createItemElement(item)));
    this._initItems();
  }

  /**
   * Insert items above the current first item, in the given order, and keep
   * the visible content where it is (motimeline-465).
   *
   * @param {Array|string} items — item objects (same shape as addItems()), a JSON string, or <li> elements
   * @param {Object} [options]
   * @param {boolean} [options.keepScroll=true] — keep the first visible item at the same viewport position
   * @returns {HTMLElement[]} the inserted <li> elements
   */
  prependItems(items, { keepScroll = true } = {}) {
    if (!this._getData()) return [];
    if (typeof items === 'string') items = JSON.parse(items);
    const els = Array.from(items, (item) =>
      (item instanceof HTMLElement ? item : this._createItemElement(item)));
    if (!els.length) return els;

    const first = this.element.firstElementChild;
    els.forEach((li) => this.element.insertBefore(li, first));
    this._initItems({ keepScroll });
    return els;
  }

  /**
   * Insert a single item at a specific position or at a random position.
   *
   * @param {Object} item  — same shape as addItems(): { title, meta, text, banner, avatar, icon }
   * @param {number} [index] — 0-based insertion index. Omit (or pass undefined) for a random position.
   * @returns {HTMLElement} the inserted <li> element
   */
  insertItem(item, index) {
    const el = this.element;
    const data = this._getData();
    if (!data) return;

    const newEl = this._createItemElement(item);

    // All currently initialised items (to determine valid range)
    const items = Array.from(el.children).filter((c) => c.classList.contains('js-mo-item'));
    const pos = (index === undefined || index === null)
      ? Math.floor(Math.random() * (items.length + 1))
      : Math.max(0, Math.min(index, items.length));

    // Insert into DOM (append when pos is at end)
    if (pos >= items.length) {
      el.appendChild(newEl);
    } else {
      el.insertBefore(newEl, items[pos]);
    }

    // Initialise the new element
    if (!newEl.id) newEl.id = 'moT' + crypto.randomUUID() + '_' + pos;
    newEl.classList.add('mo-item', 'js-mo-item');
    this._setUp.add(newEl);

    // Explicit fullWidth on item data takes priority, then fall back to randomFullWidth
    if (item.fullWidth) {
      newEl.classList.add('mo-fullwidth', 'js-mo-fullwidth');
    } else if (data.randomFullWidth) {
      const prob = data.randomFullWidth === true ? 0.33 : data.randomFullWidth;
      if (Math.random() < prob) newEl.classList.add('mo-fullwidth', 'js-mo-fullwidth');
    }
    if (data.showBadge) this._createBadge(newEl, pos + 1);
    if (data.showArrow) this._createArrow(newEl);

    // Re-number all counter badges so sequence stays correct after insertion
    this._renumberBadges();

    data.lastItemIdx = Array.from(el.children).length;
    instanceData.set(el, data);

    this.refresh();

    this._observeItems([newEl]);

    newEl.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', this._resizeHandler, { once: true });
    });

    return newEl;
  }

  clear() {
    const data = this._getData();
    if (!data) return;

    // Disconnect observers — they remain alive and will re-observe new items
    if (this._observer) this._observer.disconnect();
    if (this._adObserver) this._adObserver.disconnect();
    if (this._adResizeObserver) this._adResizeObserver.disconnect();

    // Remove all library-managed elements (real items + ad slots)
    Array.from(this.element.children).forEach((child) => {
      if (child.classList.contains('js-mo-item') || child.classList.contains('mo-ad-slot')) {
        child.remove();
      }
    });

    // Reset counters — ready for a fresh addItems() call
    data.lastItemIdx = 0;
    if (data.adSlots) {
      data._adRealCount = 0;
      data._adTopPos = 1;
      data._adTopPending = [];
    }
    this._releaseScroll();
  }

  destroy() {
    window.removeEventListener('resize', this._resizeHandler);
    this._releaseScroll();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._adObserver) {
      this._adObserver.disconnect();
      this._adObserver = null;
    }
    if (this._adResizeObserver) {
      this._adResizeObserver.disconnect();
      this._adResizeObserver = null;
    }
    Array.from(this.element.querySelectorAll('.mo-ad-slot')).forEach((s) => s.remove());
    instanceData.delete(this.element);
    MoTimeline.instances.delete(this);
    Object.entries(CSS_VAR_OPTIONS).forEach(([option, prop]) => {
      if (this._options[option] != null) this.element.style.removeProperty(prop);
    });
    this.element.classList.remove('mo-timeline', 'mo-theme', 'mo-gap', 'mo-twocol', 'mo-animate', 'mo-animate-fade', 'mo-animate-slide', 'mo-rows', 'mo-stacked');
    Array.from(this.element.children).forEach((child) => {
      child.classList.remove('mo-item', 'js-mo-item', 'mo-inverted', 'js-mo-inverted', 'mo-offset', 'mo-fullwidth', 'js-mo-fullwidth', 'mo-visible', 'mo-filtered-out', 'mo-prepend-start');
      child.style.removeProperty('grid-row');
      child.querySelectorAll('.js-mo-badge, .js-mo-arrow').forEach((b) => b.remove());
    });
    this._setUp = new WeakSet();
    this._prependStarts = new WeakSet();
  }

  /**
   * Filter visible items by category.
   * Pass null / 'all' / '' to show everything.
   * The active filter is remembered and applied automatically to items added later.
   *
   * @param {string|null} category — value to match against data-categories on each item
   */
  filterByCategory(category) {
    const data = this._getData();
    if (!data) return;

    data._activeFilter = (category == null || category === '' || category === 'all')
      ? null
      : String(category);
    instanceData.set(this.element, data);

    this._applyFilter(Array.from(this.element.querySelectorAll('.js-mo-item')));
    this.refresh();
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _applyFilter(items) {
    const data = this._getData();
    if (!data) return;
    const active = data._activeFilter || null;
    items.forEach((item) => {
      if (!active) {
        item.classList.remove('mo-filtered-out');
      } else {
        const cats = (item.dataset.categories || '').split(/\s+/).filter(Boolean);
        item.classList.toggle('mo-filtered-out', !cats.includes(active));
      }
    });
  }

  _getData() {
    return instanceData.get(this.element);
  }

  _setDivider() {
    const data = this._getData();
    if (!data) return;
    data.col = data.columnCount[getBreakpoint()];
    this.element.classList.toggle('mo-twocol', data.col > 1);
    this.element.classList.toggle('mo-mirror-text', !!data.mirrorText);
    // 'rows' and 'stacked' both place one item per row, so neither uses the
    // two-column float layout — they own their spine and date gutter.
    this.element.classList.toggle('mo-rows', data.layout === 'rows' && data.col > 1);
    this.element.classList.toggle('mo-stacked', data.layout === 'stacked');
    if (data.layout === 'stacked') {
      data.col = 1;
      this.element.classList.remove('mo-twocol', 'mo-rows');
    }
    if (data.layout === 'rows' && data.col > 1) {
      this.element.classList.remove('mo-twocol');
    }
  }

  _initItems({ keepScroll = true } = {}) {
    const el = this.element;
    const data = this._getData();
    if (!data) return;

    const allChildren = Array.from(el.children);
    // Every child not set up yet, wherever it sits. Ad slots live among the
    // children but are not entries: counting them here would make them real
    // items and stretch the configured interval.
    const isKnown = (c) => this._setUp.has(c) || c.classList.contains('mo-ad-slot');
    const newItems = allChildren.filter((c) => !isKnown(c));

    if (newItems.length === 0) return;

    // New children above the first known one are a prepend: the block below
    // starts level, so its items keep their sides, and ad slots count upward.
    const firstKnownIdx = allChildren.findIndex(isKnown);
    const topItems = firstKnownIdx > 0 ? newItems.slice(0, firstKnownIdx) : [];
    const restItems = newItems.slice(topItems.length);
    if (topItems.length) this._prependStarts.add(allChildren[firstKnownIdx]);
    const knownCount = allChildren.filter((c) => this._setUp.has(c)).length;
    const anchor = topItems.length && keepScroll ? this._anchorBefore(topItems) : null;

    // Assign IDs and base class
    newItems.forEach((item) => {
      if (!item.id) {
        item.id = 'moT' + crypto.randomUUID() + '_' + allChildren.indexOf(item);
      }
      item.classList.add('mo-item', 'js-mo-item');
      this._setUp.add(item);
    });

    this._setDivider();

    // Random full-width assignment
    if (data.randomFullWidth) {
      const prob = data.randomFullWidth === true ? 0.33 : data.randomFullWidth;
      newItems.forEach((item) => {
        if (!item.classList.contains('mo-fullwidth') && Math.random() < prob) {
          item.classList.add('mo-fullwidth', 'js-mo-fullwidth');
        }
      });
    }

    // Badges / arrows — numbered after the entries already set up; a prepend
    // re-numbers the whole list.
    restItems.forEach((item, i) => {
      if (data.showBadge) {
        this._createBadge(item, knownCount + i + 1);
      }
      if (data.showArrow) {
        this._createArrow(item);
      }
    });
    topItems.forEach((item) => {
      if (data.showBadge) this._createBadge(item, 0);
      if (data.showArrow) this._createArrow(item);
    });
    if (topItems.length) this._renumberBadges();

    data.lastItemIdx = allChildren.length;
    instanceData.set(el, data);

    this._applyFilter(newItems);
    this.refresh();

    this._observeItems(newItems);
    this._injectAdSlotsTop(topItems);
    this._injectAdSlots(restItems);
    if (anchor) this._holdScroll(anchor, topItems);

    // Re-layout after any unloaded images finish, because offsetHeight is
    // based on text-only height until images are ready.
    newItems.forEach((item) => {
      item.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', this._resizeHandler, { once: true });
        }
      });
    });
  }

  _layout() {
    const el = this.element;
    const data = this._getData();
    if (!data) return;

    if (data.col <= 1) {
      Array.from(el.children).forEach((child) => {
        child.classList.remove('mo-inverted', 'js-mo-inverted', 'mo-offset', 'mo-prepend-start');
        child.style.removeProperty('grid-row');
      });
      return;
    }

    // Only layout 'rows' pins grid rows; clear leftovers when it is not active.
    if (data.layout !== 'rows') {
      Array.from(el.children).forEach((c) => c.style.removeProperty('grid-row'));
    }

    // 'rows' keeps document order: every item starts below the previous one and
    // merely alternates sides. 'fill' (default) instead moves each item into the
    // shorter column, so items pull up alongside each other.
    if (data.layout === 'rows') {
      let i = 0;
      let row = 0;
      Array.from(el.children).forEach((child) => {
        child.classList.remove('mo-prepend-start');
        // A block below a prepend alternates from the left again, as before.
        if (this._prependStarts.has(child)) i = 0;
        if (child.classList.contains('mo-filtered-out')) return;
        // One grid row per item, so each starts below the previous one.
        child.style.gridRow = String(++row);
        if (child.classList.contains('mo-fullwidth')) {
          child.classList.remove('mo-inverted', 'js-mo-inverted', 'mo-offset');
          i = 0;
          return;
        }
        const goLeft = i % 2 === 0;
        child.classList.toggle('mo-inverted', !goLeft);
        child.classList.toggle('js-mo-inverted', !goLeft);
        child.classList.remove('mo-offset');
        i++;
      });
      return;
    }

    let leftH = 0, rightH = 0, prevStart = -Infinity, segment = false;
    Array.from(el.children).forEach((child) => {
      // A block below a prepend starts level (CSS clears it), so it is laid out
      // exactly as before the prepend and its items keep their sides. The class
      // goes to the first visible child, since a filtered one has no box.
      if (this._prependStarts.has(child)) segment = true;
      child.classList.remove('mo-prepend-start');
      if (child.classList.contains('mo-filtered-out')) return;
      if (segment) {
        child.classList.add('mo-prepend-start');
        leftH = rightH = Math.max(leftH, rightH);
        prevStart = -Infinity;
        segment = false;
      }

      if (child.classList.contains('mo-fullwidth')) {
        child.classList.remove('mo-inverted', 'js-mo-inverted', 'mo-offset');
        leftH = rightH = Math.max(leftH, rightH) + child.offsetHeight;
        prevStart = -Infinity;
        return;
      }

      const rowStart = Math.min(leftH, rightH);
      const goLeft = leftH <= rightH;
      child.classList.toggle('mo-inverted', !goLeft);
      child.classList.toggle('js-mo-inverted', !goLeft);
      child.classList.toggle('mo-offset', Math.abs(rowStart - prevStart) < 40);
      if (goLeft) leftH += child.offsetHeight;
      else rightH += child.offsetHeight;
      prevStart = rowStart;
    });
  }

  _createBadge(el, idx) {
    const data = this._getData();
    const span = document.createElement('span');
    span.className = 'mo-badge js-mo-badge';

    if (data.showCounterStyle === 'none') {
      span.style.opacity = '0';
    } else if (data.showCounterStyle === 'image') {
      const img = document.createElement('img');
      img.className = 'mo-badge-icon';
      img.alt = '';
      img.src = el.dataset.moIcon || DEFAULT_BADGE_ICON;
      span.appendChild(img);
    } else {
      span.textContent = idx;
    }

    el.prepend(span);
  }

  // Counter badges follow document order, 1 … n (insertItem, prependItems).
  _renumberBadges() {
    const data = this._getData();
    if (!data || !data.showBadge || data.showCounterStyle !== 'counter') return;
    Array.from(this.element.querySelectorAll('.js-mo-item')).forEach((it, i) => {
      const badge = it.querySelector('.js-mo-badge');
      if (badge) badge.textContent = i + 1;
    });
  }

  _createItemElement(item) {
    const li = document.createElement('li');
    if (item.icon) li.dataset.moIcon = item.icon;
    // Shown in the left gutter by layout 'stacked'; ignored by other layouts.
    if (item.date) li.dataset.moDate = item.date;
    if (item.categories) {
      li.dataset.categories = Array.isArray(item.categories)
        ? item.categories.join(' ')
        : String(item.categories);
    }

    const card = document.createElement('div');
    card.className = 'mo-card';

    const data = this._getData();
    if (data && typeof data.renderCard === 'function') {
      data.renderCard(item, card);
    } else {
      if (item.banner) {
        const wrap = document.createElement('div');
        wrap.className = 'mo-card-image';
        const banner = document.createElement('img');
        banner.className = 'mo-banner';
        banner.src = item.banner;
        banner.alt = '';
        wrap.appendChild(banner);
        if (item.avatar) {
          const avatar = document.createElement('img');
          avatar.className = 'mo-avatar';
          avatar.src = item.avatar;
          avatar.alt = '';
          wrap.appendChild(avatar);
        }
        card.appendChild(wrap);
      }

      const body = document.createElement('div');
      body.className = 'mo-card-body';
      if (item.title) {
        const h = document.createElement('h3');
        h.textContent = item.title;
        body.appendChild(h);
      }
      if (item.meta) {
        const m = document.createElement('p');
        m.className = 'mo-meta';
        m.textContent = item.meta;
        body.appendChild(m);
      }
      if (item.text) {
        const p = document.createElement('p');
        p.textContent = item.text;
        body.appendChild(p);
      }
      card.appendChild(body);
    }

    li.appendChild(card);
    return li;
  }

  _createArrow(el) {
    const span = document.createElement('span');
    span.className = 'mo-arrow js-mo-arrow';
    el.prepend(span);
  }

  _injectAdSlots(newItems) {
    const data = this._getData();
    if (!data || !data.adSlots || !newItems.length) return;

    const { mode, interval, style } = data.adSlots;
    const fullWidth = style === 'fullwidth';
    const el = this.element;
    // A card-style slot is a regular layout element like any real item (it
    // carries `mo-item` without `mo-fullwidth`) and affects column/row
    // placement the same way — so it needs refresh() just as much as a
    // fullwidth slot does, not only the latter.
    // Slots also fall under `animate` (they carry `mo-item`), so they go through
    // the same reveal observer as real items.
    const newSlots = [];

    if (mode === 'every_n') {
      newItems.forEach((item, i) => {
        if ((data._adRealCount + i + 1) % interval === 0) {
          const slot = this._createAdSlot(fullWidth);
          item.after(slot);
          newSlots.push(slot);
        }
      });
    } else if (mode === 'random') {
      let pageOffset = data._adRealCount % interval;
      let i = 0;
      while (i < newItems.length) {
        const remaining = interval - pageOffset;
        const chunk = newItems.slice(i, i + remaining);
        if (chunk.length === remaining) {
          const anchor = chunk[Math.floor(Math.random() * chunk.length)];
          const slot = this._createAdSlot(fullWidth);
          anchor.after(slot);
          newSlots.push(slot);
          pageOffset = 0;
        } else {
          pageOffset += chunk.length;
        }
        i += remaining;
      }
    }

    data._adRealCount += newItems.length;
    this._registerAdSlots(newSlots);
  }

  /**
   * Ad slots for a prepended block (motimeline-465). Entries count upward from
   * the old top entry (position 1): the last prepended one is 0, then -1, -2 …
   * every_n: a slot after each entry whose position is a multiple of interval.
   * random:  one slot per block of positions k·interval+1 … (k+1)·interval, placed
   *          once the block is complete; an incomplete top block waits in
   *          data._adTopPending for the next prepend.
   * The downward count (_adRealCount) is untouched.
   */
  _injectAdSlotsTop(topItems) {
    const data = this._getData();
    if (!data || !data.adSlots || !topItems.length) return;

    const { mode, interval, style } = data.adSlots;
    const fullWidth = style === 'fullwidth';
    const mod = (n) => ((n % interval) + interval) % interval;
    const newSlots = [];
    const placeAfter = (item) => {
      const slot = this._createAdSlot(fullWidth);
      item.after(slot);
      newSlots.push(slot);
    };

    let pos = data._adTopPos;
    let pending = data._adTopPending || [];
    for (let i = topItems.length - 1; i >= 0; i--) {
      const item = topItems[i];
      pos--;
      if (mode === 'every_n') {
        if (mod(pos) === 0) placeAfter(item);
      } else if (mode === 'random') {
        pending.unshift(item);
        // The block's first entry completes it.
        if (mod(pos - 1) === 0) {
          placeAfter(pending[Math.floor(Math.random() * pending.length)]);
          pending = [];
        }
      }
    }
    data._adTopPos = pos;
    data._adTopPending = pending;
    this._registerAdSlots(newSlots);
  }

  // Hands new ad slots to the observers and re-runs the layout. `position` for
  // onEnterViewport is the slot's child index at this moment.
  _registerAdSlots(slots) {
    if (!slots.length) return;
    const children = Array.from(this.element.children);
    slots.forEach((slot) => {
      slot.dataset.moAdPosition = String(children.indexOf(slot));
      if (this._adObserver) this._adObserver.observe(slot);
      if (this._adResizeObserver) this._adResizeObserver.observe(slot);
    });
    this._observeItems(slots);
    this.refresh();
  }

  _createAdSlot(fullWidth) {
    const slot = document.createElement('li');
    // `mo-item` carries the layout rules (float/width); `js-mo-item` is deliberately
    // omitted so _initItems() and filterByCategory() never treat a slot as a real item.
    slot.className = 'mo-item mo-ad-slot';
    const { ads } = this._getData().adSlots;
    const ad = pickAd(ads);
    // An entry's own `style` overrides the list width, so the slot is sized
    // before it enters the DOM and the next refresh() places it correctly.
    const style = ad && ad.style;
    if (style === 'card' || style === 'fullwidth') fullWidth = style === 'fullwidth';
    if (fullWidth) slot.classList.add('mo-fullwidth');
    if (ad) this._renderAd(slot, ad);
    return slot;
  }

  // Fills a slot from an `adSlots.ads` entry using DOM APIs only — the entry is
  // data, never HTML. target/rel are always set here, not taken from the entry.
  _renderAd(slot, ad) {
    const { onAdClick } = this._getData().adSlots;
    slotAds.set(slot, ad);
    slot.classList.add('mo-ad-filled');

    if (ad.label != null && ad.label !== '') {
      const label = document.createElement('span');
      label.className = 'mo-ad-label';
      label.textContent = String(ad.label);
      slot.appendChild(label);
    }

    let img = null;
    if (ad.image) {
      img = document.createElement('img');
      img.className = 'mo-ad-image';
      img.src = String(ad.image);
      img.alt = ad.alt == null ? '' : String(ad.alt);
    }

    const href = safeAdHref(ad.url);
    if (!href) {
      if (img) slot.appendChild(img);
      return;
    }
    const link = document.createElement('a');
    link.className = 'mo-ad-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener sponsored';
    if (img) link.appendChild(img);
    else link.textContent = ad.alt == null ? href : String(ad.alt);
    if (typeof onAdClick === 'function') {
      link.addEventListener('click', () => onAdClick(ad, slot));
    }
    slot.appendChild(link);
  }

  // ─── Scroll hold for prependItems() (motimeline-465) ────────────────────────
  // An anchor is an element plus its distance to the top of the view. While a
  // hold runs, every size change of the list scrolls by the anchor's drift, so
  // the visible content stays put while new items and their images grow above.

  // Nearest scrolling ancestor, or null for the window.
  _scroller() {
    const root = document.documentElement;
    for (let n = this.element.parentElement; n && n !== document.body && n !== root; n = n.parentElement) {
      const overflowY = getComputedStyle(n).overflowY;
      if (/^(auto|scroll|overlay)$/.test(overflowY) && n.scrollHeight > n.clientHeight) return n;
    }
    return null;
  }

  _viewTop(scroller) {
    return scroller ? scroller.getBoundingClientRect().top + scroller.clientTop : 0;
  }

  _scrollTop(scroller) {
    return scroller ? scroller.scrollTop : window.scrollY;
  }

  // The first item reaching into the view; null while the list lies below the
  // view, since then nothing visible moves.
  _scrollAnchor() {
    const scroller = this._scroller();
    const viewTop = this._viewTop(scroller);
    const viewHeight = scroller ? scroller.clientHeight : window.innerHeight;
    const list = this.element.getBoundingClientRect();
    if (list.top >= viewTop + viewHeight) return null;
    if (list.bottom <= viewTop) {
      return { scroller, el: this.element, edge: 'bottom', offset: list.bottom - viewTop };
    }
    const el = Array.from(this.element.children).find((c) => {
      const r = c.getBoundingClientRect();
      return r.height > 0 && r.bottom > viewTop;
    });
    if (!el) return null;
    return { scroller, el, edge: 'top', offset: el.getBoundingClientRect().top - viewTop };
  }

  // The anchor as the view was before `topItems` went in: they leave the layout
  // for the measurement, so the call also works after the DOM insert
  // (initNewItems()). A hold still running keeps its anchor.
  _anchorBefore(topItems) {
    const display = topItems.map((li) => li.style.display);
    topItems.forEach((li) => { li.style.display = 'none'; });
    this._correctScroll();
    const anchor = this._hold ? this._hold.anchor : this._scrollAnchor();
    topItems.forEach((li, i) => { li.style.display = display[i]; });
    return anchor;
  }

  _anchorOffset(anchor) {
    const r = anchor.el.getBoundingClientRect();
    return (anchor.edge === 'bottom' ? r.bottom : r.top) - this._viewTop(anchor.scroller);
  }

  // Holds the anchor until every image in `els` has loaded or failed, plus
  // SCROLL_HOLD_SETTLE_MS for the debounced re-layout. Native scroll anchoring
  // is off meanwhile, so only the user and this hold move the scroll position.
  _holdScroll(anchor, els) {
    let hold = this._hold;
    if (hold && hold.scroller !== anchor.scroller) {
      this._releaseScroll();
      hold = null;
    }
    if (!hold) {
      const scroller = anchor.scroller;
      const styled = scroller ? [scroller] : [document.documentElement, document.body];
      hold = this._hold = {
        scroller,
        pending: 0,
        timer: null,
        styled: styled.map((n) => [n, n.style.overflowAnchor]),
        ro: typeof ResizeObserver === 'function'
          ? new ResizeObserver(() => this._correctScroll())
          : null,
        // A scroll the hold did not cause is the user's: the anchor moves with it.
        onScroll: () => {
          const top = this._scrollTop(hold.scroller);
          hold.anchor.offset -= top - hold.top;
          hold.top = top;
        },
      };
      styled.forEach((n) => { n.style.overflowAnchor = 'none'; });
      (scroller || window).addEventListener('scroll', hold.onScroll, { passive: true });
      if (hold.ro) hold.ro.observe(this.element);
    }
    hold.anchor = anchor;

    const arm = () => {
      clearTimeout(hold.timer);
      hold.timer = setTimeout(() => {
        if (this._hold === hold) this._releaseScroll();
      }, SCROLL_HOLD_SETTLE_MS);
    };
    const done = () => {
      if (this._hold !== hold) return;
      if (--hold.pending === 0) arm();
    };
    els.forEach((li) => li.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      hold.pending++;
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }));
    if (hold.pending === 0) arm();
    else clearTimeout(hold.timer);

    this._correctScroll();
  }

  _correctScroll() {
    const hold = this._hold;
    if (!hold) return;
    const { anchor } = hold;
    if (!anchor.el.isConnected) {
      this._releaseScroll();
      return;
    }
    const delta = this._anchorOffset(anchor) - anchor.offset;
    if (Math.abs(delta) >= 0.5) {
      (hold.scroller || window).scrollBy({ top: delta, behavior: 'instant' });
    }
    hold.top = this._scrollTop(hold.scroller);
  }

  _releaseScroll() {
    const hold = this._hold;
    if (!hold) return;
    this._hold = null;
    clearTimeout(hold.timer);
    if (hold.ro) hold.ro.disconnect();
    (hold.scroller || window).removeEventListener('scroll', hold.onScroll);
    hold.styled.forEach(([n, value]) => { n.style.overflowAnchor = value; });
  }

  _observeItems(items) {
    if (!this._observer) return;
    items.forEach((item) => {
      if (!item.classList.contains('mo-visible')) {
        this._observer.observe(item);
      }
    });
  }
}

export default MoTimeline;
