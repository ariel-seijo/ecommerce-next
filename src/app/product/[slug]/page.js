// src/app/product/[slug]/page.jsx

import { notFound } from "next/navigation";
import { ProductPage, getProductBySlug, getRelatedProducts } from "@/features/products";

export const dynamic = "force-dynamic";

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