import { cookies } from "next/headers";
import {
  INVENTORY_SESSION_COOKIE,
  getSession,
  type SessionPayload,
} from "@/lib/inventory-session";

/** Server-only: reads the session cookie for the current request. */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return getSession(cookieStore.get(INVENTORY_SESSION_COOKIE)?.value);
}
