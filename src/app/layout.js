import "./globals.css";

import localFont from "next/font/local";

const fuenteGamer = localFont({
  src: "./fonts/cosmic-lager-regular.otf",
  variable: "--font-cosmic",
  display: "swap",
});

import { Suspense } from "react";
import ScrollToTop from "./ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { CartProvider } from "@/features/cart";
import { AuthProvider } from "@/features/auth";
import { ToastContainer } from "@/features/toast";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={fuenteGamer.variable}>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              <Suspense fallback={null}>
                <ScrollToTop />
              </Suspense>
              {children}
            </main>
            <ToastContainer />
          </CartProvider>
        </AuthProvider>

        <Footer />
      </body>
    </html>
  );
}
