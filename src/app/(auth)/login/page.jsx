"use client";

import "@/features/auth/Auth.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/");
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">LOGIN</h1>

        {error && (
          <div className="auth-error">
            {error.includes("incorrectos") && (
              <span>
                <strong>Email o contraseña incorrectos.</strong> Verificá tus
                datos e intentá de nuevo.
              </span>
            )}
            {!error.includes("incorrectos") && <span>{error}</span>}
          </div>
        )}

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
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="auth-link">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
