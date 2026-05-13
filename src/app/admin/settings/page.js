import { Settings } from "lucide-react";

export const metadata = {
  title: "Ajustes | Panel de Administración",
  description: "Configuración del sistema — ElectroShop Admin",
};

export default function SettingsPage() {
  return (
    <div>
      <h2 className="admin-card-title admin-card-title-with-icon page-title-spacing">
        <Settings size={20} color="var(--admin-primary-glow)" aria-hidden="true" />
        Ajustes
      </h2>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Configuración general</h3>
        </div>
        <p style={{ color: "var(--admin-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
          La configuración del sistema estará disponible próximamente.
          Desde aquí podrás gestionar opciones de la tienda, métodos de pago, envíos y más.
        </p>
      </div>
    </div>
  );
}
