"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import styles from "./ViewSwitcher.module.css";

const STORAGE_KEY = "productView";

export default function ViewSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view);
  }, [view]);

  const buildLink = (newView) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newView === "grid") {
      params.delete("view");
    } else {
      params.set("view", newView);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div
      className={styles.switcher}
      role="radiogroup"
      aria-label="Vista de productos"
    >
      <Link
        href={buildLink("grid")}
        className={`${styles.btn} ${view === "grid" ? styles.active : ""}`}
        role="radio"
        aria-checked={view === "grid"}
        aria-label="Vista en cuadrícula"
        scroll={false}
        replace
      >
        <LayoutGrid size={16} aria-hidden="true" />
      </Link>

      <Link
        href={buildLink("list")}
        className={`${styles.btn} ${view === "list" ? styles.active : ""}`}
        role="radio"
        aria-checked={view === "list"}
        aria-label="Vista en lista"
        scroll={false}
        replace
      >
        <List size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
