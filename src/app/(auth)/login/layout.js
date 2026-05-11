import { Suspense } from "react";

export const metadata = {
  title: "Iniciar Sesión - Acceso Clientes | ElectroShop",
};

export default function LoginLayout({ children }) {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card" /></div>}>
      {children}
    </Suspense>
  );
}
