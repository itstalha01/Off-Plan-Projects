import { describe, expect, it } from "vitest";
import { formatSize, marlaToKanalMarla, sqftToMarla, SQFT_PER_MARLA } from "./size";

describe("formatSize", () => {
  it("formats 25 marla as 1 Kanal 5 Marla", () => {
    expect(formatSize(25 * SQFT_PER_MARLA)).toBe("1 Kanal 5 Marla");
  });

  it("formats exactly 20 marla as 1 Kanal", () => {
    expect(formatSize(20 * SQFT_PER_MARLA)).toBe("1 Kanal");
  });

  it("formats exactly 40 marla as 2 Kanal", () => {
    expect(formatSize(40 * SQFT_PER_MARLA)).toBe("2 Kanal");
  });

  it("formats 19.9 marla as 19.9 Marla (no Kanal)", () => {
    expect(formatSize(19.9 * SQFT_PER_MARLA)).toBe("19.9 Marla");
  });

  it("rounds a fractional remainder", () => {
    expect(formatSize(22.223 * SQFT_PER_MARLA)).toBe("1 Kanal 2.22 Marla");
  });

  it("carries a remainder that rounds up to exactly 20 into another Kanal", () => {
    expect(marlaToKanalMarla(39.999)).toEqual({ kanal: 2, marla: 0 });
    expect(formatSize(39.999 * SQFT_PER_MARLA)).toBe("2 Kanal");
  });
});

describe("sqftToMarla", () => {
  it("divides by 225", () => {
    expect(sqftToMarla(4500)).toBe(20);
  });
});
