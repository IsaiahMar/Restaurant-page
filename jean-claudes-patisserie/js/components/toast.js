import { h } from '../lib/dom.js';
import { icon } from './icons.js';

// Non-blocking notifications announced to screen readers through a polite live
// region. These replace the original site's alert() calls, which froze the page.

let region;

function ensureRegion() {
  if (!region) {
    region = h('div', { class: 'toast-region', role: 'status', 'aria-live': 'polite' });
    document.body.append(region);
  }
  return region;
}

export function toast(message, { tone = 'success', duration = 3200 } = {}) {
  const el = h('div', { class: `toast toast--${tone}` }, tone === 'success' ? icon('check', { size: 18 }) : null, h('span', {}, message));
  ensureRegion().append(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400); // fallback when reduced motion skips the transition
  }, duration);
}
