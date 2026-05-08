"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { useToastStore } from "@/features/toast";
import MyOrders from "@/features/orders/components/MyOrders";
import {
  User,
  Package,
  LogOut,
  Pencil,
  Check,
  X,
  AlertTriangle,
  Shield,
  ShoppingBag,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const { user, setUser, updateUser, logout } = useAuthStore();
  const toast = useToastStore((s) => s.toast);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("info");

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const displayName =
    user?.name || user?.email?.split("@")[0] || "Usuario";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const roleLabel = user?.role === "ADMIN" ? "Administrador" : "Cliente";

  const handleEditClick = () => {
    setNameInput(user?.name || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNameInput("");
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user/name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      updateUser({ name: data.user.name });
      toast("Nombre actualizado exitosamente", "success");
      setIsEditing(false);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setDeleteInput("");
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteInput("");
  };

  const handleConfirmDelete = async () => {
    if (deleteInput !== "ELIMINAR") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      setUser(null);
      toast("Cuenta eliminada exitosamente", "success");
      router.push("/");
    } catch (err) {
      toast(err.message, "error");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");
      toast("Contraseña actualizada exitosamente", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast("Sesión cerrada exitosamente", "success");
    router.push("/");
  };

  return (
    <div className={styles.dashboard}>
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "info" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <User size={18} />
          <span>Mi Información</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === "orders" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <Package size={18} />
          <span>Mis Pedidos</span>
        </button>
      </nav>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarUser}>
          <div className={styles.sidebarAvatar}>
            {user?.role === "ADMIN" ? (
              <Shield size={36} />
            ) : (
              <User size={36} />
            )}
          </div>
          <span className={styles.sidebarName}>{displayName}</span>
          <span className={styles.sidebarEmail}>{user?.email}</span>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.sidebarLink} ${activeTab === "info" ? styles.sidebarLinkActive : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <User size={18} />
            Mi Información
          </button>
          <button
            className={`${styles.sidebarLink} ${activeTab === "orders" ? styles.sidebarLinkActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <Package size={18} />
            Mis Pedidos
          </button>
        </nav>

        <button onClick={handleLogout} className={styles.sidebarLogout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </aside>

      <main className={styles.content}>
        {activeTab === "info" && (
          <div className={styles.section}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Información de la Cuenta</h2>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className={styles.editBtn}
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                )}
              </div>

              <div className={styles.fields}>
                <div className={styles.field}>
                  <span className={styles.label}>Nombre</span>
                  {isEditing ? (
                    <div className={styles.editRow}>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className={styles.input}
                        placeholder="Tu nombre"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={handleSaveName}
                        className={styles.saveBtn}
                        disabled={saving || !nameInput.trim()}
                      >
                        {saving ? (
                          <div className={styles.spinnerSmall} />
                        ) : (
                          <Check size={16} />
                        )}
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={styles.cancelBtn}
                        disabled={saving}
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <span className={styles.value}>{displayName}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Correo Electrónico</span>
                  <span className={styles.value}>{user?.email || "—"}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Rol</span>
                  <span className={styles.value}>{roleLabel}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Miembro desde</span>
                  <span className={styles.value}>{memberSince}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.passwordTitleRow}>
                  <Lock size={18} />
                  <h2 className={styles.cardTitle}>Cambiar Contraseña</h2>
                </div>
              </div>

              <div className={styles.passwordFields}>
                <div className={styles.passwordField}>
                  <span className={styles.label}>Contraseña Actual</span>
                  <div className={styles.passwordInputWrap}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={styles.passwordInput}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className={styles.revealBtn}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      tabIndex={-1}
                      aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.passwordField}>
                  <span className={styles.label}>Nueva Contraseña</span>
                  <div className={styles.passwordInputWrap}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.passwordInput}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      className={styles.revealBtn}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.passwordField}>
                  <span className={styles.label}>Confirmar Nueva Contraseña</span>
                  <div className={styles.passwordInputWrap}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.passwordInput}
                      placeholder="Repetí la nueva contraseña"
                    />
                    <button
                      type="button"
                      className={styles.revealBtn}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className={styles.passwordError}>{passwordError}</div>
              )}

              <button
                onClick={handleChangePassword}
                className={styles.passwordSaveBtn}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {changingPassword ? (
                  <div className={styles.spinnerSmall} />
                ) : (
                  <Lock size={16} />
                )}
                Cambiar Contraseña
              </button>
            </div>

            <div className={styles.divider} />

            <button onClick={handleDeleteClick} className={styles.deleteBtn}>
              <AlertTriangle size={16} />
              Eliminar Cuenta
            </button>

            {showDeleteConfirm && (
              <div
                className={styles.overlay}
                onClick={deleting ? undefined : handleCancelDelete}
              >
                <div
                  className={styles.confirmModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.confirmIconWrap}>
                    <AlertTriangle size={32} className={styles.confirmIcon} />
                  </div>
                  <h3 className={styles.confirmTitle}>¿Estás seguro?</h3>
                  <p className={styles.confirmText}>
                    Esta acción es permanente y todos tus datos serán perdidos.
                    Para confirmar, escribí <strong>ELIMINAR</strong>.
                  </p>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                    className={styles.confirmInput}
                    placeholder="ELIMINAR"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && deleteInput.toUpperCase() === "ELIMINAR") {
                        handleConfirmDelete();
                      }
                    }}
                  />
                  <div className={styles.confirmActions}>
                    <button
                      onClick={handleCancelDelete}
                      className={styles.confirmCancel}
                      disabled={deleting}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className={styles.confirmDelete}
                      disabled={deleteInput !== "ELIMINAR" || deleting}
                    >
                      {deleting ? (
                        <div className={styles.spinnerSmall} />
                      ) : (
                        <AlertTriangle size={16} />
                      )}
                      Eliminar Cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles.section}>
            <div className={styles.card}>
              <div className={styles.ordersHeader}>
                <ShoppingBag size={20} />
                <h2 className={styles.cardTitle}>Mis Pedidos</h2>
              </div>
              <MyOrders embedded />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
