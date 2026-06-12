"use client";

import { Slider } from "@/components/ui/slider";

type UnitSizeSliderProps = {
  /** Explicit, ascending list of allowed sizes. The slider snaps only to these. */
  sizes: number[];
  /** Currently selected size (must be a member of `sizes`). */
  value: number;
  onChange: (value: number) => void;
};

const GOLD_CLASSES =
  "[&_[data-slot=slider-range]]:bg-gold [&_[data-slot=slider-thumb]]:bg-gold [&_[data-slot=slider-thumb]]:border-gold-deep [&_[data-slot=slider-thumb]]:ring-gold/40 [&_[data-slot=slider-thumb]]:size-4";

/**
 * Snap slider: the handle moves in equal index steps across `sizes`, so it can
 * only land on the listed values (which may be unevenly spaced).
 */
export function UnitSizeSlider({ sizes, value, onChange }: UnitSizeSliderProps) {
  const index = Math.max(0, sizes.indexOf(value));

  return (
    <Slider
      min={0}
      max={sizes.length - 1}
      step={1}
      value={[index]}
      onValueChange={(v) => {
        const i = Array.isArray(v) ? v[0] : v;
        onChange(sizes[i] ?? sizes[0]);
      }}
      className={GOLD_CLASSES}
    />
  );
}
