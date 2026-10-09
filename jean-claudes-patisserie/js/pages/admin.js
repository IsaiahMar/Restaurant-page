import { mountLayout } from '../components/layout.js';
import { readForm, showErrors } from '../components/forms.js';
import { toast } from '../components/toast.js';
import { icon } from '../components/icons.js';
import { CATEGORIES } from '../data/menu.js';
import { h, $ } from '../lib/dom.js';
import { formatCents, parseDollarsToCents } from '../lib/money.js';
import { auth } from '../services/auth.js';
import { menu } from '../services/menu-repo.js';
import { validateMenuItem } from '../services/validation.js';

// Manager dashboard. Replaces the original contentEditable page, which let the
// manager edit raw HTML and saved whatever the DOM happened to contain.

const form = $('#item-form');
const table = $('#items-body');
const count = $('#items-count');
const resetButton = $('#reset-menu');


function priceInput(item) {
  const input = h('input', {
    class: 'input input--compact',
    type: 'text',
    inputMode: 'decimal',
    value: (item.priceCents / 100).toFixed(2),
    'aria-label': `Price of ${item.name} in dollars`,
  });
  input.addEventListener('change', () => {
    const cents = parseDollarsToCents(input.value);
    if (cents === null || cents === 0) {
      input.setAttribute('aria-invalid', 'true');
      toast('Enter a price like 4.50.', { tone: 'error' });
      return;
    }
    input.removeAttribute('aria-invalid');
    input.value = (cents / 100).toFixed(2);
    menu.update(item.id, { priceCents: cents });
    toast(`${item.name} is now ${formatCents(cents)}.`);
  });
  return input;
}

function featuredToggle(item) {
  const box = h('input', { type: 'checkbox', checked: Boolean(item.featured), 'aria-label': `Feature ${item.name} on the home page` });
  box.addEventListener('change', () => {
    menu.update(item.id, { featured: box.checked });
    toast(box.checked ? `${item.name} is featured on the home page.` : `${item.name} removed from the home page.`);
  });
  return box;
}

function itemRow(item) {
  const category = CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category;
  return h(
    'tr',
    {},
    h('th', { scope: 'row' }, h('div', { class: 'admin-item' }, h('img', { src: item.image || 'assets/img/placeholder.svg', alt: '', width: 40, height: 40, loading: 'lazy' }), item.name)),
    h('td', {}, category),
    h('td', {}, priceInput(item)),
    h('td', { class: 'center' }, featuredToggle(item)),
    h(
      'td',
      { class: 'right' },
      h(
        'button',
        {
          type: 'button',
          class: 'icon-btn icon-btn--danger',
          'aria-label': `Delete ${item.name}`,
          onclick: () => {
            if (!confirm(`Delete “${item.name}” from the menu?`)) return;
            menu.remove(item.id);
            toast(`${item.name} deleted.`);
            render();
          },
        },
        icon('trash', { size: 18 }),
      ),
    ),
  );
}

function render() {
  const items = menu.all();
  const ordered = CATEGORIES.flatMap((category) => items.filter((item) => item.category === category.id));
  table.replaceChildren(...ordered.map(itemRow));
  count.textContent = `${items.length} items`;
  resetButton.disabled = !menu.isCustomized();
}

function start() {
  mountLayout();
  $('#admin').hidden = false;

  form.elements.category.replaceChildren(
    new Option('Choose a section…', ''),
    ...CATEGORIES.map((category) => new Option(category.label, category.id)),
  );
  form.addEventListener('submit', onAddItem);
  resetButton.addEventListener('click', onReset);
  render();
}

function onAddItem(event) {
  event.preventDefault();
  const values = readForm(form);
  const errors = validateMenuItem(values, CATEGORIES.map((c) => c.id));
  if (!showErrors(form, errors)) return;

  menu.add({
    name: values.name.trim(),
    description: values.description.trim(),
    priceCents: parseDollarsToCents(values.price),
    category: values.category,
    image: values.image.trim(),
    tags: [],
  });
  form.reset();
  toast(`${values.name.trim()} added to the menu.`);
  render();
}

function onReset() {
  if (!confirm('Discard all edits and restore the original menu?')) return;
  menu.reset();
  toast('Menu restored to the original.');
  render();
}

// The page markup ships hidden; only a manager session ever reveals it.
if (auth.isManager()) start();
else location.replace('login.html?next=admin.html');
