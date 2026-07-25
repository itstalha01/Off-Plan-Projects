import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { marlaKanalToSqft, marlaToKanalMarla, sqftToMarla } from "../lib/size";
import type { AreaInputMode } from "../types/unit";

function initialMarlaKanal(areaSqft: string) {
  const sqft = parseFloat(areaSqft) || 0;
  if (sqft <= 0) return { kanal: "", marla: "" };
  const { kanal, marla } = marlaToKanalMarla(sqftToMarla(sqft));
  return { kanal: kanal ? kanal.toString() : "", marla: marla ? marla.toString() : "" };
}

const labelClass = "text-xs font-medium text-muted-foreground";
const tabClass =
  "flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors";

type Props = {
  mode: AreaInputMode;
  onModeChange: (mode: AreaInputMode) => void;
  frontFt: string;
  onFrontFtChange: (v: string) => void;
  depthFt: string;
  onDepthFtChange: (v: string) => void;
  areaSqft: string;
  onAreaSqftChange: (v: string) => void;
};

export function AreaModeToggle({
  mode,
  onModeChange,
  frontFt,
  onFrontFtChange,
  depthFt,
  onDepthFtChange,
  areaSqft,
  onAreaSqftChange,
}: Props) {
  // Kanal/Marla are a convenience entry method for the same value as
  // `areaSqft` — they aren't persisted separately. Seeded once from the
  // incoming area (so editing an existing unit shows the right starting
  // values) and from then on drive `areaSqft` rather than mirror it, so
  // typing a decimal Marla value doesn't get clobbered mid-keystroke.
  const [kanal, setKanal] = useState(() => initialMarlaKanal(areaSqft).kanal);
  const [marla, setMarla] = useState(() => initialMarlaKanal(areaSqft).marla);

  function handleMarlaKanalChange(nextKanal: string, nextMarla: string) {
    setKanal(nextKanal);
    setMarla(nextMarla);
    const k = parseFloat(nextKanal) || 0;
    const m = parseFloat(nextMarla) || 0;
    onAreaSqftChange(k || m ? marlaKanalToSqft(k, m).toString() : "");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange("dimensions")}
          className={cn(
            tabClass,
            mode === "dimensions"
              ? "border-primary bg-primary/10 text-primary"
              : "border-input text-muted-foreground hover:bg-muted"
          )}
        >
          Front × Depth
        </button>
        <button
          type="button"
          onClick={() => onModeChange("direct")}
          className={cn(
            tabClass,
            mode === "direct"
              ? "border-primary bg-primary/10 text-primary"
              : "border-input text-muted-foreground hover:bg-muted"
          )}
        >
          Enter total area
        </button>
      </div>

      {mode === "dimensions" ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Front (ft)</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={frontFt}
              onChange={(e) => onFrontFtChange(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Back / Depth (ft)</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={depthFt}
              onChange={(e) => onDepthFtChange(e.target.value)}
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Kanal</span>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="Kanal"
                value={kanal}
                onChange={(e) => handleMarlaKanalChange(e.target.value, marla)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Marla</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Marla"
                value={marla}
                onChange={(e) => handleMarlaKanalChange(kanal, e.target.value)}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Total area (sqft)</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={areaSqft}
              onChange={(e) => onAreaSqftChange(e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
