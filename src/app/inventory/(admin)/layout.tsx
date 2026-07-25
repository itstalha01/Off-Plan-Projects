import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { INVENTORY_SESSION_COOKIE, verifySession } from "@/lib/inventory-session";

export default async function InventoryAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const authed = verifySession(cookieStore.get(INVENTORY_SESSION_COOKIE)?.value);

  if (!authed) redirect("/inventory/login");

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
