import { desc, eq, inArray, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { inventoryShares, units } from "@/db/schema";
import { getSessionUser } from "@/lib/inventory-auth";
import { createShareSchema } from "@/features/inventory/validations/share";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(inventoryShares)
    .where(eq(inventoryShares.ownerId, session.userId))
    .orderBy(desc(inventoryShares.createdAt));

  return Response.json(rows);
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = createShareSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const owned = await db
    .select({ id: units.id })
    .from(units)
    .where(and(inArray(units.id, parsed.data.unitIds), eq(units.ownerId, session.userId)));
  if (owned.length !== parsed.data.unitIds.length) {
    return Response.json({ error: "One or more units were not found" }, { status: 400 });
  }

  const [row] = await db
    .insert(inventoryShares)
    .values({
      ownerId: session.userId,
      token: nanoid(24),
      unitIds: parsed.data.unitIds,
      visibleFields: parsed.data.fields,
      expiresAt: parsed.data.expiresInHours
        ? new Date(Date.now() + parsed.data.expiresInHours * 60 * 60 * 1000)
        : null,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
