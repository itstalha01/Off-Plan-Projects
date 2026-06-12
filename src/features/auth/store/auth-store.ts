import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "../types";

type AuthActions = {
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "auth-store" }
  )
);
