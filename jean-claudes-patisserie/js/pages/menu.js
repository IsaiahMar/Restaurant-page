import { mountLayout } from '../components/layout.js';
import { menuCard } from '../components/menu-card.js';
import { CATEGORIES } from '../data/menu.js';
import { menu } from '../services/menu-repo.js';
import { h, $ } from '../lib/dom.js';

mountLayout();

// Filter state lives in the URL (?category=drinks&q=latte) so filtered views
// can be bookmarked and shared, and the back button behaves.
const params = new URLSearchParams(location.search);
const state = {
  category: CATEGORIES.some((c) => c.id === params.get('category')) ? params.get('category') : 'all',
  query: params.get('q') ?? '',
};

const fold = (text) => text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

function matches(item) {
  if (state.category !== 'all' && item.category !== state.category) return false;
  const query = fold(state.query.trim());
  return !query || fold(`${item.name} ${item.description} ${(item.tags ?? []).join(' ')}`).includes(query);
}

function syncUrl() {
  const next = new URLSearchParams();
  if (state.category !== 'all') next.set('category', state.category);
  if (state.query.trim()) next.set('q', state.query.trim());
  const qs = next.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

const filters = $('#menu-filters');
const results = $('#menu-results');
const status = $('#menu-status');
const search = $('#menu-search');

function renderFilters() {
  const options = [{ id: 'all', label: 'Everything' }, ...CATEGORIES];
  filters.replaceChildren(
    ...options.map(({ id, label }) =>
      h(
        'button',
        {
          type: 'button',
          class: 'chip',
          'aria-pressed': String(state.category === id),
          onclick: () => {
            state.category = id;
            update();
          },
        },
        label,
      ),
    ),
  );
}

function renderResults() {
  const all = menu.all();
  const visible = all.filter(matches);

  const sections = CATEGORIES.map((category) => {
    const items = visible.filter((item) => item.category === category.id);
    if (!items.length) return null;
    return h(
      'section',
      { class: 'menu-section', 'aria-labelledby': `section-${category.id}` },
      h('h2', { id: `section-${category.id}`, class: 'menu-section__title' }, category.label),
      h('div', { class: 'card-grid' }, items.map((item) => menuCard(item))),
    );
  }).filter(Boolean);

  if (sections.length) {
    results.replaceChildren(...sections);
  } else {
    results.replaceChildren(
      h(
        'div',
        { class: 'empty-state' },
        h('p', {}, `Nothing matches “${state.query.trim()}”.`),
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn--ghost',
            onclick: () => {
              state.query = '';
              state.category = 'all';
              search.value = '';
              update();
            },
          },
          'Clear filters',
        ),
      ),
    );
  }

  status.textContent = `Showing ${visible.length} of ${all.length} items`;
}

function update() {
  renderFilters();
  renderResults();
  syncUrl();
}

search.value = state.query;
search.addEventListener('input', () => {
  state.query = search.value;
  renderResults();
  syncUrl();
});

update();
