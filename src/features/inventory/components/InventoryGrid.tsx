"use client";

import { PackageSearch } from "lucide-react";
import { useUnits } from "../api/use-units";
import { UnitCard } from "./UnitCard";

export function InventoryGrid() {
  const { data: units, isLoading } = useUnits();

  if (isLoading) {
    return <p className="mt-8 text-sm text-muted-foreground">Loading units…</p>;
  }

  if (!units || units.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <PackageSearch className="size-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No units match your filters</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try clearing a filter, or add the first unit to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{units.length}</span>{" "}
        unit{units.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </>
  );
}
