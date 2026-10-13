import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hn_access_token", accessToken);
      localStorage.setItem("hn_user", JSON.stringify(user));
    }
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hn_access_token");
      localStorage.removeItem("hn_user");
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("hn_access_token");
    const userStr = localStorage.getItem("hn_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, accessToken: token, isAuthenticated: true });
      } catch (err) {
        console.error("Hydrate failed:", err);
        localStorage.removeItem("hn_access_token");
        localStorage.removeItem("hn_user");
      }
    }
  },
}));
