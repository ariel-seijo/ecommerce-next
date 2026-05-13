'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
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
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => setExpanded(false), []);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setExpanded(false);
    setPrevPathname(pathname);
  }

  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [expanded, close]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/admin/${scope}?search=${encodeURIComponent(query.trim())}`);
    setExpanded(false);
  };

  return (
    <div className={styles.searchbar} ref={containerRef}>
      <form className={styles.desktopForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <Search size={16} className={styles.searchIcon} />
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

      <button
        type="button"
        className={styles.mobileToggle}
        onClick={handleToggle}
        aria-label={expanded ? "Cerrar búsqueda" : "Abrir búsqueda"}
        aria-expanded={expanded}
      >
        {expanded ? <X size={20} /> : <Search size={20} />}
      </button>

      {expanded && (
        <>
          <div
            className={styles.backdrop}
            onClick={close}
            aria-hidden="true"
          />

          <div className={styles.mobilePanel} role="dialog" aria-label="Buscar">
            <div className={styles.mobilePanelHeader}>
              <span>Buscar</span>
              <button
                type="button"
                className={styles.mobilePanelClose}
                onClick={close}
                aria-label="Cerrar búsqueda"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.mobilePanelForm}>
              <div className={styles.mobileInputWrap}>
                <Search size={16} className={styles.mobileSearchIcon} />
                <input
                  ref={inputRef}
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
                  className={styles.mobileInput}
                  aria-label={`Buscar en ${scope === "orders" ? "órdenes" : scope === "users" ? "usuarios" : "productos"}`}
                  autoComplete="off"
                />
              </div>

              <div className={styles.mobileScopeToggle}>
                {SCOPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`${styles.mobileScopeBtn} ${scope === s.value ? styles.mobileScopeActive : ""}`}
                    onClick={() => setScope(s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className={styles.mobileSubmitBtn}
                disabled={!query.trim()}
              >
                Buscar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
