"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCategoryUrl } from "@/features/category/utils/buildCategoryUrl";
import styles from "./Pagination.module.css";

export default function Pagination({
  name,
  page,
  totalPages,
  sort,
  brand,
  min,
  max,
  view,
}) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const current = { sort, brand, min, max, view };

  const goToPage = (newPage) => {
    router.push(
      buildCategoryUrl(name, current, { page: String(newPage) }),
      { scroll: false }
    );
  };

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => {
      if (totalPages <= 7) return true;
      if (n === 1 || n === totalPages) return true;
      if (Math.abs(n - page) <= 1) return true;
      return false;
    }
  );

  return (
    <nav className={styles.pagination} aria-label="Paginación de productos">
      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <div className={styles.pageNumbers}>
        {visiblePages.map((n, idx, arr) => {
          const showEllipsis = idx > 0 && n - arr[idx - 1] > 1;
          return (
            <span key={n} className={styles.pageGroup}>
              {showEllipsis && (
                <span className={styles.ellipsis} aria-hidden="true">…</span>
              )}
              <button
                type="button"
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                onClick={() => goToPage(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Página ${n}`}
              >
                {n}
              </button>
            </span>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
