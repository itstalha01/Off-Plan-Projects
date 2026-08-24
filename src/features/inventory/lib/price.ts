import { formatPKR } from "@/lib/format";
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

/**
 * Rate to display for a unit's total price, normalized to whichever land
 * unit fits its size: below 1 Kanal (20 Marla) shows the per-Marla rate,
 * 1 Kanal or larger shows the per-Kanal rate — regardless of the unit the
 * rate was originally entered in.
 */
export function getDisplayRate(
  areaSqft: number,
  totalPrice: number
): { rate: number; unit: RateUnit } {
  const marla = sqftToMarla(areaSqft);
  if (marla < MARLA_PER_KANAL) {
    return { rate: round2(totalPrice / marla), unit: "marla" };
  }
  return { rate: round2(totalPrice / (marla / MARLA_PER_KANAL)), unit: "kanal" };
}

export function formatDisplayRate(areaSqft: number, totalPrice: number): string {
  const { rate, unit } = getDisplayRate(areaSqft, totalPrice);
  return `${formatPKR(rate)}/${unit === "marla" ? "Marla" : "Kanal"}`;
}
