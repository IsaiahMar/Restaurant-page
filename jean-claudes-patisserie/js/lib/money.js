// All prices are stored as integer cents so arithmetic never drifts
// (0.1 + 0.2 !== 0.3). Convert to dollars only at the display boundary.

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatCents(cents) {
  return usd.format(cents / 100);
}

/**
 * Parse user input like "12", "12.5" or "$12.50" into cents.
 * Returns null for anything that is not a non-negative amount with at most two decimals.
 */
export function parseDollarsToCents(input) {
  const text = String(input ?? '').trim().replace(/^\$/, '');
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
