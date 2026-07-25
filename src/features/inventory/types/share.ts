import type { ShareableFieldKey } from "../constants/shareable-fields";

export type InventoryShare = {
  id: string;
  token: string;
  unitIds: string[];
  visibleFields: ShareableFieldKey[];
  createdAt: string;
  revokedAt: string | null;
};
