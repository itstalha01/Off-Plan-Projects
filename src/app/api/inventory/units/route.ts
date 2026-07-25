import type { NextRequest } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { unitPhotos, units } from "@/db/schema";
import { isUnitTypeValue } from "@/features/inventory/constants/unit-types";
import { isUnitStatusValue } from "@/features/inventory/constants/unit-statuses";
import { resolveUnit, toUnit } from "@/features/inventory/lib/resolve-unit";
import { unitFilterSchema, unitInputSchema } from "@/features/inventory/validations/unit";
import type { Unit } from "@/features/inventory/types/unit";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters = unitFilterSchema.parse({
    city: searchParams.get("city") ?? undefined,
    area: searchParams.get("area") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  const conditions = [];
  if (filters.city) conditions.push(eq(units.city, filters.city));
  if (filters.area) conditions.push(eq(units.area, filters.area));
  if (filters.type && isUnitTypeValue(filters.type)) {
    conditions.push(eq(units.type, filters.type));
  }
  if (filters.status && isUnitStatusValue(filters.status)) {
    conditions.push(eq(units.status, filters.status));
  }

  const rows = await db
    .select()
    .from(units)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(units.createdAt));

  const unitIds = rows.map((r) => r.id);
  const photos = unitIds.length
    ? await db
        .select()
        .from(unitPhotos)
        .where(inArray(unitPhotos.unitId, unitIds))
        .orderBy(unitPhotos.sortOrder)
    : [];

  const photosByUnit = new Map<string, typeof photos>();
  for (const photo of photos) {
    const list = photosByUnit.get(photo.unitId) ?? [];
    list.push(photo);
    photosByUnit.set(photo.unitId, list);
  }

  const result: Unit[] = rows.map((row) => toUnit(row, photosByUnit.get(row.id) ?? []));

  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const parsed = unitInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { areaSqft, totalPrice, frontFt, depthFt } = resolveUnit(parsed.data);

  const [row] = await db
    .insert(units)
    .values({
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
    })
    .returning();

  const result: Unit = toUnit(row, []);
  return Response.json(result, { status: 201 });
}
