"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./UserFilters.module.css";

const ROLE_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "CUSTOMER", label: "Cliente" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activo" },
  { value: "BANNED", label: "Baneado" },
  { value: "DELETED", label: "Eliminado" },
];

export default function UserFilters({ total }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || "";
  const currentStatus = searchParams.get("status") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      params.delete("page");

      const newQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (newQuery !== currentQuery) {
        router.push(`/admin/users?${newQuery}`, { scroll: false });
      }
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function handleFilterChange(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/users?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={styles.filtersRow}>
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar por nombre o email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Buscar usuarios"
        />
      </div>

      <select
        className={styles.filterSelect}
        value={currentRole}
        onChange={(e) => handleFilterChange("role", e.target.value)}
        aria-label="Filtrar por rol"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className={styles.filterSelect}
        value={currentStatus}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        aria-label="Filtrar por estado"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {total !== undefined && (
        <span className={styles.resultCount}>
          {total} resultado{total !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
