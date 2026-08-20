import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { INVENTORY_SESSION_COOKIE, signSession } from "@/lib/inventory-session";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return Response.json({ error: "Username and password are required" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: "Incorrect username or password" }, { status: 401 });
  }

  const maxAge = 60 * 60 * 24 * 30;
  (await cookies()).set(
    INVENTORY_SESSION_COOKIE,
    signSession({ userId: user.id, username: user.username }, maxAge),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      // Must be "/" (not "/inventory") so the cookie is also sent on
      // /api/inventory/* requests, which don't share that path prefix.
      path: "/",
      maxAge,
    }
  );

  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(INVENTORY_SESSION_COOKIE);
  return Response.json({ ok: true });
}
