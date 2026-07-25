import type { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { unitPhotos, units } from "@/db/schema";
import { resolveUnit, toUnit } from "@/features/inventory/lib/resolve-unit";
import { unitInputSchema } from "@/features/inventory/validations/unit";
import type { Unit } from "@/features/inventory/types/unit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const [row] = await db.select().from(units).where(eq(units.id, id));
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const photos = await db
    .select()
    .from(unitPhotos)
    .where(eq(unitPhotos.unitId, id))
    .orderBy(unitPhotos.sortOrder);

  const result: Unit = toUnit(row, photos);
  return Response.json(result);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const parsed = unitInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { areaSqft, totalPrice, frontFt, depthFt } = resolveUnit(parsed.data);

  const [row] = await db
    .update(units)
    .set({
      type: parsed.data.type,
      category: parsed.data.category,
      city: parsed.data.city,
      area: parsed.data.area,
      address: parsed.data.address,
      unitNumber: parsed.data.unitNumber || null,
      mapLink: parsed.data.mapLink || null,
      areaSqft,
      frontFt,
      depthFt,
      areaInputMode: parsed.data.areaInputMode,
      rate: parsed.data.rate,
      rateUnit: parsed.data.rateUnit,
      totalPrice,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(units.id, id))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const photos = await db
    .select()
    .from(unitPhotos)
    .where(eq(unitPhotos.unitId, id))
    .orderBy(unitPhotos.sortOrder);

  const result: Unit = toUnit(row, photos);
  return Response.json(result);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Fetch attached photos first — the DB row's ON DELETE CASCADE will drop
  // unitPhotos automatically, but it can't reach into Blob storage, so we
  // free those blobs ourselves before removing the unit.
  const photos = await db.select().from(unitPhotos).where(eq(unitPhotos.unitId, id));

  const [row] = await db.delete(units).where(eq(units.id, id)).returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  if (photos.length > 0) {
    await del(photos.map((p) => p.blobUrl));
  }

  return Response.json({ ok: true });
}
