"use client";

import "@/features/auth/Auth.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordsMismatch) return;
    try {
      await register(email, password);
      router.push("/");
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">REGISTRARSE</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className="auth-input"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className="auth-input"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`auth-input ${passwordsMismatch ? "error" : ""}`}
              placeholder="Repetí tu contraseña"
              required
              minLength={6}
            />
            {passwordsMismatch && (
              <span className="auth-input-error">
                Las contraseñas no coinciden
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || passwordsMismatch}
            className="auth-btn"
          >
            {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="auth-link">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
