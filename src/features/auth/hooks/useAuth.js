import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo iniciar sesión");
      set({ user: data.user, loading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la cuenta");
      set({ user: data.user, loading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      set({ user: null, error: null });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
