import { createHmac, timingSafeEqual } from "node:crypto";
import { inventoryConfig } from "@/config/inventory";

export const INVENTORY_SESSION_COOKIE = "inv_session";

export type SessionPayload = {
  userId: string;
  username: string;
};

function sign(payload: string): string {
  return createHmac("sha256", inventoryConfig.sessionSecret)
    .update(payload)
    .digest("base64url");
}

export function signSession(
  data: SessionPayload,
  expiresInSec = 60 * 60 * 24 * 30
): string {
  const payload = Buffer.from(
    JSON.stringify({ ...data, exp: Date.now() + expiresInSec * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getSession(cookieValue: string | undefined): SessionPayload | null {
  if (!cookieValue) return null;
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const { userId, username, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );
    if (typeof exp !== "number" || Date.now() >= exp) return null;
    if (typeof userId !== "string" || typeof username !== "string") return null;
    return { userId, username };
  } catch {
    return null;
  }
}
