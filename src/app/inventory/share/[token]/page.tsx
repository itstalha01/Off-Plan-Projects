import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { inventoryShares, unitPhotos, units } from "@/db/schema";
import { ShareUnitCard } from "@/features/inventory/components/ShareUnitCard";
import type { ShareableFieldKey } from "@/features/inventory/constants/shareable-fields";
import { toUnit } from "@/features/inventory/lib/resolve-unit";
import { pickVisibleFields } from "@/features/inventory/lib/share-view";
import type { Unit } from "@/features/inventory/types/unit";

type Params = { params: Promise<{ token: string }> };

export default async function InventorySharePage({ params }: Params) {
  const { token } = await params;

  const [share] = await db
    .select()
    .from(inventoryShares)
    .where(
      and(
        eq(inventoryShares.token, token),
        isNull(inventoryShares.revokedAt),
        or(isNull(inventoryShares.expiresAt), gt(inventoryShares.expiresAt, new Date())),
      ),
    );

  if (!share || share.unitIds.length === 0) notFound();

  const unitRows = await db.select().from(units).where(inArray(units.id, share.unitIds));
  const photoRows = await db
    .select()
    .from(unitPhotos)
    .where(inArray(unitPhotos.unitId, share.unitIds))
    .orderBy(unitPhotos.sortOrder);

  const photosByUnit = new Map<string, typeof photoRows>();
  for (const photo of photoRows) {
    const list = photosByUnit.get(photo.unitId) ?? [];
    list.push(photo);
    photosByUnit.set(photo.unitId, list);
  }

  const unitsList: Unit[] = unitRows.map((row) => toUnit(row, photosByUnit.get(row.id) ?? []));

  const visibleFields = share.visibleFields as ShareableFieldKey[];

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold">Shared units</h1>
      <p className="text-sm text-muted-foreground">
        {unitsList.length} unit{unitsList.length === 1 ? "" : "s"} shared with you — view only.
      </p>

      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {unitsList.map((unit) => (
          <ShareUnitCard key={unit.id} unit={pickVisibleFields(unit, visibleFields)} />
        ))}
      </div>
    </div>
  );
}
