import { notFound } from "next/navigation";
import ProductPage from "@/components/product/ProductPage";

import {
    getProductBySlug,
    getRelatedProducts,
} from "@/features/products/product.service";

export default async function Page({ params }) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    const relatedProducts = await getRelatedProducts(
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