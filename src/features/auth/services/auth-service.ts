import { apiClient } from "@/services/client/api-client";
import type { User } from "../types";
import type { LoginInput, RegisterInput } from "../validations";

export const authService = {
  login: (data: LoginInput) =>
    apiClient.post<{ user: User; token: string }>("/auth/login", data),

  register: (data: RegisterInput) =>
    apiClient.post<{ user: User; token: string }>("/auth/register", data),

  logout: () => apiClient.post<void>("/auth/logout", {}),

  me: () => apiClient.get<User>("/auth/me"),
};
