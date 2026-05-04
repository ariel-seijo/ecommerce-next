"use client";

import { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return children;
}
