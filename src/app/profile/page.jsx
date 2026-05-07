"use client";

import styles from "./Profile.module.css";
import { useAuthStore } from "@/features/auth";
import { useToastStore } from "@/features/toast";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const toast = useToastStore((s) => s.toast);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast("Sesión cerrada exitosamente", "success");
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span>ELECTROSHOP</span>
        </div>

        <h1 className={styles.title}>MI PERFIL</h1>

        <div className={styles.avatar}>
          <User size={40} />
        </div>

        <div className={styles.info}>
          <div className={styles.field}>
            <span className={styles.label}>Nombre</span>
            <span className={styles.value}>
              {user?.name || "—"}
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Correo</span>
            <span className={styles.value}>{user?.email}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Rol</span>
            <span className={styles.value}>
              {user?.role === "ADMIN" ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}
