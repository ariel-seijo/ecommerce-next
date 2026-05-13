'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import styles from "./NotificationBell.module.css";

export default function NotificationBell({ lowStock, pendingOrders }) {
  const total = (lowStock || 0) + (pendingOrders || 0);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 120000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className={styles.popover} role="dialog" aria-label="Notificaciones">
          <div className={styles.popoverHeader}>Notificaciones</div>

          {lowStock > 0 && (
            <div className={styles.item}>
              <span className={styles.itemDot} />
              <span>
                <strong>{lowStock}</strong> producto{lowStock !== 1 ? "s" : ""} con stock bajo
              </span>
            </div>
          )}

          {pendingOrders > 0 && (
            <div className={styles.item}>
              <span className={styles.itemDotPending} />
              <span>
                <strong>{pendingOrders}</strong> pedido{pendingOrders !== 1 ? "s" : ""} pendiente{pendingOrders !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {total === 0 && (
            <div className={styles.empty}>Sin alertas pendientes</div>
          )}
        </div>
      )}
    </div>
  );
}
