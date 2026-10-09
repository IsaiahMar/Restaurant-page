import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  passesLuhn,
  isValidExpiry,
  isValidEmail,
  isValidPhone,
  isSafeImageUrl,
  validateCheckout,
  validateMenuItem,
} from '../js/services/validation.js';

const NOW = new Date(2026, 9, 7); // 7 Oct 2026

describe('card validation', () => {
  test('Luhn accepts well-known test numbers, with or without spaces', () => {
    assert.ok(passesLuhn('4242 4242 4242 4242'));
    assert.ok(passesLuhn('5555555555554444'));
    assert.ok(passesLuhn('378282246310005')); // Amex, 15 digits
  });

  test('Luhn rejects typos and junk', () => {
    assert.ok(!passesLuhn('4242 4242 4242 4241'));
    assert.ok(!passesLuhn('1234'));
    assert.ok(!passesLuhn('abcd efgh ijkl mnop'));
  });

  test('expiry is valid through the end of its month', () => {
    assert.ok(isValidExpiry('10/26', NOW));
    assert.ok(isValidExpiry('12/2030', NOW));
    assert.ok(!isValidExpiry('09/26', NOW));
  });

  test('expiry rejects bad months, formats, and dates too far out', () => {
    assert.ok(!isValidExpiry('13/27', NOW));
    assert.ok(!isValidExpiry('00/27', NOW));
    assert.ok(!isValidExpiry('1027', NOW));
    assert.ok(!isValidExpiry('01/2099', NOW));
  });
});

describe('contact fields', () => {
  test('email', () => {
    assert.ok(isValidEmail('a@b.co'));
    assert.ok(!isValidEmail('a@b'));
    assert.ok(!isValidEmail('no spaces@x.com'));
  });

  test('phone accepts common formatting', () => {
    assert.ok(isValidPhone('+33 6 12 34 56 78'));
    assert.ok(isValidPhone('(555) 123-4567'));
    assert.ok(!isValidPhone('12345'));
  });
});

describe('validateCheckout', () => {
  const base = { name: 'Ada', email: 'ada@example.com', phone: '0612345678', fulfillment: 'pickup', tipChoice: '0', payment: 'counter' };

  test('a complete pickup order paying at the counter is valid', () => {
    assert.deepEqual(validateCheckout(base, NOW), {});
  });

  test('delivery requires an address', () => {
    assert.deepEqual(Object.keys(validateCheckout({ ...base, fulfillment: 'delivery' }, NOW)).sort(), ['address', 'city']);
  });

  test('card payment validates every card field', () => {
    const errors = validateCheckout({ ...base, payment: 'card', cardNumber: '4242', cardExpiry: '01/20', cardCvc: '1' }, NOW);
    assert.deepEqual(Object.keys(errors).sort(), ['cardCvc', 'cardExpiry', 'cardName', 'cardNumber']);
  });

  test('custom tip must be an amount', () => {
    assert.ok(validateCheckout({ ...base, tipChoice: 'custom', customTip: 'lots' }, NOW).customTip);
    assert.deepEqual(validateCheckout({ ...base, tipChoice: 'custom', customTip: '2.50' }, NOW), {});
  });
});

describe('validateMenuItem', () => {
  const categories = ['bread', 'dessert'];
  const item = { name: 'Brioche', description: 'Soft and buttery.', price: '5.00', category: 'bread', image: '' };

  test('accepts a valid item with no image', () => {
    assert.deepEqual(validateMenuItem(item, categories), {});
  });

  test('rejects free items and unknown sections', () => {
    const errors = validateMenuItem({ ...item, price: '0', category: 'soup' }, categories);
    assert.ok(errors.price);
    assert.ok(errors.category);
  });

  test('blocks script URLs as images', () => {
    assert.ok(!isSafeImageUrl('javascript:alert(1)'));
    assert.ok(!isSafeImageUrl('data:text/html,<script>'));
    assert.ok(isSafeImageUrl('https://example.com/a.jpg'));
    assert.ok(isSafeImageUrl('assets/img/menu/bagel.jpg'));
    assert.ok(validateMenuItem({ ...item, image: 'javascript:alert(1)' }, categories).image);
  });
});
