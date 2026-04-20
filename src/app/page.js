import { prisma } from "@/lib/prisma";
import ProductsWrapper from "@/features/products/ProductsWrapper";
import Slider from "@/components/Slider";
import SectionTitle from "@/components/SectionTitle";
import Brands from "@/components/Brands";

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
        <section className="featured">
          <SectionTitle>PRODUCTOS DESTACADOS</SectionTitle>
          <ProductsWrapper products={products} />
        </section>
        <section className="brands">
          <SectionTitle>MARCAS QUE TRABAJAMOS</SectionTitle>
          <Brands />
        </section>
      </main>
    </>
  );
}