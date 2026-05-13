import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Crear Cuenta - Acceso Clientes | ElectroShop",
};

export default function RegisterLayout({ children }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<div className="auth-page"><div className="auth-card" /></div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
