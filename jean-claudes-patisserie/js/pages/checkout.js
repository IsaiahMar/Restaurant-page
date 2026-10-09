import { mountLayout } from '../components/layout.js';
import { readForm, showErrors } from '../components/forms.js';
import { h, $, $$ } from '../lib/dom.js';
import { formatCents, parseDollarsToCents } from '../lib/money.js';
import { auth } from '../services/auth.js';
import { cart, priceLines } from '../services/cart.js';
import { menu } from '../services/menu-repo.js';
import { orders } from '../services/orders.js';
import { computeTotals, FREE_DELIVERY_THRESHOLD_CENTS } from '../services/pricing.js';
import { digitsOnly, validateCheckout } from '../services/validation.js';

mountLayout();

const form = $('#checkout-form');
const summary = $('#order-summary');
const emptyNotice = $('#checkout-empty');

function currentValues() {
  return readForm(form);
}

function totalsFor(values, subtotalCents) {
  const custom = values.tipChoice === 'custom' ? parseDollarsToCents(values.customTip) : null;
  return computeTotals({
    subtotalCents,
    fulfillment: values.fulfillment,
    tipPercent: values.tipChoice === 'custom' ? 0 : Number(values.tipChoice),
    customTipCents: custom,
  });
}

function row(label, value, className = '') {
  return h('div', { class: `summary-row ${className}` }, h('dt', {}, label), h('dd', {}, value));
}

function renderSummary() {
  const { items, subtotalCents } = priceLines(cart.lines, menu.byId);
  const hasItems = items.length > 0;
  form.hidden = !hasItems;
  summary.hidden = !hasItems;
  emptyNotice.hidden = hasItems;
  if (!hasItems) return;

  const values = currentValues();
  const totals = totalsFor(values, subtotalCents);
  const deliveryLabel =
    values.fulfillment !== 'delivery' ? 'Pickup' : totals.deliveryCents === 0 ? 'Free' : formatCents(totals.deliveryCents);

  const freeDeliveryHint =
    values.fulfillment === 'delivery' && totals.deliveryCents > 0
      ? h('p', { class: 'hint' }, `Free delivery on orders over ${formatCents(FREE_DELIVERY_THRESHOLD_CENTS)}.`)
      : '';

  summary.replaceChildren(
    h('h2', { class: 'panel__title' }, 'Order summary'),
    h(
      'ul',
      { class: 'summary-items', role: 'list' },
      items.map((item) =>
        h(
          'li',
          {},
          h('span', {}, h('span', { class: 'summary-qty' }, `${item.quantity}×`), ' ', item.name),
          h('span', {}, formatCents(item.lineTotalCents)),
        ),
      ),
    ),
    h(
      'dl',
      { class: 'summary-totals' },
      row('Subtotal', formatCents(totals.subtotalCents)),
      row('Delivery', deliveryLabel),
      row('Tip', formatCents(totals.tipCents)),
      row('Total', formatCents(totals.totalCents), 'summary-row--total'),
    ),
    freeDeliveryHint,
  );
}

// Show only the fields that apply to the current choices. Hidden fieldsets are
// also `disabled`, which removes them from FormData and from the tab order.
function syncConditionalFields() {
  const values = currentValues();
  for (const group of $$('[data-show-when]', form)) {
    const [name, expected] = group.dataset.showWhen.split('=');
    const visible = values[name] === expected;
    group.hidden = !visible;
    group.disabled = !visible;
  }
}

// Light input formatting: "4242424242424242" -> "4242 4242 4242 4242", "0927" -> "09/27".
form.elements.cardNumber.addEventListener('input', (event) => {
  event.target.value = digitsOnly(event.target.value).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
});
form.elements.cardExpiry.addEventListener('input', (event) => {
  const digits = digitsOnly(event.target.value).slice(0, 4);
  event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});

form.addEventListener('change', () => {
  syncConditionalFields();
  renderSummary();
});
form.addEventListener('input', renderSummary);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = currentValues();
  if (!showErrors(form, validateCheckout(values))) return;

  // Re-price from the menu at submit time; the summary on screen is never trusted.
  const { items, subtotalCents } = priceLines(cart.lines, menu.byId);
  if (!items.length) return renderSummary();

  const order = orders.place({
    customer: { name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() },
    fulfillment: values.fulfillment,
    address: { street: values.address?.trim(), city: values.city?.trim(), notes: values.notes?.trim() },
    payment: values.payment === 'card' ? { method: 'card', last4: digitsOnly(values.cardNumber).slice(-4) } : { method: 'counter' },
    items,
    totals: totalsFor(values, subtotalCents),
  });

  cart.clear();
  location.assign(`confirmation.html?order=${encodeURIComponent(order.id)}`);
});

// Prefill for logged-in customers.
const user = auth.currentUser();
if (user) {
  form.elements.name.value = user.name;
  form.elements.email.value = user.email;
}

cart.subscribe(renderSummary);
syncConditionalFields();
renderSummary();
