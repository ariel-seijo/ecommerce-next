"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { buildCategoryUrl } from "../utils/buildCategoryUrl";
import { cn } from "@/lib/utils/cn";
import styles from "./FiltersSidebar.module.css";

export default function FiltersSidebar({
  name,
  brands,
  sort,
  brand,
  min,
  max,
  minPrice,
  maxPrice,
  view = "grid",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState(Number(max || maxPrice));
  const drawerRef = useRef(null);

  const current = { sort, brand, min, max, view };

  const sortLabels = {
    asc: "Menor precio",
    desc: "Mayor precio",
    popular: "Más vendidos",
    rating: "Mejor valorados",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const timer = setTimeout(() => {
        const el = drawerRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        el?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filterGroups = (
    <>
      <div className={styles.filterGroup}>
        <span className={styles.filterTitle}>Seleccionados</span>

        <div className={styles.selectedArea}>
          {sort !== "recent" && (
            <Link
              href={buildCategoryUrl(name, current, { sort: "recent" })}
              className={styles.selectedTag}
            >
              {sortLabels[sort]} ✕
            </Link>
          )}

          {brand && (
            <Link
              href={buildCategoryUrl(name, current, { brand: "" })}
              className={styles.selectedTag}
            >
              {brand} ✕
            </Link>
          )}

          {(min || max) && (
            <Link
              href={buildCategoryUrl(name, current, { min: "", max: "" })}
              className={styles.selectedTag}
            >
              ${min || minPrice} - ${max || maxPrice} ✕
            </Link>
          )}

          {!brand && sort === "recent" && !min && !max && (
            <span className={styles.noneSelected}>Sin filtros</span>
          )}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterTitle}>Precio</span>

        <form action={`/category/${name}`} method="GET" className={styles.priceForm}>
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="brand" value={brand} />
          {view !== "grid" && <input type="hidden" name="view" value={view} />}
          <input type="hidden" name="min" value={minPrice} />

          <div className={styles.rangeInfo}>
            <small>Mín: ${minPrice}</small>
            <small>Max: ${rangeValue}</small>
          </div>

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={rangeValue}
            name="max"
            className={styles.rangeBar}
            onChange={(e) => setRangeValue(Number(e.target.value))}
          />

          <button type="submit" className={styles.priceBtn}>Aplicar</button>
        </form>
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterTitle}>Marca</span>

        {brands.map((item) => (
          <Link
            key={item.brand}
            href={buildCategoryUrl(name, current, { brand: item.brand })}
            className={cn(styles.brandLink, brand === item.brand && styles.brandLinkActive)}
          >
            {item.brand}
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      <button
        className={styles.triggerBtn}
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="filter-drawer"
      >
        <SlidersHorizontal size={18} />
        Filtros
      </button>

      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={styles.sidebar}>{filterGroups}</aside>

      <div
        id="filter-drawer"
        ref={drawerRef}
        className={cn(styles.drawer, isOpen && styles.drawerOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de productos"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Filtros</span>
          <button
            className={styles.drawerClose}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar filtros"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>{filterGroups}</div>

        <button className={styles.applyBtn} onClick={() => setIsOpen(false)}>
          Ver resultados
        </button>
      </div>
    </>
  );
}
