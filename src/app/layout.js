import "./globals.css";

import localFont from "next/font/local";

const fuenteGamer = localFont({
  src: "./fonts/cosmic-lager-regular.otf",
  variable: "--font-cosmic",
  display: "swap",
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { FiltersProvider } from "@/features/filters/FiltersContext";
import { CartProvider } from "@/features/cart/CartContext";
import { AuthProvider } from "@/features/auth/AuthProvider";

import { prisma } from "@/lib/prisma";

export default async function RootLayout({ children }) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
      price: true,
    },
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <html lang="es">
      <body className={fuenteGamer.variable}>
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>

        <AuthProvider>
          <CartProvider>
            <FiltersProvider>
              <Navbar products={products} />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </FiltersProvider>
          </CartProvider>
        </AuthProvider>

        <Footer />
      </body>
    </html>
  );
}
