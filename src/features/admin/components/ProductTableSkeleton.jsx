"use client";

import Skeleton from "@/components/ui/Skeleton";
import styles from "./ProductTableSkeleton.module.css";

export default function ProductTableSkeleton({ rows = 8 }) {
  return (
    <div className={styles.wrapper} role="status" aria-label="Cargando productos">
      {/* Search bar placeholder */}
      <div className={styles.searchPlaceholder}>
        <Skeleton height={40} />
      </div>

      {/* Filter bar placeholder */}
      <div className={styles.filtersPlaceholder}>
        <Skeleton width={140} height={34} />
        <Skeleton width={200} height={34} />
        <Skeleton width={100} height={34} />
        <Skeleton width={130} height={34} />
      </div>

      {/* Table header skeleton */}
      <div className={styles.header}>
        <Skeleton width="28%" height={16} />
        <Skeleton width="10%" height={16} />
        <Skeleton width="10%" height={16} />
        <Skeleton width="10%" height={16} />
        <Skeleton width="8%" height={16} />
        <Skeleton width="8%" height={16} />
        <Skeleton width="8%" height={16} />
        <Skeleton width="18%" height={16} />
      </div>

      {/* Table rows */}
      <div className={styles.rows}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.productCell}>
              <Skeleton width={40} height={40} />
              <div className={styles.productMeta}>
                <Skeleton width="80%" height={14} />
                <Skeleton width="50%" height={11} />
              </div>
            </div>
            <Skeleton width="70%" height={14} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="60%" height={14} />
            <Skeleton width="60%" height={14} />
            <Skeleton width="50%" height={14} />
            <Skeleton width="50%" height={14} />
            <div className={styles.actionsCell}>
              <Skeleton width={60} height={28} />
              <Skeleton width={60} height={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
