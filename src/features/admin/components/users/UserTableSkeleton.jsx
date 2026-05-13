"use client";

import Skeleton from "@/components/ui/Skeleton";
import styles from "./UserTableSkeleton.module.css";

export default function UserTableSkeleton({ rows = 8 }) {
  return (
    <div className={styles.wrapper} role="status" aria-label="Cargando usuarios">
      <div className={styles.header}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="80%" height={14} />
        <Skeleton width="60%" height={14} />
        <Skeleton width="50%" height={14} />
        <Skeleton width="70%" height={14} />
        <Skeleton width="60%" height={14} />
        <Skeleton width={32} height={14} />
      </div>

      <div className={styles.rows}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.userCell}>
              <Skeleton width="85%" height={14} />
              <Skeleton width="60%" height={11} />
            </div>
            <Skeleton width="80%" height={14} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={14} />
            <Skeleton width="75%" height={14} />
            <Skeleton width="60%" height={14} />
            <Skeleton width={32} height={14} />
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <Skeleton width={160} height={14} />
        <div style={{ display: "flex", gap: 4 }}>
          <Skeleton width={80} height={32} />
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
          <Skeleton width={80} height={32} />
        </div>
      </div>
    </div>
  );
}
