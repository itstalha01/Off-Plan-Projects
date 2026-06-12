const pkr = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Format a raw PKR amount: 41125000 -> "PKR 41,125,000" */
export function formatPKR(amount: number): string {
  return `PKR ${pkr.format(Math.round(amount))}`;
}

/** Format a price expressed in millions: 25.9 -> "PKR 25.9 M" */
export function formatMillions(millions: number): string {
  const rounded = Math.round(millions * 10) / 10;
  return `PKR ${rounded} M`;
}

/** Format a per-sqft rate: 22000 -> "PKR 22,000/sqft" */
export function formatRate(rate: number): string {
  return `${pkr.format(rate)}/sqft`;
}
