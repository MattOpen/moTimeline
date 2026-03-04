/*!
 * moTimeline v2.2.0
 * Responsive two-column timeline layout library
 * https://github.com/MattOpen/moTimeline
 * MIT License
 */

import './moTimeline.css';

const instanceData = new WeakMap();

const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 992,
  lg: 1200,
};

const DEFAULTS = {
  columnCount: { xs: 1, sm: 2, md: 2, lg: 2 },
  badgeShow: false,
  arrowShow: false,
  theme: false,
};

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

function getPosition(el) {
  if (!el) return { o: 0, h: 0, gppu: 0 };
  return {
    o: el.offsetTop,
    h: el.offsetHeight,
    gppu: el.offsetTop + el.offsetHeight,
  };
}

function prevAll(el, selector) {
  const results = [];
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (!selector || sibling.matches(selector)) results.push(sibling);
    sibling = sibling.previousElementSibling;
  }
  return results;
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

    const children = Array.from(el.children);
    if (children.length === 0) return;

    this._initItems();
    this._initialized = true;

    window.addEventListener('resize', this._resizeHandler);
  }

  refresh() {
    MoTimeline.instances.forEach((instance) => {
      const el = instance.element;
      const data = instanceData.get(el);
      if (!data) return;

      data.col = data.columnCount[getBreakpoint()];
      instance._setDivider();

      Array.from(el.children).forEach((child) => {
        instance._setPostPosition(child);
      });
    });
  }

  initNewItems() {
    this._initItems();
  }

  destroy() {
    window.removeEventListener('resize', this._resizeHandler);
    instanceData.delete(this.element);
    MoTimeline.instances.delete(this);
    this.element.classList.remove('mo-timeline', 'mo-theme', 'mo-twocol');
    Array.from(this.element.children).forEach((child) => {
      child.classList.remove('mo-item', 'js-mo-item', 'mo-inverted', 'js-mo-inverted', 'mo-offset');
      child.querySelectorAll('.js-mo-badge, .js-mo-arrow').forEach((b) => b.remove());
    });
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _getData() {
    return instanceData.get(this.element);
  }

  _setDivider() {
    const data = this._getData();
    if (!data) return;
    data.col = data.columnCount[getBreakpoint()];
    this.element.classList.toggle('mo-twocol', data.col > 1);
  }

  _initItems() {
    const el = this.element;
    const data = this._getData();
    if (!data) return;

    const lastItemIdx = data.lastItemIdx;
    const allChildren = Array.from(el.children);
    const newItems = allChildren.slice(lastItemIdx);

    if (newItems.length === 0) return;

    // Assign IDs and base class
    newItems.forEach((item, i) => {
      if (!item.id) {
        item.id = 'moT' + crypto.randomUUID() + '_' + (i + lastItemIdx);
      }
      item.classList.add('mo-item', 'js-mo-item');
    });

    this._setDivider();

    // Badges / arrows
    newItems.forEach((item, i) => {
      if (data.badgeShow) {
        this._createBadge(item, i + lastItemIdx + 1);
      }
      if (data.arrowShow) {
        this._createArrow(item);
      }
    });

    data.lastItemIdx = allChildren.length;
    instanceData.set(el, data);

    this.refresh();
  }

  _setPostPosition(el) {
    const result = this._getLeftOrRight(el);
    if (!result) return;

    el.classList.toggle('mo-inverted', result.lr > 0);
    el.classList.toggle('js-mo-inverted', result.lr > 0);
    el.classList.toggle('mo-offset', result.badge_offset > 0);
  }

  _getLeftOrRight(el) {
    if (!el) return null;

    const data = this._getData();
    if (!data) return null;

    const col = data.col;

    const prevInverted = prevAll(el, '.js-mo-inverted')[0] || null;
    const prevLeft = prevAll(el, '.js-mo-item:not(.js-mo-inverted)')[0] || null;

    const l = getPosition(prevLeft);
    const r = getPosition(prevInverted);
    const e = getPosition(el);

    let pos = 0;
    let bo = 0;

    if (col > 1) {
      if (l.gppu > e.o) pos = 1;
      if (r.gppu > l.gppu) pos = 0;

      // Badge collision: the LATER item (current, higher DOM index) gets the
      // offset — never the earlier one. Compare against the immediately
      // preceding sibling regardless of which column it is in.
      const prev = el.previousElementSibling;
      if (prev && Math.abs(e.o - getPosition(prev).o) < 40) bo = 1;
    }

    return { lr: pos, badge_offset: bo };
  }

  _createBadge(el, idx) {
    const span = document.createElement('span');
    span.className = 'mo-badge js-mo-badge';
    span.textContent = idx;
    el.prepend(span);
  }

  _createArrow(el) {
    const span = document.createElement('span');
    span.className = 'mo-arrow js-mo-arrow';
    el.prepend(span);
  }
}

export default MoTimeline;
