/*!
 * moTimeline v2.14.0
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
  theme: false,
  showCounterStyle: 'counter', // 'counter' | 'image' | 'none'
  cardBorderRadius: '8px',
  avatarSize: '50px',
  cardMargin: '0.5rem 1.25rem 0.5rem 0.5rem',
  cardMarginInverted: '0.5rem 0.5rem 0.5rem 1.25rem',
  cardMarginFullWidth: '0.5rem',
  randomFullWidth: 0, // 0 = off; 0–1 = probability per item; true = 0.33
  animate: false,     // false | 'fade' | 'slide'
  renderCard: null,   // (item, cardEl) => void — custom card renderer; skips built-in HTML
  adSlots: null,      // { mode, interval, style, onEnterViewport } — see docs
};

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
    this.settings = Object.assign({}, DEFAULTS, options);
    this.settings.columnCount = Object.assign({}, DEFAULTS.columnCount, options.columnCount);
    this._resizeHandler = debounce(() => this.refresh(), 100);
    this._initialized = false;

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
    if (data.theme) el.classList.add('mo-theme');
    el.style.setProperty('--mo-card-border-radius', data.cardBorderRadius);
    el.style.setProperty('--mo-avatar-size', data.avatarSize);
    el.style.setProperty('--mo-card-margin', data.cardMargin);
    el.style.setProperty('--mo-card-margin-inverted', data.cardMarginInverted);
    el.style.setProperty('--mo-card-margin-fullwidth', data.cardMarginFullWidth);

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
      if (typeof data.adSlots.onEnterViewport === 'function') {
        this._adObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this._adObserver.unobserve(entry.target);
              data.adSlots.onEnterViewport(entry.target, Number(entry.target.dataset.moAdPosition));
            }
          });
        }, { threshold: 0.5 });
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
    if (data.showBadge && data.showCounterStyle === 'counter') {
      Array.from(el.querySelectorAll('.js-mo-item')).forEach((it, i) => {
        const badge = it.querySelector('.js-mo-badge');
        if (badge) badge.textContent = i + 1;
      });
    }

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

    // Remove all library-managed elements (real items + ad slots)
    Array.from(this.element.children).forEach((child) => {
      if (child.classList.contains('js-mo-item') || child.classList.contains('mo-ad-slot')) {
        child.remove();
      }
    });

    // Reset counters — ready for a fresh addItems() call
    data.lastItemIdx = 0;
    if (data.adSlots) data._adRealCount = 0;
  }

  destroy() {
    window.removeEventListener('resize', this._resizeHandler);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._adObserver) {
      this._adObserver.disconnect();
      this._adObserver = null;
    }
    Array.from(this.element.querySelectorAll('.mo-ad-slot')).forEach((s) => s.remove());
    instanceData.delete(this.element);
    MoTimeline.instances.delete(this);
    this.element.style.removeProperty('--mo-card-border-radius');
    this.element.style.removeProperty('--mo-avatar-size');
    this.element.style.removeProperty('--mo-card-margin');
    this.element.style.removeProperty('--mo-card-margin-inverted');
    this.element.style.removeProperty('--mo-card-margin-fullwidth');
    this.element.classList.remove('mo-timeline', 'mo-theme', 'mo-twocol', 'mo-animate', 'mo-animate-fade', 'mo-animate-slide', 'mo-rows', 'mo-stacked');
    Array.from(this.element.children).forEach((child) => {
      child.classList.remove('mo-item', 'js-mo-item', 'mo-inverted', 'js-mo-inverted', 'mo-offset', 'mo-fullwidth', 'js-mo-fullwidth', 'mo-visible', 'mo-filtered-out');
      child.style.removeProperty('grid-row');
      child.querySelectorAll('.js-mo-badge, .js-mo-arrow').forEach((b) => b.remove());
    });
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

  _initItems() {
    const el = this.element;
    const data = this._getData();
    if (!data) return;

    const lastItemIdx = data.lastItemIdx;
    const allChildren = Array.from(el.children);
    // Ad slots live among the children but are not entries: counting them here
    // would make them real items and stretch the configured interval.
    const newItems = allChildren.slice(lastItemIdx)
      .filter((c) => !c.classList.contains('mo-ad-slot'));

    if (newItems.length === 0) return;

    // Assign IDs and base class
    newItems.forEach((item, i) => {
      if (!item.id) {
        item.id = 'moT' + crypto.randomUUID() + '_' + (i + lastItemIdx);
      }
      item.classList.add('mo-item', 'js-mo-item');
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

    // Badges / arrows
    newItems.forEach((item, i) => {
      if (data.showBadge) {
        this._createBadge(item, i + lastItemIdx + 1);
      }
      if (data.showArrow) {
        this._createArrow(item);
      }
    });

    data.lastItemIdx = allChildren.length;
    instanceData.set(el, data);

    this._applyFilter(newItems);
    this.refresh();

    this._observeItems(newItems);
    this._injectAdSlots(newItems);

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
        child.classList.remove('mo-inverted', 'js-mo-inverted', 'mo-offset');
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

    let leftH = 0, rightH = 0, prevStart = -Infinity;
    Array.from(el.children).forEach((child) => {
      if (child.classList.contains('mo-filtered-out')) return;

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
    let needsRefresh = false;

    if (mode === 'every_n') {
      newItems.forEach((item, i) => {
        if ((data._adRealCount + i + 1) % interval === 0) {
          const slot = this._createAdSlot(fullWidth);
          item.after(slot);
          slot.dataset.moAdPosition = String(Array.from(el.children).indexOf(slot));
          if (this._adObserver) this._adObserver.observe(slot);
          if (fullWidth) needsRefresh = true;
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
          slot.dataset.moAdPosition = String(Array.from(el.children).indexOf(slot));
          if (this._adObserver) this._adObserver.observe(slot);
          if (fullWidth) needsRefresh = true;
          pageOffset = 0;
        } else {
          pageOffset += chunk.length;
        }
        i += remaining;
      }
    }

    data._adRealCount += newItems.length;
    if (needsRefresh) this.refresh();
  }

  _createAdSlot(fullWidth) {
    const slot = document.createElement('li');
    // `mo-item` carries the layout rules (float/width); `js-mo-item` is deliberately
    // omitted so _initItems() and filterByCategory() never treat a slot as a real item.
    slot.className = 'mo-item mo-ad-slot';
    if (fullWidth) slot.classList.add('mo-fullwidth');
    return slot;
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
