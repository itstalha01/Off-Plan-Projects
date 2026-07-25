"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shareService } from "../services/share-service";
import type { CreateShareInput } from "../validations/share";

export function useShares() {
  return useQuery({
    queryKey: ["inventory", "shares"],
    queryFn: () => shareService.list(),
  });
}

export function useCreateShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShareInput) => shareService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", "shares"] }),
  });
}

export function useRevokeShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => shareService.revoke(token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", "shares"] }),
  });
}
