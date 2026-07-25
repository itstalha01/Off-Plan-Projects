import { InventoryFilterToolbar } from "@/features/inventory/components/InventoryFilterToolbar";
import { InventoryGrid } from "@/features/inventory/components/InventoryGrid";
import { ManageSharesDialog } from "@/features/inventory/components/ManageSharesDialog";
import { ShareBuilderDialog } from "@/features/inventory/components/ShareBuilderDialog";
import { UnitFormDrawer } from "@/features/inventory/components/UnitFormDrawer";

export default function InventoryPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Commercial units — plots, shops, plazas, hotels.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ManageSharesDialog />
          <ShareBuilderDialog />
          <UnitFormDrawer trigger="Add unit" />
        </div>
      </div>

      <div className="mt-6">
        <InventoryFilterToolbar />
      </div>

      <InventoryGrid />
    </div>
  );
}
