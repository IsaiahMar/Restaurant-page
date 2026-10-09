import { storage as defaultStorage } from '../lib/storage.js';

// Estimated prep time is a business rule, not a random number.
export const PREP_MINUTES = Object.freeze({ pickup: 20, delivery: 45 });

const KEY = 'orders';
const MAX_STORED = 20;
// No 0/O or 1/I so order numbers can be read aloud at the counter.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function createOrderId(crypto = globalThis.crypto) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return 'JC-' + [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('');
}

export function estimateReadyAt(placedAt, fulfillment) {
  const minutes = PREP_MINUTES[fulfillment] ?? PREP_MINUTES.pickup;
  return new Date(placedAt.getTime() + minutes * 60_000);
}

export function createOrderService(storage = defaultStorage, { now = () => new Date(), crypto = globalThis.crypto } = {}) {
  return {
    /**
     * Records an order. Card details are never stored, only the last four digits.
     * @returns the saved order
     */
    place({ customer, fulfillment, address, payment, items, totals }) {
      const placedAt = now();
      const order = {
        id: createOrderId(crypto),
        placedAt: placedAt.toISOString(),
        readyAt: estimateReadyAt(placedAt, fulfillment).toISOString(),
        customer,
        fulfillment,
        address: fulfillment === 'delivery' ? address : null,
        payment,
        items: items.map(({ id, name, priceCents, quantity, lineTotalCents }) => ({ id, name, priceCents, quantity, lineTotalCents })),
        totals,
      };
      const history = storage.get(KEY, []);
      storage.set(KEY, [order, ...history].slice(0, MAX_STORED));
      return order;
    },

    get(id) {
      return storage.get(KEY, []).find((order) => order.id === id) ?? null;
    },
  };
}

export const orders = createOrderService();
