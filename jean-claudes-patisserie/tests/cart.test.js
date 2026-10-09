import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { addLine, setLineQuantity, removeLine, countItems, priceLines, createCart, MAX_QUANTITY } from '../js/services/cart.js';
import { createStorage, memoryBackend } from '../js/lib/storage.js';

const menu = {
  croissant: { id: 'croissant', name: 'Croissant', priceCents: 450 },
  espresso: { id: 'espresso', name: 'Espresso', priceCents: 300 },
};
const findItem = (id) => menu[id] ?? null;

describe('cart state transitions', () => {
  test('adding a new item creates a line', () => {
    assert.deepEqual(addLine([], 'croissant'), [{ id: 'croissant', quantity: 1 }]);
  });

  test('adding an existing item increments instead of duplicating', () => {
    const lines = addLine(addLine([], 'croissant'), 'croissant', 2);
    assert.deepEqual(lines, [{ id: 'croissant', quantity: 3 }]);
  });

  test('transitions never mutate their input', () => {
    const lines = Object.freeze([Object.freeze({ id: 'croissant', quantity: 1 })]);
    assert.doesNotThrow(() => {
      addLine(lines, 'croissant');
      setLineQuantity(lines, 'croissant', 5);
      removeLine(lines, 'croissant');
    });
  });

  test('quantity is clamped to the maximum', () => {
    assert.equal(setLineQuantity([{ id: 'croissant', quantity: 1 }], 'croissant', 999)[0].quantity, MAX_QUANTITY);
  });

  test('setting quantity to zero or below removes the line', () => {
    assert.deepEqual(setLineQuantity([{ id: 'croissant', quantity: 2 }], 'croissant', 0), []);
    assert.deepEqual(setLineQuantity([{ id: 'croissant', quantity: 2 }], 'croissant', -3), []);
  });

  test('countItems sums quantities', () => {
    assert.equal(countItems([{ id: 'a', quantity: 2 }, { id: 'b', quantity: 3 }]), 5);
  });
});

describe('priceLines', () => {
  test('computes line totals and subtotal in cents', () => {
    const { items, subtotalCents } = priceLines([{ id: 'croissant', quantity: 3 }, { id: 'espresso', quantity: 1 }], findItem);
    assert.equal(items[0].lineTotalCents, 1350);
    assert.equal(subtotalCents, 1650);
  });

  test('drops items that are no longer on the menu', () => {
    const { items, subtotalCents } = priceLines([{ id: 'discontinued', quantity: 2 }, { id: 'espresso', quantity: 1 }], findItem);
    assert.deepEqual(items.map((item) => item.id), ['espresso']);
    assert.equal(subtotalCents, 300);
  });

  test('uses the current menu price, not a price saved with the cart', () => {
    const { subtotalCents } = priceLines([{ id: 'espresso', quantity: 1, priceCents: 1 }], findItem);
    assert.equal(subtotalCents, 300);
  });
});

describe('cart store', () => {
  test('persists across instances that share storage', () => {
    const storage = createStorage(memoryBackend());
    createCart(storage).add('croissant', 2);
    assert.deepEqual(createCart(storage).lines, [{ id: 'croissant', quantity: 2 }]);
  });

  test('notifies subscribers and supports unsubscribe', () => {
    const cart = createCart(createStorage(memoryBackend()));
    const seen = [];
    const unsubscribe = cart.subscribe((lines) => seen.push(countItems(lines)));
    cart.add('croissant');
    cart.add('croissant');
    unsubscribe();
    cart.clear();
    assert.deepEqual(seen, [1, 2]);
  });

  test('recovers from corrupted storage', () => {
    const backend = memoryBackend();
    backend.setItem('jcp:cart', '{not json');
    assert.deepEqual(createCart(createStorage(backend)).lines, []);

    backend.setItem('jcp:cart', JSON.stringify([{ id: 'croissant', quantity: 'lots' }, null, { id: 'espresso', quantity: 2 }]));
    assert.deepEqual(createCart(createStorage(backend)).lines, [{ id: 'espresso', quantity: 2 }]);
  });
});
