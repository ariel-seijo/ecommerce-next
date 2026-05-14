import "./globals.css";

import localFont from "next/font/local";

const fuenteGamer = localFont({
  src: "./fonts/cosmic-lager-regular.otf",
  variable: "--font-cosmic",
  display: "swap",
});

import { AuthProvider } from "@/features/auth";
import { ToastContainer } from "@/features/toast";
import { CartProvider } from "@/features/cart";

export const metadata = {
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={fuenteGamer.variable}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
