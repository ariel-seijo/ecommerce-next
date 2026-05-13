"use client";

import { useState, useEffect } from "react";
import { X, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { getUserOrderHistoryAction } from "@/features/admin/actions/userActions";
import styles from "./UserOrderHistory.module.css";

function getStatusClass(status) {
  switch (status) {
    case "PENDING":
      return "badge-warning";
    case "PAID":
      return "badge-info";
    case "SHIPPED":
      return "badge-info";
    case "DELIVERED":
      return "badge-success";
    case "CANCELLED":
      return "badge-danger";
    default:
      return "";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "PAID":
      return "Pagado";
    case "SHIPPED":
      return "Enviado";
    case "DELIVERED":
      return "Entregado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserOrderHistory({ userId, isOpen, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let cancelled = false;

    getUserOrderHistoryAction(userId).then((result) => {
      if (!cancelled) {
        setData(result.success ? result : null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const loading = !data;

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-history-title"
      >
        <div className={styles.header}>
          <h3 className={styles.title} id="order-history-title">
            Historial de órdenes
          </h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar historial"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {loading && (
          <div className={styles.loading} role="status">
            <span className="visually-hidden">Cargando órdenes...</span>
          </div>
        )}

        {!loading && data?.user && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>{data.user.name || "—"}</p>
            <p className={styles.userEmail}>{data.user.email}</p>
            <div className={styles.userMeta}>
              <span>{data.user.role === "ADMIN" ? "Admin" : "Cliente"}</span>
              <span>·</span>
              <span>{data.orders?.length ?? 0} órdenes</span>
            </div>
          </div>
        )}

        {!loading && data?.orders && data.orders.length > 0 && (
          <div className={styles.orderList}>
            {data.orders.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderNumber}>
                    #{order.orderNumber}
                  </span>
                  <span className={styles.orderTotal}>
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <span>
                    <span className={`badge ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </span>
                  <span className={styles.orderItems}>
                    {order._count?.items ?? 0} items
                  </span>
                  <span className={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && data?.orders && data.orders.length === 0 && (
          <div className={styles.empty}>
            <Package size={40} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyText}>Sin órdenes</p>
            <p className={styles.emptySubtext}>
              Este usuario no ha realizado compras
            </p>
          </div>
        )}
      </div>
    </>
  );
}
