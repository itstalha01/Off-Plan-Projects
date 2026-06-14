const pkr = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Round to ≤2 dp, drop trailing zeros, add thousands separators: 7.5 -> "7.5". */
function trim(n: number): string {
  return (Math.round(n * 100) / 100).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

/** Format a raw PKR amount: 41125000 -> "PKR 41,125,000" */
export function formatPKR(amount: number): string {
  return `PKR ${pkr.format(Math.round(amount))}`;
}

/**
 * Format a raw PKR amount in the Pakistani crore/lakh convention:
 * 200_000_000 -> "PKR 20 Cr", 5_500_000 -> "PKR 55 Lakh", 50_000 -> "PKR 50,000".
 */
export function formatCroreLakh(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10_000_000) return `PKR ${trim(amount / 10_000_000)} Cr`;
  if (abs >= 100_000) return `PKR ${trim(amount / 100_000)} Lakh`;
  return `PKR ${pkr.format(Math.round(amount))}`;
}

/** Crore/lakh format for a value already expressed in millions: 25.9 -> "PKR 2.59 Cr". */
export function formatMillionsCr(millions: number): string {
  return formatCroreLakh(millions * 1_000_000);
}

/** Format a per-sqft rate: 22000 -> "PKR 22,000/sqft" */
export function formatRate(rate: number): string {
  return `${pkr.format(rate)}/sqft`;
}
