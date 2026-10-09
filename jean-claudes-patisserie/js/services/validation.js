// Form validation as pure functions: each validator takes plain values and returns
// an object mapping field name -> error message. An empty object means valid.
// The pages decide how to display errors; nothing here touches the DOM.

import { parseDollarsToCents } from '../lib/money.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');
const blank = (value) => String(value ?? '').trim() === '';

export function isValidEmail(value) {
  return EMAIL.test(String(value ?? '').trim());
}

export function isValidPhone(value) {
  const digits = digitsOnly(value);
  return digits.length >= 10 && digits.length <= 15;
}

/** Luhn checksum: catches typos in card numbers before they ever reach a processor. */
export function passesLuhn(cardNumber) {
  const digits = digitsOnly(cardNumber);
  if (digits.length < 12 || digits.length > 19) return false;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Accepts "MM/YY" or "MM/YYYY". A card is valid through the last day of its month. */
export function isValidExpiry(value, now = new Date()) {
  const match = /^\s*(\d{1,2})\s*\/\s*(\d{2}|\d{4})\s*$/.exec(String(value ?? ''));
  if (!match) return false;

  const month = Number(match[1]);
  let year = Number(match[2]);
  if (year < 100) year += 2000;
  if (month < 1 || month > 12) return false;

  const firstDayAfterExpiry = new Date(year, month, 1);
  const tooFarOut = new Date(now.getFullYear() + 20, now.getMonth(), 1);
  return now < firstDayAfterExpiry && firstDayAfterExpiry <= tooFarOut;
}

export function isValidCvc(value) {
  return /^\d{3,4}$/.test(String(value ?? '').trim());
}

export function validateCheckout(values, now = new Date()) {
  const errors = {};

  if (blank(values.name)) errors.name = 'Enter your name.';
  if (!isValidEmail(values.email)) errors.email = 'Enter a valid email, like you@example.com.';
  if (!isValidPhone(values.phone)) errors.phone = 'Enter a phone number with at least 10 digits.';

  if (values.fulfillment === 'delivery') {
    if (blank(values.address)) errors.address = 'Enter a street address for delivery.';
    if (blank(values.city)) errors.city = 'Enter a city.';
  }

  if (values.tipChoice === 'custom' && parseDollarsToCents(values.customTip) === null) {
    errors.customTip = 'Enter a tip amount, like 3.50.';
  }

  if (values.payment === 'card') {
    if (blank(values.cardName)) errors.cardName = 'Enter the name on the card.';
    if (!passesLuhn(values.cardNumber)) errors.cardNumber = 'That card number doesn’t look right.';
    if (!isValidExpiry(values.cardExpiry, now)) errors.cardExpiry = 'Enter a future date as MM/YY.';
    if (!isValidCvc(values.cardCvc)) errors.cardCvc = 'Enter the 3 or 4 digit security code.';
  }

  return errors;
}

export function validateSignUp({ name, email, password }) {
  const errors = {};
  if (blank(name)) errors.name = 'Enter your name.';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (String(password ?? '').length < 8) errors.password = 'Use at least 8 characters.';
  return errors;
}

export function validateLogIn({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (blank(password)) errors.password = 'Enter your password.';
  return errors;
}

export function validateContact({ name, email, message }) {
  const errors = {};
  if (blank(name)) errors.name = 'Enter your name.';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (String(message ?? '').trim().length < 10) errors.message = 'Tell us a little more (10+ characters).';
  return errors;
}

/** Only allow site-relative paths or http(s) URLs, so a `javascript:` URL can't be saved as an image. */
export function isSafeImageUrl(value) {
  const text = String(value ?? '').trim();
  if (/^assets\/[\w./-]+$/.test(text)) return true;
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateMenuItem({ name, description, price, category, image }, categoryIds) {
  const errors = {};
  if (blank(name)) errors.name = 'Enter a name.';
  else if (String(name).trim().length > 60) errors.name = 'Keep the name under 60 characters.';
  if (blank(description)) errors.description = 'Enter a short description.';
  const cents = parseDollarsToCents(price);
  if (cents === null || cents === 0) errors.price = 'Enter a price, like 4.50.';
  if (!categoryIds.includes(category)) errors.category = 'Choose a section.';
  if (!blank(image) && !isSafeImageUrl(image)) errors.image = 'Use an https:// image URL or leave blank.';
  return errors;
}
