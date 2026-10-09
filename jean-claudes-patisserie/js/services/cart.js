import { storage as defaultStorage } from '../lib/storage.js';

// The cart stores only { id, quantity }. Names and prices are always looked up
// from the current menu when the cart is priced, so a cart saved last week can
// never check out at last week's price, and a deleted item silently drops out.

export const MAX_QUANTITY = 20;
const KEY = 'cart';

const clamp = (quantity) => Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(quantity) || 0));

// ---- Pure state transitions (unit-tested) ---------------------------------

export function addLine(lines, id, quantity = 1) {
  const existing = lines.find((line) => line.id === id);
  if (!existing) return quantity > 0 ? [...lines, { id, quantity: clamp(quantity) }] : lines;
  return setLineQuantity(lines, id, existing.quantity + quantity);
}

export function setLineQuantity(lines, id, quantity) {
  const next = clamp(quantity);
  if (next === 0) return removeLine(lines, id);
  return lines.map((line) => (line.id === id ? { ...line, quantity: next } : line));
}

export function removeLine(lines, id) {
  return lines.filter((line) => line.id !== id);
}

export function countItems(lines) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Joins cart lines with menu data.
 * @param {{id: string, quantity: number}[]} lines
 * @param {(id: string) => object | null} findItem
 */
export function priceLines(lines, findItem) {
  const items = [];
  for (const line of lines) {
    const item = findItem(line.id);
    if (!item) continue;
    items.push({ ...item, quantity: line.quantity, lineTotalCents: item.priceCents * line.quantity });
  }
  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  return { items, subtotalCents };
}

// ---- Observable store ------------------------------------------------------

function sanitize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((line) => line && typeof line.id === 'string')
    .map((line) => ({ id: line.id, quantity: clamp(line.quantity) }))
    .filter((line) => line.quantity > 0);
}

export function createCart(storage = defaultStorage) {
  let lines = sanitize(storage.get(KEY, []));
  const listeners = new Set();

  const notify = () => listeners.forEach((listener) => listener(lines));
  const commit = (next) => {
    lines = next;
    storage.set(KEY, lines);
    notify();
  };

  // Keep multiple open tabs in sync.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== storage.keyFor(KEY)) return;
      lines = sanitize(storage.get(KEY, []));
      notify();
    });
  }

  return {
    get lines() {
      return lines;
    },
    get count() {
      return countItems(lines);
    },
    quantityOf: (id) => lines.find((line) => line.id === id)?.quantity ?? 0,
    add: (id, quantity = 1) => commit(addLine(lines, id, quantity)),
    setQuantity: (id, quantity) => commit(setLineQuantity(lines, id, quantity)),
    remove: (id) => commit(removeLine(lines, id)),
    clear: () => commit([]),
    /** Calls `listener(lines)` on every change. Returns an unsubscribe function. */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export const cart = createCart();
