import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SafeUser } from "../types/auth.types";

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  setAuth: (user: SafeUser, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        setAuth: (user, accessToken) => set({ user, accessToken }),
        clearAuth: () => set({ user: null, accessToken: null }),
      }),
      { name: "bookvault-auth" },
    ),
    { name: "BookVault Auth", enabled: process.env.NODE_ENV === "development" },
  ),
);
