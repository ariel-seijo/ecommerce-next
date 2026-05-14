import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getProductBySlug = (slug) =>
    unstable_cache(
        async () =>
            prisma.product.findUnique({
                where: {
                    slug,
                },
                include: {
                    category: true,
                    imagesRel: {
                        orderBy: { sortOrder: "asc" },
                    },
                },
            }),
        ["product", slug],
        { revalidate: 60, tags: [`product-${slug}`] }
    )();

export const getRelatedProducts = (categoryId, excludeId) =>
    unstable_cache(
        async () =>
            prisma.product.findMany({
                where: {
                    categoryId,
                    id: {
                        not: excludeId,
                    },
                    active: true,
                },
                take: 4,
            }),
        ["related", categoryId, excludeId],
        { revalidate: 120 }
    )();
