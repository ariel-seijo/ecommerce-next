"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/useAuthStore";

export function AuthProvider({ children }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return children;
}
