import { InventoryFilterToolbar } from "@/features/inventory/components/InventoryFilterToolbar";
import { InventoryGrid } from "@/features/inventory/components/InventoryGrid";
import { LogoutButton } from "@/features/inventory/components/LogoutButton";
import { ManageSharesDialog } from "@/features/inventory/components/ManageSharesDialog";
import { ShareBuilderDialog } from "@/features/inventory/components/ShareBuilderDialog";
import { UnitFormDrawer } from "@/features/inventory/components/UnitFormDrawer";
import { getSessionUser } from "@/lib/inventory-auth";

export default async function InventoryPage() {
  const session = await getSessionUser();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Commercial units — plots, shops, plazas, hotels.
            {session && (
              <span className="ml-2 text-muted-foreground/70">
                Signed in as {session.username}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ManageSharesDialog />
          <ShareBuilderDialog />
          <UnitFormDrawer trigger="Add unit" />
          <LogoutButton />
        </div>
      </div>

      <div className="mt-6">
        <InventoryFilterToolbar />
      </div>

      <InventoryGrid />
    </div>
  );
}
