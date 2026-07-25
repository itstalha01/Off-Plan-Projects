import { describe, expect, it } from "vitest";
import { calculateTotalPrice } from "./price";
import { SQFT_PER_MARLA } from "./size";

describe("calculateTotalPrice", () => {
  it("16 Kanal at 20 Crore/Kanal totals 320 Crore", () => {
    const areaSqft = 16 * 20 * SQFT_PER_MARLA;
    expect(calculateTotalPrice(areaSqft, 200_000_000, "kanal")).toBe(3_200_000_000);
  });

  it("21 Marla priced per Kanal uses the fractional Kanal count directly", () => {
    const areaSqft = 21 * SQFT_PER_MARLA;
    // 21 marla = 1.05 kanal; 1.05 * 20 Cr = 21 Cr
    expect(calculateTotalPrice(areaSqft, 200_000_000, "kanal")).toBe(210_000_000);
  });

  it("500 sqft shop at 5,000,000/Marla", () => {
    expect(calculateTotalPrice(500, 5_000_000, "marla")).toBeCloseTo(11_111_111.11, 1);
  });
});
