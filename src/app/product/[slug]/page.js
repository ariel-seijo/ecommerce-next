// src/app/product/[slug]/page.jsx

import { notFound } from "next/navigation";
import { ProductPage, getProductBySlug, getRelatedProducts } from "@/features/products";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "\u2026";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!product) return { title: "Producto no encontrado | ElectroShop" };

  const truncated = truncate(product.title, 29);
  return {
    title: `${truncated} - Hardware Gamer | ElectroShop`,
  };
}

export default async function Page({
    params,
}) {
    const { slug } = await params;

    const product =
        await getProductBySlug(slug);

    if (!product) notFound();

    const relatedProducts =
        await getRelatedProducts(
            product.categoryId,
            product.id
        );

    return (
        <ProductPage
            product={product}
            relatedProducts={relatedProducts}
        />
    );
}