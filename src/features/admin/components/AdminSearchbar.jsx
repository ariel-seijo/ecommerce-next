'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import styles from "./AdminSearchbar.module.css";

const SCOPES = [
  { value: "orders", label: "Órdenes" },
  { value: "users", label: "Usuarios" },
  { value: "products", label: "Productos" },
];

export default function AdminSearchbar() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("orders");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/admin/${scope}?search=${encodeURIComponent(query.trim())}`);
    setExpanded(false);
  };

  return (
    <form className={styles.searchbar} onSubmit={handleSubmit}>
      <div className={`${styles.inputGroup} ${expanded ? styles.expanded : ""}`}>
        <Search
          size={16}
          className={styles.icon}
          onClick={() => setExpanded(!expanded)}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            scope === "orders"
              ? "Buscar órdenes..."
              : scope === "users"
                ? "Buscar usuarios..."
                : "Buscar productos..."
          }
          className={styles.input}
          aria-label={`Buscar en ${scope === "orders" ? "órdenes" : scope === "users" ? "usuarios" : "productos"}`}
        />
      </div>
      <div className={styles.scopeToggle}>
        {SCOPES.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`${styles.scopeBtn} ${scope === s.value ? styles.scopeActive : ""}`}
            onClick={() => setScope(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </form>
  );
}
