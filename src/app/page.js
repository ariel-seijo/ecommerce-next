import { prisma } from "@/lib/prisma";
import { FeaturedCarousel } from "@/features/products";
import Slider from "@/components/Slider";
import SectionTitle from "@/components/SectionTitle";
import Brands from "@/components/Brands";
import PromoBanner from "@/components/PromoBanner";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    take: 8,
    include: {
      category: true,
    },
  });

  return (
    <>
      <Slider />
      <section className="featured">
        <SectionTitle>PRODUCTOS DESTACADOS</SectionTitle>
        <FeaturedCarousel products={products} />
      </section>
      <PromoBanner />
      <section className="brands">
        <SectionTitle>MARCAS QUE TRABAJAMOS</SectionTitle>
        <Brands />
      </section>
    </>
  );
}
