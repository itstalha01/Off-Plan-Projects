import type { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { unitDocuments, unitPhotos, units } from "@/db/schema";
import { getSessionUser } from "@/lib/inventory-auth";
import { resolveUnit, toUnit } from "@/features/inventory/lib/resolve-unit";
import { unitInputSchema } from "@/features/inventory/validations/unit";
import type { Unit } from "@/features/inventory/types/unit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;

  const [row] = await db
    .select()
    .from(units)
    .where(and(eq(units.id, id), eq(units.ownerId, session.userId)));
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const photos = await db
    .select()
    .from(unitPhotos)
    .where(eq(unitPhotos.unitId, id))
    .orderBy(unitPhotos.sortOrder);

  const documents = await db
    .select()
    .from(unitDocuments)
    .where(eq(unitDocuments.unitId, id))
    .orderBy(unitDocuments.createdAt);

  const result: Unit = toUnit(row, photos, documents);
  return Response.json(result);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

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
      sector: parsed.data.sector || null,
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
    .where(and(eq(units.id, id), eq(units.ownerId, session.userId)))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const photos = await db
    .select()
    .from(unitPhotos)
    .where(eq(unitPhotos.unitId, id))
    .orderBy(unitPhotos.sortOrder);

  const documents = await db
    .select()
    .from(unitDocuments)
    .where(eq(unitDocuments.unitId, id))
    .orderBy(unitDocuments.createdAt);

  const result: Unit = toUnit(row, photos, documents);
  return Response.json(result);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;

  // Fetch attached photos/documents first — the DB row's ON DELETE CASCADE
  // will drop them automatically, but it can't reach into Blob storage, so
  // we free those blobs ourselves before removing the unit.
  const photos = await db.select().from(unitPhotos).where(eq(unitPhotos.unitId, id));
  const documents = await db.select().from(unitDocuments).where(eq(unitDocuments.unitId, id));

  const [row] = await db
    .delete(units)
    .where(and(eq(units.id, id), eq(units.ownerId, session.userId)))
    .returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const blobUrls = [...photos.map((p) => p.blobUrl), ...documents.map((d) => d.blobUrl)];
  if (blobUrls.length > 0) {
    await del(blobUrls);
  }

  return Response.json({ ok: true });
}
