import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { inventoryShares } from "@/db/schema";
import { createShareSchema } from "@/features/inventory/validations/share";

export async function GET() {
  const rows = await db
    .select()
    .from(inventoryShares)
    .orderBy(desc(inventoryShares.createdAt));

  return Response.json(rows);
}

export async function POST(request: Request) {
  const parsed = createShareSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .insert(inventoryShares)
    .values({
      token: nanoid(24),
      unitIds: parsed.data.unitIds,
      visibleFields: parsed.data.fields,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
