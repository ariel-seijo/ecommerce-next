import "./globals.css";
import Navbar from "@/components/Navbar";
import { FiltersProvider } from "../features/filters/FiltersContext";
import { CartProvider } from "@/features/cart/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <FiltersProvider>{children}</FiltersProvider>
        </CartProvider>
      </body>
    </html>
  );
}