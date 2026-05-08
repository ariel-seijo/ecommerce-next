import { create } from "zustand";

export const useToastStore = create((set) => ({
  message: null,
  type: "success",

  toast: (message, type = "success") => {
    set({ message, type });
    setTimeout(() => set({ message: null }), 3000);
  },

  dismiss: () => set({ message: null }),
}));
