import { prisma } from "@/lib/prisma";

export async function getCategoryProducts({
    categoryName,
    sort,
    brand,
    min,
    max,
}) {
    const where = {
        category: {
            name: categoryName,
        },
        active: true,
    };

    if (brand) {
        where.brand = brand;
    }

    if (min || max) {
        where.price = {};

        if (min) {
            where.price.gte =
                Number(min);
        }

        if (max) {
            where.price.lte =
                Number(max);
        }
    }

    let orderBy = {
        createdAt: "desc",
    };

    if (sort === "popular") {
        orderBy = { sold: "desc" };
    }

    if (sort === "rating") {
        orderBy = { rating: "desc" };
    }

    if (sort === "asc") {
        orderBy = { price: "asc" };
    }

    if (sort === "desc") {
        orderBy = { price: "desc" };
    }

    const products =
        await prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy,
        });

    const brands =
        await prisma.product.groupBy({
            by: ["brand"],
            where: {
                category: {
                    name: categoryName,
                },
                active: true,
            },
            _count: true,
            orderBy: {
                brand: "asc",
            },
        });

    const rangeWhere = {
        category: {
            name: categoryName,
        },
        active: true,
    };

    if (brand) {
        rangeWhere.brand = brand;
    }

    const priceData =
        await prisma.product.aggregate({
            where: rangeWhere,
            _min: {
                price: true,
            },
            _max: {
                price: true,
            },
        });

    return {
        products,
        brands,
        minPrice: Math.floor(
            priceData._min.price || 0
        ),
        maxPrice: Math.ceil(
            priceData._max.price || 0
        ),
    };
}