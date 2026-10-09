import { h } from '../lib/dom.js';
import { formatCents } from '../lib/money.js';
import { cart } from '../services/cart.js';
import { toast } from './toast.js';
import { icon } from './icons.js';

const PLACEHOLDER = 'assets/img/placeholder.svg';
const TAG_LABELS = { vegan: 'Vegan', vegetarian: 'Vegetarian', 'gluten-free': 'Gluten-free' };

export function menuCard(item, { headingLevel = 3 } = {}) {
  const image = h('img', {
    class: 'card__img',
    src: item.image || PLACEHOLDER,
    alt: '',
    width: 720,
    height: 720,
    loading: 'lazy',
    decoding: 'async',
  });
  // A broken manager-entered URL shouldn't leave a broken-image icon on the menu.
  image.addEventListener('error', () => {
    if (!image.src.endsWith(PLACEHOLDER)) image.src = PLACEHOLDER;
  });

  const tags = (item.tags ?? []).filter((tag) => TAG_LABELS[tag]);

  return h(
    'article',
    { class: 'card', dataset: { id: item.id } },
    h('div', { class: 'card__media' }, image),
    h(
      'div',
      { class: 'card__body' },
      h('div', { class: 'card__heading' }, h(`h${headingLevel}`, { class: 'card__title' }, item.name), h('p', { class: 'card__price' }, formatCents(item.priceCents))),
      h('p', { class: 'card__desc' }, item.description),
      tags.length ? h('ul', { class: 'tags', role: 'list', 'aria-label': 'Dietary' }, tags.map((tag) => h('li', { class: 'tag' }, TAG_LABELS[tag]))) : null,
      h(
        'button',
        {
          type: 'button',
          class: 'btn btn--primary card__add',
          'aria-label': `Add ${item.name} to order`,
          onclick: () => {
            cart.add(item.id);
            toast(`${item.name} added — ${cart.quantityOf(item.id)} in your bag`);
          },
        },
        icon('plus', { size: 16 }),
        'Add',
      ),
    ),
  );
}
