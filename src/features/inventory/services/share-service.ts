import { apiClient } from "@/services/client/api-client";
import type { InventoryShare } from "../types/share";
import type { CreateShareInput } from "../validations/share";

export const shareService = {
  list: () => apiClient.get<InventoryShare[]>("/inventory/shares"),

  create: (data: CreateShareInput) =>
    apiClient.post<InventoryShare>("/inventory/shares", data),

  revoke: (token: string) =>
    apiClient.patch<InventoryShare>(`/inventory/shares/${token}`, { revoke: true }),
};
