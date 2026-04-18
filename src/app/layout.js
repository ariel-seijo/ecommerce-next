import "./globals.css";
import Navbar from "@/components/Navbar";

import { FiltersProvider } from "@/features/filters/FiltersContext";
import { CartProvider } from "@/features/cart/CartContext";
import { Cart } from "@/features/cart/Cart";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FiltersProvider>
            <Navbar />
            <Cart />
            {children}
          </FiltersProvider>
        </CartProvider>
      </body>
    </html>
  );
}