import { prisma } from "@/lib/prisma";
import ProductsWrapper from "@/features/products/ProductsWrapper";
import SectionTitle from "@/components/SectionTitle";

export default async function CategoryPage({ params }) {
  const { name } = await params;

  const categoryName = name.toUpperCase();

  const products = await prisma.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
    },
    include: {
      category: true,
    },
  });

  return (
    <main>
      <section className="offers">
        <SectionTitle>{categoryName}</SectionTitle>
        <ProductsWrapper products={products} />
      </section>
    </main>
  );
}
