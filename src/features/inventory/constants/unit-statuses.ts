export const UNIT_STATUSES = [
  { value: "available", label: "Available", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  { value: "hold", label: "Hold", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  { value: "sold_out", label: "Sold Out", color: "bg-rose-500/15 text-rose-700 dark:text-rose-400" },
] as const;

export type UnitStatusValue = (typeof UNIT_STATUSES)[number]["value"];

export function unitStatusMeta(value: string) {
  return UNIT_STATUSES.find((s) => s.value === value) ?? UNIT_STATUSES[0];
}

export function isUnitStatusValue(value: string): value is UnitStatusValue {
  return UNIT_STATUSES.some((s) => s.value === value);
}
