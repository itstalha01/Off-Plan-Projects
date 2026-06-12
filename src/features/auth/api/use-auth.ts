"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store/auth-store";
import type { LoginInput, RegisterInput } from "../validations";

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: ({ user }) => setUser(user),
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: ({ user }) => setUser(user),
  });
}

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => clearUser(),
  });
}
