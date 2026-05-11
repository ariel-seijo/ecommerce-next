import { Suspense } from "react";

export const metadata = {
  title: "Crear Cuenta - Acceso Clientes | ElectroShop",
};

export default function RegisterLayout({ children }) {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card" /></div>}>
      {children}
    </Suspense>
  );
}
