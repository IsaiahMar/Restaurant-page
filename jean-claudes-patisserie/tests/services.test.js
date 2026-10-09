import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { createStorage, memoryBackend } from '../js/lib/storage.js';
import { createAuth, AuthError, DEMO_MANAGER, safeNextUrl } from '../js/services/auth.js';
import { createMenuRepository, slugify } from '../js/services/menu-repo.js';
import { createOrderService, PREP_MINUTES } from '../js/services/orders.js';
import { SEED_MENU, CATEGORIES } from '../js/data/menu.js';

const freshStorage = () => createStorage(memoryBackend());

describe('auth', () => {
  test('sign up, log out, log back in', async () => {
    const auth = createAuth(freshStorage());
    await auth.signUp({ name: 'Ada Lovelace', email: 'Ada@Example.com', password: 'correct horse' });
    assert.equal(auth.currentUser().email, 'ada@example.com');

    auth.logOut();
    assert.equal(auth.currentUser(), null);

    const user = await auth.logIn({ email: 'ada@example.com ', password: 'correct horse' });
    assert.deepEqual(user, { name: 'Ada Lovelace', email: 'ada@example.com', role: 'customer' });
  });

  test('passwords are never stored in plain text', async () => {
    const backend = memoryBackend();
    const auth = createAuth(createStorage(backend));
    await auth.signUp({ name: 'Ada', email: 'ada@example.com', password: 'correct horse' });
    const raw = backend.getItem('jcp:users');
    assert.ok(!raw.includes('correct horse'));
    assert.match(JSON.parse(raw)['ada@example.com'].hash, /^[0-9a-f]{64}$/);
  });

  test('wrong password and unknown email fail with the same message', async () => {
    const auth = createAuth(freshStorage());
    await auth.signUp({ name: 'Ada', email: 'ada@example.com', password: 'correct horse' });
    auth.logOut();

    const wrongPassword = await auth.logIn({ email: 'ada@example.com', password: 'nope' }).catch((e) => e);
    const unknownEmail = await auth.logIn({ email: 'who@example.com', password: 'nope' }).catch((e) => e);
    assert.ok(wrongPassword instanceof AuthError);
    assert.equal(wrongPassword.message, unknownEmail.message);
    assert.equal(auth.currentUser(), null);
  });

  test('duplicate sign-up is rejected', async () => {
    const auth = createAuth(freshStorage());
    await auth.signUp({ name: 'Ada', email: 'ada@example.com', password: 'correct horse' });
    await assert.rejects(auth.signUp({ name: 'Ada 2', email: 'ADA@example.com', password: 'another one' }), AuthError);
  });

  test('the demo manager can log in and has the manager role', async () => {
    const auth = createAuth(freshStorage());
    await auth.logIn({ email: DEMO_MANAGER.email, password: DEMO_MANAGER.password });
    assert.ok(auth.isManager());
  });

  test('post-login redirects only allow local pages', () => {
    assert.equal(safeNextUrl('checkout.html'), 'checkout.html');
    assert.equal(safeNextUrl('menu.html?category=drinks'), 'menu.html?category=drinks');
    assert.equal(safeNextUrl('https://evil.example'), 'index.html');
    assert.equal(safeNextUrl('//evil.example/x.html'), 'index.html');
    assert.equal(safeNextUrl('javascript:alert(1)'), 'index.html');
    assert.equal(safeNextUrl(null, 'menu.html'), 'menu.html');
  });
});

describe('menu repository', () => {
  test('starts from the seed menu', () => {
    const repo = createMenuRepository(freshStorage());
    assert.equal(repo.all().length, SEED_MENU.length);
    assert.ok(!repo.isCustomized());
  });

  test('add generates unique ids from names', () => {
    const repo = createMenuRepository(freshStorage());
    const first = repo.add({ name: 'Crème Brûlée', category: 'dessert', priceCents: 700, description: 'x' });
    const second = repo.add({ name: 'Crème Brûlée', category: 'dessert', priceCents: 700, description: 'x' });
    assert.equal(first, 'creme-brulee');
    assert.equal(second, 'creme-brulee-2');
  });

  test('update, remove and reset', () => {
    const repo = createMenuRepository(freshStorage());
    assert.ok(repo.update('espresso', { priceCents: 350, id: 'hijacked' }));
    assert.equal(repo.byId('espresso').priceCents, 350, 'id in a patch must not rename the item');

    assert.ok(repo.remove('espresso'));
    assert.equal(repo.byId('espresso'), null);
    assert.ok(!repo.remove('espresso'));

    repo.reset();
    assert.equal(repo.byId('espresso').priceCents, 300);
  });

  test('editing never mutates the shared seed data', () => {
    const repo = createMenuRepository(freshStorage());
    repo.update('espresso', { priceCents: 999 });
    assert.equal(SEED_MENU.find((item) => item.id === 'espresso').priceCents, 300);
  });

  test('slugify strips accents and punctuation', () => {
    assert.equal(slugify('  Pain au Chocolat (x2)! '), 'pain-au-chocolat-x2');
    assert.equal(slugify('!!!'), 'item');
  });
});

describe('seed data integrity', () => {
  test('ids are unique, categories exist, prices are positive integer cents', () => {
    const ids = new Set();
    const categories = new Set(CATEGORIES.map((c) => c.id));
    for (const item of SEED_MENU) {
      assert.ok(!ids.has(item.id), `duplicate id ${item.id}`);
      ids.add(item.id);
      assert.ok(categories.has(item.category), `${item.id} has unknown category ${item.category}`);
      assert.ok(Number.isInteger(item.priceCents) && item.priceCents > 0, `${item.id} has bad price`);
      assert.match(item.image, /^assets\/img\/menu\/[\w-]+\.jpg$/);
    }
  });
});

describe('orders', () => {
  test('placing an order stores a readable id, ready time, and only the card’s last four digits', () => {
    const placedAt = new Date('2026-10-07T09:00:00Z');
    const service = createOrderService(freshStorage(), { now: () => placedAt });
    const order = service.place({
      customer: { name: 'Ada', email: 'ada@example.com', phone: '0612345678' },
      fulfillment: 'delivery',
      address: { street: '1 Rue X', city: 'Èze' },
      payment: { method: 'card', last4: '4242' },
      items: [{ id: 'espresso', name: 'Espresso', priceCents: 300, quantity: 2, lineTotalCents: 600, description: 'not stored' }],
      totals: { subtotalCents: 600, deliveryCents: 499, tipCents: 0, totalCents: 1099 },
    });

    assert.match(order.id, /^JC-[A-HJ-NP-Z2-9]{6}$/);
    assert.equal(new Date(order.readyAt) - placedAt, PREP_MINUTES.delivery * 60_000);
    assert.deepEqual(service.get(order.id), order);
    assert.ok(!('description' in order.items[0]));
    assert.equal(service.get('JC-NOPE00'), null);
  });

  test('pickup orders drop the address', () => {
    const service = createOrderService(freshStorage());
    const order = service.place({ customer: {}, fulfillment: 'pickup', address: { street: 'x' }, payment: { method: 'counter' }, items: [], totals: {} });
    assert.equal(order.address, null);
  });
});
