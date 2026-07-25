import { cookies } from "next/headers";
import { inventoryConfig } from "@/config/inventory";
import { INVENTORY_SESSION_COOKIE, signSession } from "@/lib/inventory-session";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!inventoryConfig.password || password !== inventoryConfig.password) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const maxAge = 60 * 60 * 24 * 30;
  (await cookies()).set(INVENTORY_SESSION_COOKIE, signSession(maxAge), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    // Must be "/" (not "/inventory") so the cookie is also sent on
    // /api/inventory/* requests, which don't share that path prefix.
    path: "/",
    maxAge,
  });

  return Response.json({ ok: true });
}
