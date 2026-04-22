import { prisma } from "@/lib/prisma";

export async function getCategoryProducts({
    categoryName,
    sort = "recent",
    brand = "",
    price = "",
}) {
    let orderBy = { createdAt: "desc" };

    if (sort === "asc") orderBy = { price: "asc" };
    if (sort === "desc") orderBy = { price: "desc" };
    if (sort === "popular") orderBy = { sold: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    let priceFilter = {};

    if (price === "1") {
        priceFilter = {
            price: { lte: 100 },
        };
    }

    if (price === "2") {
        priceFilter = {
            price: { gt: 100, lte: 300 },
        };
    }

    if (price === "3") {
        priceFilter = {
            price: { gt: 300 },
        };
    }

    const where = {
        active: true,
        category: {
            name: categoryName,
        },
        ...(brand && { brand }),
        ...priceFilter,
    };

    const [products, brands] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy,
        }),

        prisma.product.findMany({
            where: {
                active: true,
                category: {
                    name: categoryName,
                },
            },
            select: {
                brand: true,
            },
            distinct: ["brand"],
            orderBy: {
                brand: "asc",
            },
        }),
    ]);

    return {
        products,
        brands,
    };
}
