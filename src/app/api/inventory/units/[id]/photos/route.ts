import type { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { unitPhotos } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { blobUrl } = await request.json();

  if (typeof blobUrl !== "string" || !blobUrl) {
    return Response.json({ error: "blobUrl is required" }, { status: 400 });
  }

  const [last] = await db
    .select()
    .from(unitPhotos)
    .where(eq(unitPhotos.unitId, id))
    .orderBy(desc(unitPhotos.sortOrder))
    .limit(1);

  const [row] = await db
    .insert(unitPhotos)
    .values({ unitId: id, blobUrl, sortOrder: (last?.sortOrder ?? -1) + 1 })
    .returning();

  return Response.json(row, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const photoId = request.nextUrl.searchParams.get("photoId");
  if (!photoId) {
    return Response.json({ error: "photoId is required" }, { status: 400 });
  }

  const [row] = await db
    .delete(unitPhotos)
    .where(eq(unitPhotos.id, photoId))
    .returning();

  if (!row || row.unitId !== id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await del(row.blobUrl);

  return Response.json({ ok: true });
}
