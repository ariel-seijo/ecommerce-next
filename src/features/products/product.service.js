import { prisma } from "@/lib/prisma";

export async function getProductBySlug(slug) {
    return await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,
        },
    });
}

export async function getRelatedProducts(categoryId, productId) {
    return await prisma.product.findMany({
        where: {
            categoryId,
            id: {
                not: productId,
            },
            active: true,
        },
        take: 4,
    });
}