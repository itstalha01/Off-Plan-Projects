import { sqftToMarla, MARLA_PER_KANAL } from "./size";

export type RateUnit = "marla" | "kanal";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * total = rate × (size expressed in the rate's own unit). A per-Kanal rate
 * against a non-whole-Kanal size uses the fractional Kanal count directly
 * (e.g. 21 Marla priced "per Kanal" = 1.05 Kanal × rate).
 */
export function calculateTotalPrice(
  areaSqft: number,
  rate: number,
  rateUnit: RateUnit
): number {
  const marla = sqftToMarla(areaSqft);
  const unitsOfSize = rateUnit === "marla" ? marla : marla / MARLA_PER_KANAL;
  return round2(rate * unitsOfSize);
}
