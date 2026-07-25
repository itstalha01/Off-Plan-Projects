import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { INVENTORY_SESSION_COOKIE, verifySession } from "@/lib/inventory-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname.startsWith("/inventory/share/") ||
    pathname === "/inventory/login" ||
    pathname === "/api/inventory/auth";
  if (isPublic) return NextResponse.next();

  const isApi = pathname.startsWith("/api/inventory");
  if (!pathname.startsWith("/inventory") && !isApi) return NextResponse.next();

  const authed = verifySession(request.cookies.get(INVENTORY_SESSION_COOKIE)?.value);
  if (authed) return NextResponse.next();

  if (isApi) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/inventory/login", request.url));
}

export const config = {
  matcher: ["/inventory/:path*", "/api/inventory/:path*"],
};
