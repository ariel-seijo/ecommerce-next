"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Search, X, Filter } from "lucide-react";
import styles from "./OrderFilters.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendientes" },
  { value: "PAID", label: "Pagados" },
  { value: "SHIPPED", label: "Enviados" },
  { value: "DELIVERED", label: "Entregados" },
  { value: "CANCELLED", label: "Cancelados" },
];

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef(null);

  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  const hasFilters = status || search || dateFrom || dateTo;

  const pushParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("page");
      router.push(`/admin/orders?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  function handleSearch(e) {
    e.preventDefault();
    const value = searchRef.current?.value?.trim() || "";
    pushParams({ search: value || "" });
  }

  function handleClear() {
    router.push("/admin/orders", { scroll: false });
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <form className={styles.searchGroup} onSubmit={handleSearch} role="search">
          <Search size={16} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={searchRef}
            type="text"
            defaultValue={search}
            placeholder="Buscar por #orden o email..."
            className={styles.searchInput}
            aria-label="Buscar pedidos por número de orden o email"
          />
          <button type="submit" className={styles.searchBtn}>
            Buscar
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => pushParams({ status: e.target.value })}
          className={styles.select}
          aria-label="Filtrar por estado"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className={styles.dateGroup}>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => pushParams({ dateFrom: e.target.value })}
            className={styles.dateInput}
            aria-label="Fecha desde"
          />
          <span className={styles.dateSep}>-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => pushParams({ dateTo: e.target.value })}
            className={styles.dateInput}
            aria-label="Fecha hasta"
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Limpiar todos los filtros"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      {hasFilters && (
        <div className={styles.activeBar} aria-live="polite">
          <Filter size={12} aria-hidden="true" />
          <span className={styles.activeLabel}>Filtros activos:</span>
          {status && (
            <span className={styles.chip}>
              {STATUS_OPTIONS.find((o) => o.value === status)?.label || status}
            </span>
          )}
          {search && (
            <span className={styles.chip}>
              Buscar: {search}
            </span>
          )}
          {dateFrom && (
            <span className={styles.chip}>
              Desde: {dateFrom}
            </span>
          )}
          {dateTo && (
            <span className={styles.chip}>
              Hasta: {dateTo}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
