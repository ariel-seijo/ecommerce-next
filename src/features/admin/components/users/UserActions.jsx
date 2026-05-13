"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, ShieldBan, ShieldCheck, UserCheck, Trash2, MoreVertical } from "lucide-react";
import {
  toggleUserStatusAction,
  updateUserRoleAction,
  deleteUserAction,
} from "@/features/admin/actions/userActions";
import { useToastStore } from "@/features/toast";
import styles from "./UserActions.module.css";

export default function UserActions({ user, onViewOrders }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const toast = useToastStore((s) => s.toast);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  async function handleAction(action, actionFn, successMsg) {
    setLoading(action);
    const result = await actionFn();
    setLoading(null);
    closeMenu();

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(successMsg, "success");
    }
  }

  const isDeleted = !!user.deletedAt;
  const isBanned = user.status === "BANNED";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Acciones para ${user.email}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <div ref={menuRef} className={styles.menu} role="menu">
          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={() => {
              closeMenu();
              onViewOrders?.(user);
            }}
          >
            <Eye size={16} aria-hidden="true" />
            Ver órdenes
          </button>

          <div className={styles.menuDivider} />

          {!isDeleted && (
            <button
              className={styles.menuItem}
              role="menuitem"
              disabled={loading === "status"}
              onClick={() =>
                handleAction("status", () => toggleUserStatusAction(user.id), isBanned
                  ? `Usuario ${user.email} reactivado`
                  : `Usuario ${user.email} baneado`)
              }
            >
              {isBanned ? (
                <>
                  <ShieldCheck size={16} aria-hidden="true" />
                  Activar
                </>
              ) : (
                <>
                  <ShieldBan size={16} aria-hidden="true" />
                  Banear
                </>
              )}
            </button>
          )}

          {!isDeleted && (
            <button
              className={styles.menuItem}
              role="menuitem"
              disabled={loading === "role"}
              onClick={() =>
                handleAction(
                  "role",
                  () => updateUserRoleAction(user.id, isAdmin ? "CUSTOMER" : "ADMIN"),
                  `Rol cambiado a ${isAdmin ? "Cliente" : "Admin"}`
                )
              }
            >
              <UserCheck size={16} aria-hidden="true" />
              {isAdmin ? "Quitar Admin" : "Hacer Admin"}
            </button>
          )}

          {!isDeleted && <div className={styles.menuDivider} />}

          {!isDeleted && (
            <button
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              role="menuitem"
              disabled={loading === "delete"}
              onClick={() =>
                handleAction("delete", () => deleteUserAction(user.id), `Usuario ${user.email} eliminado`)
              }
            >
              <Trash2 size={16} aria-hidden="true" />
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
