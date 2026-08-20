export const UNIT_TYPES = [
  { value: "plot", label: "Plot" },
  { value: "shop", label: "Shop" },
  { value: "plaza", label: "Plaza" },
  { value: "hotel", label: "Hotel" },
  { value: "house", label: "House" },
] as const;

export type UnitTypeValue = (typeof UNIT_TYPES)[number]["value"];

export function unitTypeLabel(value: string): string {
  return UNIT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function isUnitTypeValue(value: string): value is UnitTypeValue {
  return UNIT_TYPES.some((t) => t.value === value);
}
