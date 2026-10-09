import { h } from '../lib/dom.js';
import { formatCents } from '../lib/money.js';
import { cart, priceLines, MAX_QUANTITY } from '../services/cart.js';
import { menu } from '../services/menu-repo.js';
import { icon } from './icons.js';

// Slide-in cart built on <dialog>, which gives us focus trapping, Esc-to-close
// and an inert background for free instead of re-implementing them by hand.

export function quantityStepper(item) {
  const label = (action) => `${action} one ${item.name}`;
  return h(
    'div',
    { class: 'stepper', role: 'group', 'aria-label': `Quantity of ${item.name}` },
    h('button', { type: 'button', class: 'stepper__btn', 'aria-label': label('Remove'), onclick: () => cart.setQuantity(item.id, item.quantity - 1) }, icon('minus', { size: 16 })),
    h('output', { class: 'stepper__value', 'aria-live': 'polite' }, String(item.quantity)),
    h(
      'button',
      { type: 'button', class: 'stepper__btn', 'aria-label': label('Add'), disabled: item.quantity >= MAX_QUANTITY, onclick: () => cart.setQuantity(item.id, item.quantity + 1) },
      icon('plus', { size: 16 }),
    ),
  );
}

function lineItem(item) {
  return h(
    'li',
    { class: 'cart-line' },
    h('img', { class: 'cart-line__img', src: item.image, alt: '', width: 64, height: 64, loading: 'lazy' }),
    h(
      'div',
      { class: 'cart-line__body' },
      h('p', { class: 'cart-line__name' }, item.name),
      h('p', { class: 'cart-line__price' }, formatCents(item.priceCents)),
      quantityStepper(item),
    ),
    h('p', { class: 'cart-line__total' }, formatCents(item.lineTotalCents)),
  );
}

export function mountCartDrawer() {
  const list = h('ul', { class: 'cart-lines', role: 'list' });
  const subtotal = h('span', { class: 'cart-drawer__subtotal' });
  const checkout = h('a', { class: 'btn btn--primary btn--block', href: 'checkout.html' }, 'Checkout');
  const footer = h('div', { class: 'cart-drawer__footer' }, h('p', { class: 'cart-drawer__row' }, h('span', {}, 'Subtotal'), subtotal), checkout);
  const empty = h(
    'div',
    { class: 'empty-state' },
    h('p', {}, 'Your bag is empty.'),
    h('a', { class: 'btn btn--ghost', href: 'menu.html' }, 'Browse the menu'),
  );

  const dialog = h(
    'dialog',
    { class: 'cart-drawer', 'aria-labelledby': 'cart-title' },
    h(
      'div',
      { class: 'cart-drawer__panel' },
      h(
        'header',
        { class: 'cart-drawer__header' },
        h('h2', { id: 'cart-title' }, 'Your order'),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close cart', onclick: () => dialog.close() }, icon('close')),
      ),
      list,
      empty,
      footer,
    ),
  );

  // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  function render() {
    const { items, subtotalCents } = priceLines(cart.lines, menu.byId);
    // Re-rendering replaces the stepper buttons; restore keyboard focus to the
    // equivalent button (or the close button if that line was removed).
    const focused = list.contains(document.activeElement) ? document.activeElement.getAttribute('aria-label') : null;
    list.replaceChildren(...items.map(lineItem));
    if (focused) (list.querySelector(`[aria-label="${CSS.escape(focused)}"]`) ?? dialog.querySelector('.icon-btn')).focus();
    subtotal.textContent = formatCents(subtotalCents);
    empty.hidden = items.length > 0;
    footer.hidden = items.length === 0;
    list.hidden = items.length === 0;
  }

  cart.subscribe(render);
  render();
  document.body.append(dialog);

  return { open: () => dialog.showModal(), close: () => dialog.close() };
}
