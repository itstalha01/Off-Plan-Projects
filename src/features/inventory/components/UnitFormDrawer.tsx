"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCroreLakh } from "@/lib/format";
import { useCreateUnit, useDeleteUnit, useUpdateUnit } from "../api/use-units";
import { UNIT_CATEGORIES } from "../constants/unit-categories";
import { UNIT_STATUSES } from "../constants/unit-statuses";
import { UNIT_TYPES } from "../constants/unit-types";
import { calculateTotalPrice } from "../lib/price";
import { formatSize } from "../lib/size";
import type { AreaInputMode, RateUnit, Unit } from "../types/unit";
import { unitInputSchema } from "../validations/unit";
import { AreaModeToggle } from "./AreaModeToggle";
import { PhotoUploader } from "./PhotoUploader";

const labelClass = "text-xs font-medium text-muted-foreground";
const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// The Demand field is entered/displayed in Cr (e.g. "1.4" for PKR 1.4 Cr)
// since that's how rates are quoted in conversation — the stored `rate` is
// always the raw PKR-per-Marla/Kanal figure used in price calculations.
const PKR_PER_CR = 10_000_000;

type Props = {
  unit?: Unit;
  trigger: React.ReactNode;
  triggerClassName?: string;
};

export function UnitFormDrawer({ unit, trigger, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  // Once a brand-new unit is created, this flips to it so the drawer can
  // stay open in "edit" mode and let photos be attached right away — no
  // navigating away, per the "add data on the spot" requirement.
  const [savedUnit, setSavedUnit] = useState(unit);
  const isEdit = Boolean(savedUnit);

  const [type, setType] = useState(unit?.type ?? "plot");
  const [category, setCategory] = useState(unit?.category ?? "commercial");
  const [city, setCity] = useState(unit?.city ?? "");
  const [area, setArea] = useState(unit?.area ?? "");
  const [address, setAddress] = useState(unit?.address ?? "");
  const [unitNumber, setUnitNumber] = useState(unit?.unitNumber ?? "");
  const [mapLink, setMapLink] = useState(unit?.mapLink ?? "");
  const [areaInputMode, setAreaInputMode] = useState<AreaInputMode>(
    unit?.areaInputMode ?? "dimensions"
  );
  const [frontFt, setFrontFt] = useState(unit?.frontFt?.toString() ?? "");
  const [depthFt, setDepthFt] = useState(unit?.depthFt?.toString() ?? "");
  const [areaSqft, setAreaSqft] = useState(unit?.areaSqft?.toString() ?? "");
  const [rate, setRate] = useState(unit ? (unit.rate / PKR_PER_CR).toString() : "");
  const [rateUnit, setRateUnit] = useState<RateUnit>(unit?.rateUnit ?? "marla");
  const [status, setStatus] = useState(unit?.status ?? "available");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const isSaving = createUnit.isPending || updateUnit.isPending;

  const previewAreaSqft =
    areaInputMode === "dimensions"
      ? (parseFloat(frontFt) || 0) * (parseFloat(depthFt) || 0)
      : parseFloat(areaSqft) || 0;
  const previewTotal = calculateTotalPrice(
    previewAreaSqft,
    (parseFloat(rate) || 0) * PKR_PER_CR,
    rateUnit
  );

  function resetAndClose() {
    setOpen(false);
    setErrors({});
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // This drawer instance started in "add" mode (no `unit` prop) — reset it
    // back to a blank form once closed so the next "Add unit" click doesn't
    // reopen on the unit that was just created.
    if (!next && !unit) {
      setSavedUnit(undefined);
      setType("plot");
      setCategory("commercial");
      setCity("");
      setArea("");
      setAddress("");
      setUnitNumber("");
      setMapLink("");
      setAreaInputMode("dimensions");
      setFrontFt("");
      setDepthFt("");
      setAreaSqft("");
      setRate("");
      setRateUnit("marla");
      setStatus("available");
      setErrors({});
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = unitInputSchema.safeParse({
      type,
      category,
      city,
      area,
      address,
      unitNumber: unitNumber || undefined,
      mapLink: mapLink || undefined,
      areaInputMode,
      frontFt: frontFt ? parseFloat(frontFt) : undefined,
      depthFt: depthFt ? parseFloat(depthFt) : undefined,
      areaSqft: areaSqft ? parseFloat(areaSqft) : undefined,
      rate: (parseFloat(rate) || 0) * PKR_PER_CR,
      rateUnit,
      status,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      if (savedUnit) {
        await updateUnit.mutateAsync({ id: savedUnit.id, data: parsed.data });
        toast.success("Unit updated");
        resetAndClose();
      } else {
        const created = await createUnit.mutateAsync(parsed.data);
        toast.success("Unit added — add photos below, then close when done");
        setSavedUnit(created);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function handleDelete() {
    if (!savedUnit) return;
    if (!confirm("Delete this unit? This can't be undone.")) return;
    try {
      await deleteUnit.mutateAsync(savedUnit.id);
      toast.success("Unit deleted");
      resetAndClose();
    } catch {
      toast.error("Couldn't delete this unit. Please try again.");
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection="right">
      <DrawerTrigger
        className={cn(
          buttonVariants({
            variant: isEdit ? "outline" : "default",
            size: isEdit ? "sm" : "default",
          }),
          triggerClassName
        )}
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="sm:[--drawer-content-width:28rem]">
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit unit" : "Add unit"}</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className={selectClass}
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className={selectClass}
              >
                {UNIT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelClass}>City</span>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
              {errors.city && <span className="text-xs text-destructive">{errors.city}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Area</span>
              <Input value={area} onChange={(e) => setArea(e.target.value)} />
              {errors.area && <span className="text-xs text-destructive">{errors.area}</span>}
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className={labelClass}>Address</span>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            {errors.address && (
              <span className="text-xs text-destructive">{errors.address}</span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Unit / Plot number</span>
              <Input value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Map link</span>
              <Input
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="Google Maps link"
              />
            </label>
          </div>

          <div className="border-t border-border pt-4">
            <AreaModeToggle
              mode={areaInputMode}
              onModeChange={setAreaInputMode}
              frontFt={frontFt}
              onFrontFtChange={setFrontFt}
              depthFt={depthFt}
              onDepthFtChange={setDepthFt}
              areaSqft={areaSqft}
              onAreaSqftChange={setAreaSqft}
            />
            {(errors.frontFt || errors.depthFt || errors.areaSqft) && (
              <p className="mt-1 text-xs text-destructive">
                {errors.frontFt || errors.depthFt || errors.areaSqft}
              </p>
            )}
            {previewAreaSqft > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                = {formatSize(previewAreaSqft)}
              </p>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className={labelClass}>Demand (Cr)</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1.4 for 1.4 Cr"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                {errors.rate && (
                  <span className="text-xs text-destructive">{errors.rate}</span>
                )}
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>Per</span>
                <select
                  value={rateUnit}
                  onChange={(e) => setRateUnit(e.target.value as RateUnit)}
                  className={selectClass}
                >
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal</option>
                </select>
              </label>
            </div>
            {previewTotal > 0 && (
              <p className="mt-2 text-sm font-medium">
                Total: {formatCroreLakh(previewTotal)}
              </p>
            )}
          </div>

          <label className="flex flex-col gap-1">
            <span className={labelClass}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className={selectClass}
            >
              {UNIT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          {savedUnit && (
            <div className="border-t border-border pt-4">
              <span className={labelClass}>Photos</span>
              <div className="mt-2">
                <PhotoUploader unitId={savedUnit.id} />
              </div>
            </div>
          )}
        </form>

        <DrawerFooter>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteUnit.isPending}
            >
              {deleteUnit.isPending ? "Deleting…" : "Delete unit"}
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving…" : isEdit ? "Save changes" : "Add unit"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
