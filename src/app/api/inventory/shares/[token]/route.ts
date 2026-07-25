import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { inventoryShares } from "@/db/schema";

type Params = { params: Promise<{ token: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { token } = await params;
  const { revoke } = await request.json();

  if (!revoke) {
    return Response.json({ error: "Unsupported update" }, { status: 400 });
  }

  const [row] = await db
    .update(inventoryShares)
    .set({ revokedAt: new Date() })
    .where(eq(inventoryShares.token, token))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { token } = await params;
  const [row] = await db
    .delete(inventoryShares)
    .where(eq(inventoryShares.token, token))
    .returning();

  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
