"use client";

import { useState } from "react";
import { Settings, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToastStore } from "@/features/toast";

export default function SettingsPage() {
  const toast = useToastStore((s) => s.toast);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

  return (
    <div>
      <h2 className="admin-card-title admin-card-title-with-icon page-title-spacing">
        <Settings size={20} color="var(--admin-primary-glow)" aria-hidden="true" />
        Ajustes
      </h2>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title-with-icon">
            <Lock size={16} color="var(--admin-primary-glow)" aria-hidden="true" />
            <h3 className="admin-card-title">Cambiar Contraseña</h3>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentPassword">
            Contraseña Actual
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                position: "absolute",
                right: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--admin-muted)",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">
            Nueva Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                right: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--admin-muted)",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirmar Nueva Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Repetí la nueva contraseña"
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--admin-muted)",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {passwordError && (
          <div className="form-error" role="alert">
            {passwordError}
          </div>
        )}

        <div style={{ paddingTop: "8px" }}>
          <button
            onClick={handleChangePassword}
            className="btn btn-primary"
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
          >
            {changingPassword ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} aria-hidden="true" />
            ) : (
              <Lock size={16} />
            )}
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}
