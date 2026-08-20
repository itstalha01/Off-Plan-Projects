import type { unitDocuments, units } from "@/db/schema";
import type { Unit, UnitPhoto } from "../types/unit";
import type { UnitInput } from "../validations/unit";
import { calculateTotalPrice } from "./price";

/** Derives the canonical areaSqft (and total price) from a submitted form,
 * regardless of which area-input mode was used. Server is the source of
 * truth for both — never trusts a client-computed total. */
export function resolveUnit(input: UnitInput) {
  const areaSqft =
    input.areaInputMode === "dimensions"
      ? input.frontFt! * input.depthFt!
      : input.areaSqft!;

  const totalPrice = calculateTotalPrice(areaSqft, input.rate, input.rateUnit);

  return {
    areaSqft,
    totalPrice,
    frontFt: input.areaInputMode === "dimensions" ? input.frontFt! : null,
    depthFt: input.areaInputMode === "dimensions" ? input.depthFt! : null,
  };
}

/** Narrows a raw DB row's plain-text `type`/`status`/`areaInputMode`/`rateUnit`
 * columns to their Unit union types — Drizzle types `text()` columns as
 * `string`, but every write path only ever stores a valid enum value.
 * `createdAt`/`updatedAt` are `Date` here (vs. `Unit`'s `string`) until
 * `Response.json()` serializes them — server components that read these rows
 * directly never touch those two fields. */
export function toUnit(
  row: typeof units.$inferSelect,
  photos: UnitPhoto[],
  documents: (typeof unitDocuments.$inferSelect)[] = []
): Unit {
  return { ...row, photos, documents } as unknown as Unit;
}
