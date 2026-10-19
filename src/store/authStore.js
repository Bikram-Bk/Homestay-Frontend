import { create } from "zustand";
import api from "@/lib/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: false,
  setAuth: (user, accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hn_user", JSON.stringify(user));
    }
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hn_user");
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  hydrate: async () => {
    if (get().isHydrating || get().isAuthenticated) return;

    set({ isHydrating: true });

    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("hn_user") : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user });
      } catch {
        localStorage.removeItem("hn_user");
      }
    }

    try {
      const res = await api.post("/auth/refresh");
      const { user, accessToken } = res.data?.data || {};
      if (accessToken && user) {
        localStorage.setItem("hn_user", JSON.stringify(user));
        set({ user, accessToken, isAuthenticated: true });
      } else {
        throw new Error("No token in refresh response");
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hn_user");
      }
      set({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      set({ isHydrating: false });
    }
  },
}));
