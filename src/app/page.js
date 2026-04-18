import { prisma } from "@/lib/prisma";
import ProductsWrapper from "../features/products/ProductsWrapper";
import Header from "../components/Header";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return (
    <>
      <Header />
      <ProductsWrapper products={products} />
    </>
  );
}