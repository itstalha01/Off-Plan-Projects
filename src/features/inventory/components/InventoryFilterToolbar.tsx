"use client";

import { useMemo } from "react";
import { useAllUnitsForOptions } from "../api/use-units";
import { UNIT_STATUSES } from "../constants/unit-statuses";
import { UNIT_TYPES } from "../constants/unit-types";
import { useInventoryFilterStore } from "../store/inventory-filter-store";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const labelClass = "text-xs font-medium text-muted-foreground";

export function InventoryFilterToolbar() {
  const { data: allUnits } = useAllUnitsForOptions();
  const {
    city,
    area,
    sector,
    type,
    status,
    setCity,
    setArea,
    setSector,
    setType,
    setStatus,
    reset,
  } = useInventoryFilterStore();

  const cities = useMemo(
    () => Array.from(new Set(allUnits?.map((u) => u.city) ?? [])).sort(),
    [allUnits]
  );
  const areas = useMemo(
    () => Array.from(new Set(allUnits?.map((u) => u.area) ?? [])).sort(),
    [allUnits]
  );
  const sectors = useMemo(
    () =>
      Array.from(new Set(allUnits?.map((u) => u.sector).filter(Boolean) ?? [])).sort() as string[],
    [allUnits]
  );

  const hasActiveFilters = Boolean(city || area || sector || type || status);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:items-end lg:grid-cols-6">
      <label className="flex flex-col gap-1">
        <span className={labelClass}>City</span>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Area</span>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Sector / Phase</span>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {UNIT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {UNIT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={reset}
          className="h-9 rounded-lg border border-input px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
