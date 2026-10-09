// Order totals. Kept separate from the UI so checkout, confirmation and tests
// all agree on exactly one implementation of the math.

export const DELIVERY_FEE_CENTS = 499;
export const FREE_DELIVERY_THRESHOLD_CENTS = 4000;
export const TIP_PRESETS = [0, 10, 15, 20];

export function deliveryFeeCents(subtotalCents, fulfillment) {
  if (fulfillment !== 'delivery') return 0;
  return subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;
}

/**
 * @param {{ subtotalCents: number, fulfillment: 'pickup' | 'delivery', tipPercent?: number, customTipCents?: number | null }} input
 * A custom tip, when provided, wins over the percentage.
 */
export function computeTotals({ subtotalCents, fulfillment, tipPercent = 0, customTipCents = null }) {
  const deliveryCents = deliveryFeeCents(subtotalCents, fulfillment);
  const tipCents =
    customTipCents !== null && customTipCents !== undefined
      ? Math.max(0, Math.round(customTipCents))
      : Math.round((subtotalCents * Math.max(0, tipPercent)) / 100);

  return {
    subtotalCents,
    deliveryCents,
    tipCents,
    totalCents: subtotalCents + deliveryCents + tipCents,
  };
}
