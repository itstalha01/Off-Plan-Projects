"use client";

import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCroreLakh } from "@/lib/format";
import { unitCategoryLabel } from "../constants/unit-categories";
import { unitTypeLabel } from "../constants/unit-types";
import { formatSize } from "../lib/size";
import { useInventorySelectionStore } from "../store/inventory-selection-store";
import type { Unit } from "../types/unit";
import { PhotoLightbox } from "./PhotoLightbox";
import { SizeDisplay } from "./SizeDisplay";
import { StatusBadge } from "./StatusBadge";
import { UnitFormDrawer } from "./UnitFormDrawer";

export function UnitCard({ unit }: { unit: Unit }) {
  const cover = unit.photos[0];
  const isSelected = useInventorySelectionStore((s) => s.selectedIds.has(unit.id));
  const toggleSelected = useInventorySelectionStore((s) => s.toggle);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-gold/40">
      <div className="absolute left-1.5 top-1.5 z-10 flex size-5 items-center justify-center rounded-md bg-background/90 shadow-sm">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleSelected(unit.id)}
          aria-label={`Select ${unit.area}`}
        />
      </div>
      <div className="absolute right-1.5 top-1.5 z-10">
        <UnitFormDrawer
          unit={unit}
          trigger={
            <span className="flex items-center gap-1">
              <Pencil className="size-3" /> Edit
            </span>
          }
        />
      </div>
      <div
        onClick={cover ? () => setLightboxIndex(0) : undefined}
        className={`flex aspect-[16/10] items-center justify-center bg-cream ${cover ? "cursor-pointer" : ""}`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.blobUrl}
            alt={unit.unitNumber ?? unit.type}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-heading text-base font-semibold tracking-wide text-gold-deep">
            {formatSize(unit.areaSqft)}
          </span>
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          items={unit.photos.map((photo) => ({ src: photo.blobUrl }))}
          index={lightboxIndex}
          onIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="flex flex-col gap-1 p-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {unitTypeLabel(unit.type)}
              {unit.category !== "commercial" ? ` · ${unitCategoryLabel(unit.category)}` : ""}
              {unit.unitNumber ? ` · ${unit.unitNumber}` : ""}
            </p>
            <p className="truncate text-sm font-semibold">
              {unit.area}
              {unit.sector ? ` · ${unit.sector}` : ""}, {unit.city}
            </p>
          </div>
          <StatusBadge status={unit.status} />
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{unit.address}</span>
        </p>

        <div className="mt-0.5 flex items-end justify-between text-xs">
          <SizeDisplay
            areaSqft={unit.areaSqft}
            frontFt={unit.frontFt}
            depthFt={unit.depthFt}
          />
          <span className="text-sm font-semibold">{formatCroreLakh(unit.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
