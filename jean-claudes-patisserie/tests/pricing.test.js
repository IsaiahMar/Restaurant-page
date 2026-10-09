import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { computeTotals, DELIVERY_FEE_CENTS, FREE_DELIVERY_THRESHOLD_CENTS } from '../js/services/pricing.js';
import { formatCents, parseDollarsToCents } from '../js/lib/money.js';

describe('computeTotals', () => {
  test('pickup has no delivery fee', () => {
    assert.deepEqual(computeTotals({ subtotalCents: 1000, fulfillment: 'pickup' }), {
      subtotalCents: 1000,
      deliveryCents: 0,
      tipCents: 0,
      totalCents: 1000,
    });
  });

  test('delivery under the threshold adds the fee', () => {
    const totals = computeTotals({ subtotalCents: 1000, fulfillment: 'delivery' });
    assert.equal(totals.deliveryCents, DELIVERY_FEE_CENTS);
    assert.equal(totals.totalCents, 1000 + DELIVERY_FEE_CENTS);
  });

  test('delivery is free at exactly the threshold', () => {
    assert.equal(computeTotals({ subtotalCents: FREE_DELIVERY_THRESHOLD_CENTS, fulfillment: 'delivery' }).deliveryCents, 0);
  });

  test('percentage tips are calculated on the subtotal and rounded to the cent', () => {
    // 15% of $12.34 = $1.851 -> $1.85
    assert.equal(computeTotals({ subtotalCents: 1234, fulfillment: 'delivery', tipPercent: 15 }).tipCents, 185);
  });

  test('a custom tip overrides the percentage', () => {
    const totals = computeTotals({ subtotalCents: 1000, fulfillment: 'pickup', tipPercent: 20, customTipCents: 350 });
    assert.equal(totals.tipCents, 350);
    assert.equal(totals.totalCents, 1350);
  });

  test('negative tips are treated as zero', () => {
    assert.equal(computeTotals({ subtotalCents: 1000, fulfillment: 'pickup', tipPercent: -10 }).tipCents, 0);
    assert.equal(computeTotals({ subtotalCents: 1000, fulfillment: 'pickup', customTipCents: -100 }).tipCents, 0);
  });
});

describe('money', () => {
  test('formats cents as dollars', () => {
    assert.equal(formatCents(450), '$4.50');
    assert.equal(formatCents(123456), '$1,234.56');
  });

  test('parses dollar input into integer cents without float error', () => {
    assert.equal(parseDollarsToCents('4.5'), 450);
    assert.equal(parseDollarsToCents('$12.30'), 1230);
    assert.equal(parseDollarsToCents(' 0.29 '), 29); // 0.29 * 100 === 28.999999999999996 in floats
    assert.equal(parseDollarsToCents('7'), 700);
  });

  test('rejects malformed amounts', () => {
    for (const bad of ['', 'abc', '-1', '1.234', '1,50', '.5']) {
      assert.equal(parseDollarsToCents(bad), null, `expected ${JSON.stringify(bad)} to be rejected`);
    }
  });
});
