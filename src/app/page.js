import { prisma } from "@/lib/prisma";
import ProductsWrapper from "../features/products/ProductsWrapper";
import Header from "../components/Header";
import { Cart } from "../features/cart/Cart";
import { CartProvider } from "../features/cart/CartContext";
import { FiltersProvider } from "../features/filters/FiltersContext";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return (
    <CartProvider>
      <FiltersProvider>
        <Header />
        <Cart />
        <ProductsWrapper products={products} />
      </FiltersProvider>
    </CartProvider>
  );
}