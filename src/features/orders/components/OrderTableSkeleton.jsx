import Skeleton from "@/components/ui/Skeleton";
import styles from "./OrderTableSkeleton.module.css";

export default function OrderTableSkeleton({ rows = 8 }) {
  return (
    <div className={styles.wrapper} role="status" aria-label="Cargando pedidos">
      <div className={styles.filtersPlaceholder}>
        <Skeleton width={140} height={34} />
        <Skeleton width={120} height={34} />
        <Skeleton width={120} height={34} />
        <Skeleton width={220} height={34} />
      </div>

      <div className={styles.header}>
        <Skeleton width="14%" height={14} />
        <Skeleton width="18%" height={14} />
        <Skeleton width="8%" height={14} />
        <Skeleton width="10%" height={14} />
        <Skeleton width="10%" height={14} />
        <Skeleton width="10%" height={14} />
        <Skeleton width="8%" height={14} />
      </div>

      <div className={styles.rows}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width="80%" height={14} />
            <div className={styles.customerCell}>
              <Skeleton width="70%" height={14} />
              <Skeleton width="80%" height={11} />
            </div>
            <Skeleton width="50%" height={14} />
            <Skeleton width="70%" height={14} />
            <Skeleton width={80} height={22} />
            <Skeleton width="80%" height={14} />
            <Skeleton width={56} height={28} />
          </div>
        ))}
      </div>
    </div>
  );
}
