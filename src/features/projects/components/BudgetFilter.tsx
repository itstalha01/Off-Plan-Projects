"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { formatCroreLakh, formatMillionsCr } from "@/lib/format";
import {
  MAX_DOWN_PAYMENT,
  MAX_ENTRY_PRICE,
  MAX_MONTHLY,
  MIN_DOWN_PAYMENT,
  MIN_ENTRY_PRICE,
  MIN_MONTHLY,
  MONTHLY_STEP,
} from "../constants/projects";
import { useFilteredProjects } from "../hooks/useFilteredProjects";
import { useFilterStore } from "../store/filterStore";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-brown";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

const round2 = (n: number) => Math.round(n * 100) / 100;

// Compact label for a range: "Any" when wide open, "Up to X" / "X+" when only one
// bound is set, "X – Y" when both are. Returns null when fully open (= "Any").
function rangeLabel(
  min: number,
  max: number,
  absMin: number,
  absMax: number,
  fmt: (v: number) => string
): string | null {
  const lowOpen = min <= absMin;
  const highOpen = max >= absMax;
  if (lowOpen && highOpen) return null;
  if (lowOpen) return `Up to ${fmt(max)}`;
  if (highOpen) return `${fmt(min)}+`;
  return `${fmt(min)} – ${fmt(max)}`;
}

// One Min/Max field. Shows empty (the "No min / No max" placeholder) whenever the
// bound sits at its extreme, so the field is freely clearable and never sticks on
// a leading 0. Stays in lock-step with the slider via a render-time sync.
function BoundInput({
  display,
  atExtreme,
  placeholder,
  unit,
  onCommit,
}: {
  display: number;
  atExtreme: boolean;
  placeholder: string;
  unit: string;
  onCommit: (value: number | null) => void;
}) {
  const [text, setText] = useState(atExtreme ? "" : String(display));

  // Re-sync when the bound changes from outside (slider drag, reset) using the
  // store-previous-value-in-state pattern. The inSync guard leaves an in-progress
  // edit alone (e.g. typing "1." parses to the same value), so decimals survive.
  const [prevDisplay, setPrevDisplay] = useState(display);
  const [prevExtreme, setPrevExtreme] = useState(atExtreme);
  if (prevDisplay !== display || prevExtreme !== atExtreme) {
    setPrevDisplay(display);
    setPrevExtreme(atExtreme);
    const parsed = text.trim() === "" ? null : Number(text);
    const inSync = atExtreme ? parsed === null : parsed === display;
    if (!inSync) setText(atExtreme ? "" : String(display));
  }

  return (
    <div className="relative flex-1">
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          if (raw.trim() === "") return onCommit(null);
          const n = Number(raw);
          if (Number.isFinite(n)) onCommit(n);
        }}
        className="h-10 w-full rounded-lg border border-ink/15 bg-paper px-3 pr-12 text-base font-medium text-ink outline-none transition-colors placeholder:font-normal placeholder:text-brown/60 focus:border-gold focus:ring-2 focus:ring-gold/30 sm:text-sm"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-brown">
        {unit}
      </span>
    </div>
  );
}

// A single budget range: readout + dual slider + Min/Max inputs. Store values are
// in one unit (millions, or raw PKR for monthly); the display unit (Cr / Lakh /
// rupees) is mapped in via toDisplay/fromDisplay so each filter reads naturally.
function RangeRow({
  title,
  absMin,
  absMax,
  step,
  storeMin,
  storeMax,
  setMin,
  setMax,
  toDisplay,
  fromDisplay,
  unit,
  formatLabel,
}: {
  title: string;
  absMin: number;
  absMax: number;
  step: number;
  storeMin: number;
  storeMax: number;
  setMin: (v: number) => void;
  setMax: (v: number) => void;
  toDisplay: (storeValue: number) => number;
  fromDisplay: (displayValue: number) => number;
  unit: string;
  formatLabel: (storeValue: number) => string;
}) {
  const readout =
    rangeLabel(storeMin, storeMax, absMin, absMax, formatLabel) ?? "Any";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className={labelClass}>{title}</span>
        <span className="text-sm font-semibold text-gold-deep">{readout}</span>
      </div>

      <Slider
        min={absMin}
        max={absMax}
        step={step}
        value={[clamp(storeMin, absMin, absMax), clamp(storeMax, absMin, absMax)]}
        onValueChange={(v) => {
          const [lo, hi] = v as number[];
          setMin(lo);
          setMax(hi);
        }}
        className="py-1 [&_[data-slot=slider-track]]:bg-ink/15 [&_[data-slot=slider-range]]:bg-gold [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-gold-deep [&_[data-slot=slider-thumb]]:ring-gold/40"
      />

      <div className="flex items-center justify-between text-[11px] font-medium text-brown">
        <span>{formatLabel(absMin)}</span>
        <span>{formatLabel(absMax)}+</span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <span className={labelClass}>Min</span>
          <BoundInput
            display={round2(toDisplay(storeMin))}
            atExtreme={storeMin <= absMin}
            placeholder="No min"
            unit={unit}
            onCommit={(d) =>
              setMin(
                d === null
                  ? absMin
                  : clamp(fromDisplay(d), absMin, storeMax)
              )
            }
          />
        </div>
        <span className="mt-5 text-brown">–</span>
        <div className="flex flex-1 flex-col gap-1">
          <span className={labelClass}>Max</span>
          <BoundInput
            display={round2(toDisplay(storeMax))}
            atExtreme={storeMax >= absMax}
            placeholder="No max"
            unit={unit}
            onCommit={(d) =>
              setMax(
                d === null
                  ? absMax
                  : clamp(fromDisplay(d), storeMin, absMax)
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export function BudgetFilter() {
  const budgetMode = useFilterStore((s) => s.budgetMode);
  const minEntryPrice = useFilterStore((s) => s.minEntryPrice);
  const maxEntryPrice = useFilterStore((s) => s.maxEntryPrice);
  const minDownPayment = useFilterStore((s) => s.minDownPayment);
  const maxDownPayment = useFilterStore((s) => s.maxDownPayment);
  const minMonthly = useFilterStore((s) => s.minMonthly);
  const maxMonthly = useFilterStore((s) => s.maxMonthly);

  const setBudgetMode = useFilterStore((s) => s.setBudgetMode);
  const setMinEntryPrice = useFilterStore((s) => s.setMinEntryPrice);
  const setMaxEntryPrice = useFilterStore((s) => s.setMaxEntryPrice);
  const setMinDownPayment = useFilterStore((s) => s.setMinDownPayment);
  const setMaxDownPayment = useFilterStore((s) => s.setMaxDownPayment);
  const setMinMonthly = useFilterStore((s) => s.setMinMonthly);
  const setMaxMonthly = useFilterStore((s) => s.setMaxMonthly);

  const count = useFilteredProjects().length;

  const byDown = budgetMode === "down";

  const priceSummary = byDown
    ? rangeLabel(
        minDownPayment,
        maxDownPayment,
        MIN_DOWN_PAYMENT,
        MAX_DOWN_PAYMENT,
        formatMillionsCr
      )
    : rangeLabel(
        minEntryPrice,
        maxEntryPrice,
        MIN_ENTRY_PRICE,
        MAX_ENTRY_PRICE,
        formatMillionsCr
      );
  const monthlyActive = minMonthly > MIN_MONTHLY || maxMonthly < MAX_MONTHLY;
  const active = priceSummary !== null || monthlyActive;
  const triggerText =
    priceSummary ?? (monthlyActive ? "Monthly set" : "Any budget");

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border bg-paper px-3 text-base font-medium outline-none transition-colors hover:border-ink/30 focus-visible:ring-2 focus-visible:ring-gold/30 data-popup-open:border-gold sm:text-sm",
          active
            ? "border-gold bg-gold/5 text-gold-deep"
            : "border-ink/15 text-ink"
        )}
      >
        <span className="truncate">{triggerText}</span>
        <ChevronDown className="ml-2 size-4 shrink-0 text-brown transition-transform data-popup-open:rotate-180" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} className="z-40">
          <Popover.Popup className="w-[22rem] max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-2xl border border-ink/10 bg-paper p-5 text-ink shadow-xl shadow-ink/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <p className="font-serif text-lg font-semibold text-ink">Budget</p>

            {/* Entry price / down payment lens */}
            <div className="mt-3 inline-flex rounded-lg border border-ink/15 bg-cream/60 p-0.5">
              {(
                [
                  ["price", "Entry price"],
                  ["down", "Down payment"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBudgetMode(mode)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                    budgetMode === mode
                      ? "bg-gold text-ink"
                      : "text-brown hover:text-ink"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {byDown ? (
                <RangeRow
                  title="Down payment"
                  absMin={MIN_DOWN_PAYMENT}
                  absMax={MAX_DOWN_PAYMENT}
                  step={0.5}
                  storeMin={minDownPayment}
                  storeMax={maxDownPayment}
                  setMin={setMinDownPayment}
                  setMax={setMaxDownPayment}
                  toDisplay={(m) => m * 10}
                  fromDisplay={(l) => l / 10}
                  unit="Lakh"
                  formatLabel={formatMillionsCr}
                />
              ) : (
                <RangeRow
                  title="Entry price"
                  absMin={MIN_ENTRY_PRICE}
                  absMax={MAX_ENTRY_PRICE}
                  step={0.5}
                  storeMin={minEntryPrice}
                  storeMax={maxEntryPrice}
                  setMin={setMinEntryPrice}
                  setMax={setMaxEntryPrice}
                  toDisplay={(m) => m / 10}
                  fromDisplay={(c) => c * 10}
                  unit="Cr"
                  formatLabel={formatMillionsCr}
                />
              )}
            </div>

            <div className="my-5 h-px bg-ink/10" />

            <RangeRow
              title="Monthly installment"
              absMin={MIN_MONTHLY}
              absMax={MAX_MONTHLY}
              step={MONTHLY_STEP}
              storeMin={minMonthly}
              storeMax={maxMonthly}
              setMin={setMinMonthly}
              setMax={setMaxMonthly}
              toDisplay={(v) => v}
              fromDisplay={(v) => v}
              unit="PKR"
              formatLabel={formatCroreLakh}
            />

            <Popover.Close className="mt-6 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper">
              {count === 0
                ? "No projects match"
                : `See ${count} project${count === 1 ? "" : "s"}`}
            </Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
