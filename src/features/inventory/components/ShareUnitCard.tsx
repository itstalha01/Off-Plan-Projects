import { ImageOff, MapPin } from "lucide-react";
import { unitTypeLabel } from "../constants/unit-types";
import { StatusBadge } from "./StatusBadge";
import type { SharedUnitView } from "../lib/share-view";

export function ShareUnitCard({ unit }: { unit: SharedUnitView }) {
  const cover = unit.photos?.[0];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.blobUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="size-8 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            {unit.type && (
              <p className="text-sm font-medium text-muted-foreground">
                {unitTypeLabel(unit.type)}
                {unit.unitNumber ? ` · ${unit.unitNumber}` : ""}
              </p>
            )}
            {(unit.area || unit.city) && (
              <p className="font-semibold">
                {[unit.area, unit.city].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          {unit.status && <StatusBadge status={unit.status} />}
        </div>

        {unit.address && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{unit.address}</span>
          </p>
        )}

        {unit.mapLink && (
          <a
            href={unit.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline underline-offset-2"
          >
            View pin on map
          </a>
        )}

        {(unit.size || unit.price) && (
          <div className="mt-1 flex items-end justify-between">
            {unit.size && <span>{unit.size}</span>}
            {unit.price && <span className="font-semibold">{unit.price}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
