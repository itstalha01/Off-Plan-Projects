"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AREAS,
  CITIES,
  MAX_ENTRY_PRICE,
  MIN_ENTRY_PRICE,
  POSSESSION_YEARS,
  TYPES,
} from "../constants/projects";
import { useFilterStore } from "../store/filterStore";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-ink/15 bg-paper px-3 pr-9 text-base font-medium text-ink outline-none transition-colors hover:border-ink/30 focus:border-gold focus:ring-2 focus:ring-gold/30 sm:text-sm";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-brown";

function ChevronAdornment() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brown"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterToolbar() {
  const search = useFilterStore((s) => s.search);
  const city = useFilterStore((s) => s.city);
  const area = useFilterStore((s) => s.area);
  const type = useFilterStore((s) => s.type);
  const possession = useFilterStore((s) => s.possession);
  const maxEntryPrice = useFilterStore((s) => s.maxEntryPrice);
  const approvedOnly = useFilterStore((s) => s.approvedOnly);

  const setSearch = useFilterStore((s) => s.setSearch);
  const setCity = useFilterStore((s) => s.setCity);
  const setArea = useFilterStore((s) => s.setArea);
  const setType = useFilterStore((s) => s.setType);
  const setPossession = useFilterStore((s) => s.setPossession);
  const setMaxEntryPrice = useFilterStore((s) => s.setMaxEntryPrice);
  const setApprovedOnly = useFilterStore((s) => s.setApprovedOnly);
  const reset = useFilterStore((s) => s.reset);

  return (
    <div
      id="areas"
      className="z-30 border-b border-ink/10 bg-cream/95 backdrop-blur-md sm:sticky sm:top-16"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8">
        {/* Row 1 — search + selects */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brown" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Project, developer or area"
                className="h-11 w-full rounded-lg border border-ink/15 bg-paper pl-9 pr-3 text-base font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-brown/60 hover:border-ink/30 focus:border-gold focus:ring-2 focus:ring-gold/30 sm:text-sm"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>City</span>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={selectClass}
              >
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronAdornment />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Area</span>
            <div className="relative">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={selectClass}
              >
                <option value="">All areas</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <ChevronAdornment />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Type</span>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectClass}
              >
                <option value="">All types</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronAdornment />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Possession by</span>
            <div className="relative">
              <select
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className={selectClass}
              >
                <option value="">Any year</option>
                {POSSESSION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronAdornment />
            </div>
          </label>
        </div>

        {/* Row 2 — budget slider + checkbox + reset */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-1 flex-col gap-1.5 sm:max-w-md">
            <span className={labelClass}>
              Entry price up to{" "}
              <span className="text-gold-deep">PKR {maxEntryPrice} M</span>
            </span>
            <input
              type="range"
              min={MIN_ENTRY_PRICE}
              max={MAX_ENTRY_PRICE}
              step={0.5}
              value={maxEntryPrice}
              onChange={(e) => setMaxEntryPrice(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-gold"
            />
          </label>

          <div className="flex items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={approvedOnly}
                onChange={(e) => setApprovedOnly(e.target.checked)}
                className="size-4 cursor-pointer rounded border-ink/30 accent-gold"
              />
              LDA / NOC approved only
            </label>

            <button
              type="button"
              onClick={reset}
              className={cn(
                "text-sm font-medium text-brown underline-offset-4 transition-colors hover:text-ink hover:underline"
              )}
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
