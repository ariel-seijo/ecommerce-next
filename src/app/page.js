import { prisma } from "@/lib/prisma";
import ProductsWrapper from "../features/products/ProductsWrapper";
import Slider from "@/components/Slider";
import SectionTitle from "@/components/SectionTitle";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      featured: true
    },
    take: 5,
    include: {
      category: true
    }
  })

  return (
    <>
      <main>
        <Slider />
        <section className="offers">
          <SectionTitle>Ofertas destacadas</SectionTitle>
          <ProductsWrapper products={products} />
        </section>
      </main>
    </>
  );
}