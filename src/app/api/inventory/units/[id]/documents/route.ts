import type { NextRequest } from "next/server";
import { del } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { unitDocuments, units } from "@/db/schema";
import { getSessionUser } from "@/lib/inventory-auth";

type Params = { params: Promise<{ id: string }> };

async function ownsUnit(unitId: string, userId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: units.id })
    .from(units)
    .where(and(eq(units.id, unitId), eq(units.ownerId, userId)));
  return Boolean(row);
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownsUnit(id, session.userId))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { blobUrl, name } = await request.json();

  if (typeof blobUrl !== "string" || !blobUrl) {
    return Response.json({ error: "blobUrl is required" }, { status: 400 });
  }
  if (typeof name !== "string" || !name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  const [row] = await db
    .insert(unitDocuments)
    .values({ unitId: id, blobUrl, name })
    .returning();

  return Response.json(row, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!(await ownsUnit(id, session.userId))) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const documentId = request.nextUrl.searchParams.get("documentId");
  if (!documentId) {
    return Response.json({ error: "documentId is required" }, { status: 400 });
  }

  const [row] = await db
    .delete(unitDocuments)
    .where(eq(unitDocuments.id, documentId))
    .returning();

  if (!row || row.unitId !== id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await del(row.blobUrl);

  return Response.json({ ok: true });
}
