import { apiClient } from "@/services/client/api-client";
import type { Unit, UnitDocument, UnitFilters, UnitPhoto } from "../types/unit";
import type { UnitInput } from "../validations/unit";

export const unitService = {
  list: (filters: UnitFilters) =>
    apiClient.get<Unit[]>("/inventory/units", {
      params: Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      ) as Record<string, string>,
    }),

  get: (id: string) => apiClient.get<Unit>(`/inventory/units/${id}`),

  create: (data: UnitInput) => apiClient.post<Unit>("/inventory/units", data),

  update: (id: string, data: UnitInput) =>
    apiClient.patch<Unit>(`/inventory/units/${id}`, data),

  remove: (id: string) => apiClient.delete<{ ok: true }>(`/inventory/units/${id}`),

  addPhoto: (unitId: string, blobUrl: string) =>
    apiClient.post<UnitPhoto>(`/inventory/units/${unitId}/photos`, { blobUrl }),

  removePhoto: (unitId: string, photoId: string) =>
    apiClient.delete<{ ok: true }>(`/inventory/units/${unitId}/photos`, {
      params: { photoId },
    }),

  addDocument: (unitId: string, blobUrl: string, name: string) =>
    apiClient.post<UnitDocument>(`/inventory/units/${unitId}/documents`, { blobUrl, name }),

  removeDocument: (unitId: string, documentId: string) =>
    apiClient.delete<{ ok: true }>(`/inventory/units/${unitId}/documents`, {
      params: { documentId },
    }),
};
