import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getSessionUser } from "@/lib/inventory-auth";

export default async function InventoryAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionUser();

  if (!session) redirect("/inventory/login");

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
