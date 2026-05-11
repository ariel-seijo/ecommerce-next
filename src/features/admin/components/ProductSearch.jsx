"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import styles from "./ProductSearch.module.css";

export default function ProductSearch({ value, onChange }) {
  const [local, setLocal] = useState(value || "");
  const timerRef = useRef(null);

  useEffect(() => {
    // React 19: syncing controlled input from URL search params.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocal(value || "");
  }, [value]);

  function handleChange(e) {
    const v = e.target.value;
    setLocal(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(v);
    }, 300);
  }

  function handleClear() {
    setLocal("");
    onChange("");
  }

  return (
    <div className={styles.wrapper} role="search">
      <Search size={16} className={styles.icon} aria-hidden="true" />
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder="Buscar por t\u00edtulo, SKU o marca\u2026"
        className={styles.input}
        aria-label="Buscar productos"
      />
      {local && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clear}
          aria-label="Limpiar b\u00fasqueda"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
