'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, X, Package, ShoppingCart, Clock } from "lucide-react";
import Link from "next/link";
import styles from "./NotificationBell.module.css";

const STORAGE_KEY = "admin-dismissed-notifications";

function loadDismissed() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDismissed(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch { /* */ }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function NotificationBell({ lowStock, recentOrders, pendingCount }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => new Set());
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setDismissed(loadDismissed()); }, []);

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 60000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const dismissItem = useCallback((id) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  }, []);

  const stockProducts = (lowStock?.products || []).filter(
    (p) => !dismissed.has(`stock-${p.id}`)
  );
  const visibleOrders = (recentOrders || []).filter(
    (o) => !dismissed.has(`order-${o.id}`)
  );

  const total = stockProducts.length + visibleOrders.length;

  if (!mounted) {
    return (
      <div className={styles.bell}>
        <button className={styles.button} aria-label="Cargando notificaciones" disabled>
          <Bell size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bell} ref={ref}>
      <button
        className={styles.button}
        onClick={() => setOpen(!open)}
        aria-label={`Notificaciones: ${total} alerta${total !== 1 ? "s" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.popover} role="dialog" aria-label="Notificaciones">
            <div className={styles.popoverHeader}>
              <span>Notificaciones</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Cerrar notificaciones"
              >
                <X size={16} />
              </button>
            </div>

            {total === 0 && (
              <div className={styles.empty}>Sin alertas pendientes</div>
            )}

            {visibleOrders.slice(0, 5).map((order) => (
              <div key={`order-${order.id}`} className={styles.item}>
                <ShoppingCart size={16} className={styles.itemIconOrder} />
                <div className={styles.itemContent}>
                  <span className={styles.itemText}>
                    Nuevo pedido{" "}
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={styles.itemLink}
                      onClick={() => setOpen(false)}
                    >
                      {order.orderNumber}
                    </Link>
                  </span>
                  <span className={styles.itemTime}>
                    <Clock size={11} />
                    {timeAgo(order.createdAt)}
                    {order.user?.email && (
                      <> — {order.user.email}</>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.dismissBtn}
                  onClick={(e) => { e.stopPropagation(); dismissItem(`order-${order.id}`); }}
                  aria-label={`Descartar ${order.orderNumber}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {stockProducts.slice(0, 5).map((product) => (
              <div key={`stock-${product.id}`} className={styles.item}>
                <Package size={16} className={styles.itemIconStock} />
                <div className={styles.itemContent}>
                  <span className={styles.itemText}>
                    <Link
                      href={`/admin/products?search=${encodeURIComponent(product.title)}`}
                      className={styles.itemLink}
                      onClick={() => setOpen(false)}
                    >
                      {product.title}
                    </Link>
                  </span>
                  <span className={styles.itemTime}>
                    Stock bajo: <strong>{product.stock}</strong> uds
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.dismissBtn}
                  onClick={(e) => { e.stopPropagation(); dismissItem(`stock-${product.id}`); }}
                  aria-label={`Descartar alerta de ${product.title}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {(lowStock?.count > stockProducts.length || pendingCount > visibleOrders.length || visibleOrders.length > 5 || stockProducts.length > 5) && (
              <div className={styles.more}>
                {pendingCount > 0 && (
                  <Link href="/admin/orders" className={styles.moreLink} onClick={() => setOpen(false)}>
                    {pendingCount} pedido{pendingCount !== 1 ? "s" : ""} pendiente{pendingCount !== 1 ? "s" : ""}
                  </Link>
                )}
                {pendingCount > 0 && lowStock?.count > 0 && " · "}
                {lowStock?.count > 0 && (
                  <Link href="/admin/products" className={styles.moreLink} onClick={() => setOpen(false)}>
                    {lowStock.count} producto{lowStock.count !== 1 ? "s" : ""} con stock bajo
                  </Link>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
