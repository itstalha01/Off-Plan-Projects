export const UNIT_CATEGORIES = [
  { value: "commercial", label: "Commercial" },
  { value: "non-commercial", label: "Non-Commercial" },
] as const;

export type UnitCategoryValue = (typeof UNIT_CATEGORIES)[number]["value"];

export function unitCategoryLabel(value: string): string {
  return UNIT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
