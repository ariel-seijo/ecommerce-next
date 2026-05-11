"use client";

import { ArrowUpDown, Check, X as XIcon } from "lucide-react";
import styles from "./ProductFilters.module.css";

const SORT_OPTIONS = [
  { value: "createdAt", label: "M\u00e1s recientes" },
  { value: "price", label: "Precio" },
  { value: "stock", label: "Inventario" },
  { value: "sold", label: "Vendidos" },
];

export default function ProductFilters({
  categories,
  categoryId,
  status,
  featured,
  sort,
  order,
  onChange,
}) {
  return (
    <div className={styles.bar}>
      {/* Category dropdown */}
      <div className={styles.group}>
        <label htmlFor="filter-category" className={styles.label}>
          Categor\u00eda
        </label>
        <select
          id="filter-category"
          value={categoryId}
          onChange={(e) => onChange("categoryId", e.target.value)}
          className={styles.select}
          aria-label="Filtrar por categor\u00eda"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status pills */}
      <div className={styles.group}>
        <span className={styles.label}>Estado</span>
        <div className={styles.pills}>
          <button
            type="button"
            className={`${styles.pill} ${!status ? styles.pillActive : ""}`}
            onClick={() => onChange("status", "")}
            aria-pressed={!status}
          >
            Todas
          </button>
          <button
            type="button"
            className={`${styles.pill} ${status === "active" ? styles.pillActive : ""}`}
            onClick={() => onChange("status", "active")}
            aria-pressed={status === "active"}
          >
            <Check size={12} aria-hidden="true" /> Activas
          </button>
          <button
            type="button"
            className={`${styles.pill} ${status === "inactive" ? styles.pillActive : ""}`}
            onClick={() => onChange("status", "inactive")}
            aria-pressed={status === "inactive"}
          >
            <XIcon size={12} aria-hidden="true" /> Inactivas
          </button>
        </div>
      </div>

      {/* Featured toggle */}
      <div className={styles.group}>
        <button
          type="button"
          className={`${styles.pill} ${featured === "true" ? styles.pillActive : ""}`}
          onClick={() =>
            onChange("featured", featured === "true" ? "" : "true")
          }
          aria-pressed={featured === "true"}
        >
          Destacados
        </button>
      </div>

      {/* Sort */}
      <div className={styles.group}>
        <label htmlFor="filter-sort" className={styles.label}>
          Ordenar
        </label>
        <div className={styles.sortRow}>
          <select
            id="filter-sort"
            value={sort}
            onChange={(e) => onChange("sort", e.target.value)}
            className={styles.select}
            aria-label="Ordenar por"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.orderBtn}
            onClick={() =>
              onChange("order", order === "asc" ? "desc" : "asc")
            }
            aria-label={
              order === "asc" ? "Cambiar a descendente" : "Cambiar a ascendente"
            }
            title={order === "asc" ? "Ascendente" : "Descendente"}
          >
            <ArrowUpDown
              size={14}
              className={order === "asc" ? styles.orderAsc : styles.orderDesc}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
