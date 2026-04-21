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


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={fuenteGamer.variable}>
        <CartProvider>
          <FiltersProvider>
            <Navbar />
            {children}
          </FiltersProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}