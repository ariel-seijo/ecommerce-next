import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Recuperar Contraseña - Acceso Clientes | ElectroShop",
};

export default function ForgotPasswordLayout({ children }) {
  return (
    <>
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
