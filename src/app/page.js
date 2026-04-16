import { prisma } from "@/lib/prisma";
import ProductsWrapper from "@/components/ProductsWrapper";
import Header from "@/components/Header";
import { Cart } from "@/components/Cart";
import { CartProvider } from "@/context/CartContext";
import { FiltersProvider } from "@/context/FiltersContext";

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