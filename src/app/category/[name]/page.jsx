import { prisma } from "@/lib/prisma";
import ProductsWrapper from "@/features/products/ProductsWrapper";
import SectionTitle from "@/components/SectionTitle";
import Link from "next/link";

export default async function CategoryPage({ params, searchParams }) {
  const { name } = await params;
  const { sort } = await searchParams;

  const categoryName = name.toUpperCase();

  const order = sort === "desc" ? { price: "desc" } : { price: "asc" };

  const products = await prisma.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
    },
    orderBy: order,
    include: {
      category: true,
    },
  });

  return (
    <main>
      <section className="offers">
        <SectionTitle>{categoryName}</SectionTitle>

        <div className="sort-buttons">
          <Link href={`/category/${name}?sort=asc`}>Menor precio</Link>

          <Link href={`/category/${name}?sort=desc`}>Mayor precio</Link>
        </div>

        <ProductsWrapper products={products} />
      </section>
    </main>
  );
}
