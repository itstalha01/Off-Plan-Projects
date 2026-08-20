"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unitService } from "../services/unit-service";
import { useInventoryFilterStore } from "../store/inventory-filter-store";
import type { UnitInput } from "../validations/unit";

export function useUnits() {
  const { city, area, sector, type, status } = useInventoryFilterStore();

  return useQuery({
    queryKey: ["inventory", "units", { city, area, sector, type, status }],
    queryFn: () => unitService.list({ city, area, sector, type, status }),
  });
}

/** Full, unfiltered list — used to populate City/Area filter options so they
 * don't shrink to just what's currently visible as other filters are applied. */
export function useAllUnitsForOptions() {
  return useQuery({
    queryKey: ["inventory", "units", "all"],
    queryFn: () => unitService.list({}),
    staleTime: 60_000,
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UnitInput) => unitService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", "units"] }),
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UnitInput }) =>
      unitService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", "units"] }),
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", "units"] }),
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: ["inventory", "units", "detail", id],
    queryFn: () => unitService.get(id),
  });
}

export function useAddPhoto(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blobUrl: string) => unitService.addPhoto(unitId, blobUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "units", "detail", unitId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "units"] });
    },
  });
}

export function useRemovePhoto(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) => unitService.removePhoto(unitId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "units", "detail", unitId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "units"] });
    },
  });
}

export function useAddDocument(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blobUrl, name }: { blobUrl: string; name: string }) =>
      unitService.addDocument(unitId, blobUrl, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "units", "detail", unitId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "units"] });
    },
  });
}

export function useRemoveDocument(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => unitService.removeDocument(unitId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", "units", "detail", unitId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "units"] });
    },
  });
}
