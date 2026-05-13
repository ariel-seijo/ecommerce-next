"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, ShieldBan, ShieldCheck, UserCheck, Trash2, MoreVertical } from "lucide-react";
import {
  toggleUserStatusAction,
  updateUserRoleAction,
  deleteUserAction,
} from "@/features/admin/actions/userActions";
import { useToastStore } from "@/features/toast";
import ConfirmModal from "@/features/admin/components/ConfirmModal";
import styles from "./UserActions.module.css";

function ConfirmationModal({ confirm, onConfirm, onCancel }) {
  if (!confirm) return null;

  const { action, user } = confirm;
  const isBanned = user.status === "BANNED";
  const isAdmin = user.role === "ADMIN";

  switch (action) {
    case "delete":
      return (
        <ConfirmModal
          isOpen
          title="Eliminar usuario"
          message={`¿Eliminar a "${user.email}"?\nEsta acción anonimiza sus datos pero conserva el historial de compras.`}
          onConfirm={onConfirm}
          onCancel={onCancel}
          isConfirming={false}
          confirmLabel="Eliminar"
          variant="danger"
        />
      );
    case "status":
      return (
        <ConfirmModal
          isOpen
          title={isBanned ? "Reactivar usuario" : "Banear usuario"}
          message={
            isBanned
              ? `¿Reactivar a "${user.email}"? Podrá volver a iniciar sesión y comprar.`
              : `¿Banear a "${user.email}"? No podrá iniciar sesión ni realizar compras.`
          }
          onConfirm={onConfirm}
          onCancel={onCancel}
          isConfirming={false}
          confirmLabel={isBanned ? "Reactivar" : "Banear"}
          variant={isBanned ? "primary" : "danger"}
        />
      );
    case "role":
      return (
        <ConfirmModal
          isOpen
          title="Cambiar rol"
          message={
            isAdmin
              ? `¿Quitar permisos de administrador a "${user.email}"? Pasará a ser Cliente.`
              : `¿Convertir a "${user.email}" en Administrador? Tendrá acceso completo al panel.`
          }
          onConfirm={onConfirm}
          onCancel={onCancel}
          isConfirming={false}
          confirmLabel={isAdmin ? "Quitar Admin" : "Hacer Admin"}
          variant="primary"
        />
      );
    default:
      return null;
  }
}

export default function UserActions({ user, onViewOrders }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [flipUp, setFlipUp] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const toast = useToastStore((s) => s.toast);

  function toggleMenu() {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setFlipUp(spaceBelow < 220);
    }
    setIsOpen((prev) => !prev);
  }

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

  function handleActionClick(actionType) {
    closeMenu();
    setConfirm({ action: actionType, user });
  }

  function handleConfirmCancel() {
    setConfirm(null);
  }

  async function handleConfirmExecute() {
    if (!confirm) return;
    const { action } = confirm;
    setLoading(action);

    let result;
    switch (action) {
      case "delete":
        result = await deleteUserAction(user.id);
        break;
      case "status":
        result = await toggleUserStatusAction(user.id);
        break;
      case "role":
        result = await updateUserRoleAction(
          user.id,
          user.role === "ADMIN" ? "CUSTOMER" : "ADMIN"
        );
        break;
      default:
        result = { error: "Acción desconocida" };
    }

    setLoading(null);
    setConfirm(null);

    if (result.error) {
      toast(result.error, "error");
    } else {
      const msgs = {
        delete: `Usuario ${user.email} eliminado`,
        status:
          user.status === "BANNED"
            ? `Usuario ${user.email} reactivado`
            : `Usuario ${user.email} baneado`,
        role: `Rol actualizado`,
      };
      toast(msgs[action], "success");
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
        onClick={toggleMenu}
        aria-label={`Acciones para ${user.email}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <div ref={menuRef} className={`${styles.menu} ${flipUp ? styles.menuUp : ""}`} role="menu">
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
              onClick={() => handleActionClick("status")}
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
              onClick={() => handleActionClick("role")}
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
              onClick={() => handleActionClick("delete")}
            >
              <Trash2 size={16} aria-hidden="true" />
              Eliminar
            </button>
          )}
        </div>
      )}

      <ConfirmationModal
        confirm={confirm}
        onConfirm={handleConfirmExecute}
        onCancel={handleConfirmCancel}
      />
    </div>
  );
}
