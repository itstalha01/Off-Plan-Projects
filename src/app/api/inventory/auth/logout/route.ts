import { cookies } from "next/headers";
import { INVENTORY_SESSION_COOKIE } from "@/lib/inventory-session";

export async function POST() {
  (await cookies()).delete(INVENTORY_SESSION_COOKIE);
  return Response.json({ ok: true });
}
