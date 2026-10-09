import { h } from '../lib/dom.js';
import { cart } from '../services/cart.js';
import { auth } from '../services/auth.js';
import { icon } from './icons.js';
import { mountCartDrawer } from './cart-drawer.js';
import { toast } from './toast.js';

// One header and footer for every page. The original site copy-pasted the nav
// into eleven HTML files, and they had drifted apart (broken links, different
// labels). Each page now just declares <body data-page="...">.

const NAV = [
  { page: 'home', href: 'index.html', label: 'Home' },
  { page: 'menu', href: 'menu.html', label: 'Menu' },
  { page: 'about', href: 'about.html', label: 'Our Story' },
  { page: 'contact', href: 'contact.html', label: 'Visit' },
];

function accountArea(user) {
  if (!user) {
    return h('a', { class: 'header-link', href: `login.html?next=${encodeURIComponent(location.pathname.split('/').pop() || 'index.html')}` }, 'Log in');
  }
  return h(
    'div',
    { class: 'account' },
    user.role === 'manager' ? h('a', { class: 'header-link', href: 'admin.html' }, 'Manage menu') : null,
    h('span', { class: 'account__name' }, `Hi, ${user.name.split(' ')[0]}`),
    h(
      'button',
      {
        type: 'button',
        class: 'header-link',
        onclick: () => {
          auth.logOut();
          toast('You’re logged out.');
          if (document.body.dataset.requiresManager !== undefined) location.replace('index.html');
          else renderAccount();
        },
      },
      'Log out',
    ),
  );
}

let accountSlot;
function renderAccount() {
  accountSlot.replaceChildren(accountArea(auth.currentUser()));
}

function header(activePage, drawer) {
  const nav = h(
    'nav',
    { id: 'site-nav', class: 'site-nav', 'aria-label': 'Main' },
    h(
      'ul',
      { role: 'list' },
      NAV.map(({ page, href, label }) => h('li', {}, h('a', { href, 'aria-current': page === activePage ? 'page' : undefined }, label))),
    ),
  );

  const toggle = h(
    'button',
    {
      type: 'button',
      class: 'icon-btn nav-toggle',
      'aria-controls': 'site-nav',
      'aria-expanded': 'false',
      'aria-label': 'Open menu',
      onclick: () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        toggle.replaceChildren(icon(open ? 'close' : 'menu'));
        nav.classList.toggle('is-open', open);
      },
    },
    icon('menu'),
  );

  const badge = h('span', { class: 'cart-btn__count' });
  const cartButton = h('button', { type: 'button', class: 'icon-btn cart-btn', onclick: drawer.open }, icon('bag'), badge);
  const updateBadge = () => {
    badge.textContent = cart.count;
    badge.hidden = cart.count === 0;
    cartButton.setAttribute('aria-label', `Open cart, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}`);
  };
  cart.subscribe(updateBadge);
  updateBadge();

  accountSlot = h('div', { class: 'account-slot' });
  renderAccount();

  return h(
    'div',
    { class: 'container header-inner' },
    h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'brand__name' }, 'Jean-Claude’s'), h('span', { class: 'brand__sub' }, 'Pâtisserie · Èze')),
    nav,
    h('div', { class: 'header-actions' }, accountSlot, cartButton, toggle),
  );
}

function footer() {
  const year = new Date().getFullYear();
  return h(
    'div',
    { class: 'container footer-inner' },
    h(
      'div',
      { class: 'footer-brand' },
      h('p', { class: 'brand__name' }, 'Jean-Claude’s'),
      h('p', {}, 'A family bakery on the Côte d’Azur since 1994.'),
    ),
    h(
      'div',
      {},
      h('h2', { class: 'footer-heading' }, 'Hours'),
      h('p', {}, 'Tue–Sun · 7:00–18:00'),
      h('p', {}, 'Closed Mondays'),
    ),
    h(
      'div',
      {},
      h('h2', { class: 'footer-heading' }, 'Find us'),
      h('p', {}, '12 Rue de la Paix, 06360 Èze'),
      h('p', {}, h('a', { href: 'contact.html' }, 'Directions & contact')),
    ),
    h(
      'p',
      { class: 'footer-legal' },
      `© ${year} Jean-Claude’s Pâtisserie, a fictional bakery. Portfolio project, no real orders are placed.`,
    ),
  );
}

export function mountLayout() {
  const page = document.body.dataset.page;
  const drawer = mountCartDrawer();
  document.querySelector('.site-header')?.append(header(page, drawer));
  document.querySelector('.site-footer')?.append(footer());

  // Header gets a solid background once the page scrolls (replaces the original onscroll handler).
  const headerEl = document.querySelector('.site-header');
  const sentinel = h('div', { class: 'scroll-sentinel', 'aria-hidden': 'true' });
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => headerEl?.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(sentinel);

  return { drawer };
}
