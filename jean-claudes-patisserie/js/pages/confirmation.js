import { mountLayout } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { h, $ } from '../lib/dom.js';
import { formatCents } from '../lib/money.js';
import { orders } from '../services/orders.js';

mountLayout();

const root = $('#confirmation');
const order = orders.get(new URLSearchParams(location.search).get('order'));

const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

if (!order) {
  root.replaceChildren(
    h(
      'div',
      { class: 'empty-state' },
      h('h1', {}, 'We couldn’t find that order'),
      h('p', {}, 'Order details are saved in this browser only. Try the link from the device you ordered on.'),
      h('a', { class: 'btn btn--primary', href: 'menu.html' }, 'Back to the menu'),
    ),
  );
} else {
  const firstName = order.customer.name.split(' ')[0];
  const readyAt = time.format(new Date(order.readyAt));
  const isDelivery = order.fulfillment === 'delivery';

  root.replaceChildren(
    h('div', { class: 'confirm-badge' }, icon('check', { size: 28 })),
    h('h1', {}, `Merci, ${firstName}!`),
    h('p', { class: 'lede' }, isDelivery ? `Your order is on its way around ${readyAt}.` : `Your order will be ready for pickup around ${readyAt}.`),
    h(
      'dl',
      { class: 'confirm-meta' },
      h('div', {}, h('dt', {}, 'Order number'), h('dd', { class: 'mono' }, order.id)),
      h('div', {}, h('dt', {}, isDelivery ? 'Delivering to' : 'Pick up at'), h('dd', {}, isDelivery ? `${order.address.street}, ${order.address.city}` : '12 Rue de la Paix, Èze')),
      h('div', {}, h('dt', {}, 'Payment'), h('dd', {}, order.payment.method === 'card' ? `Card ending ${order.payment.last4}` : 'Pay at the counter')),
    ),
    h(
      'section',
      { class: 'panel', 'aria-labelledby': 'receipt-title' },
      h('h2', { id: 'receipt-title', class: 'panel__title' }, 'Receipt'),
      h(
        'ul',
        { class: 'summary-items', role: 'list' },
        order.items.map((item) =>
          h('li', {}, h('span', {}, h('span', { class: 'summary-qty' }, `${item.quantity}×`), ' ', item.name), h('span', {}, formatCents(item.lineTotalCents))),
        ),
      ),
      h(
        'dl',
        { class: 'summary-totals' },
        summaryRow('Subtotal', order.totals.subtotalCents),
        isDelivery ? summaryRow('Delivery', order.totals.deliveryCents) : null,
        summaryRow('Tip', order.totals.tipCents),
        summaryRow('Total', order.totals.totalCents, 'summary-row--total'),
      ),
    ),
    h('p', { class: 'hint' }, `A copy was “sent” to ${order.customer.email}. This is a demo, so no email actually goes out.`),
    h('a', { class: 'btn btn--ghost', href: 'menu.html' }, 'Order something else'),
  );
}

function summaryRow(label, cents, className = '') {
  return h('div', { class: `summary-row ${className}` }, h('dt', {}, label), h('dd', {}, formatCents(cents)));
}
