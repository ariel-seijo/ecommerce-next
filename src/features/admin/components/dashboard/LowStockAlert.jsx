"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./LowStockAlert.module.css";

export default function LowStockAlert({ lowStockCount, lowStockProducts }) {
  if (!lowStockCount || lowStockCount === 0) {
    return null;
  }

  const displayProducts = lowStockProducts?.slice(0, 5) || [];

  return (
    <div className={styles.alert}>
      <div className={styles.alertHeader}>
        <AlertTriangle size={20} className={styles.icon} aria-hidden="true" />
        <h3 className={styles.title}>
          Alerta de Inventario — {lowStockCount} producto{lowStockCount !== 1 ? "s" : ""} requiere{lowStockCount !== 1 ? "n" : ""} reposición
        </h3>
      </div>

      {displayProducts.length > 0 && (
        <div className={styles.productsList}>
          {displayProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <span className={styles.productTitle}>{product.title}</span>
              <span
                className={styles.stockBadge}
                data-critical={product.stock <= 2}
              >
                {product.stock} uds
              </span>
            </div>
          ))}
        </div>
      )}

      <Link href="/admin/products" className={styles.link}>
        Gestionar inventario <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}