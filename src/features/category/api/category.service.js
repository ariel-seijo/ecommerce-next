import { prisma } from "@/lib/prisma";
import { arsToUsd, usdToArs } from "@/lib/utils/currency";

export async function getCategoryProducts({
    categoryName,
    sort,
    brand,
    min,
    max,
    page = 1,
    limit = 9,
}) {
    const pageNum = Math.max(1, Number(page));
    const skip = (pageNum - 1) * limit;

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
            where.price.gte = arsToUsd(Number(min));
        }

        if (max) {
            where.price.lte = arsToUsd(Number(max));
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

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy,
            skip,
            take: limit,
        }),
        prisma.product.count({ where }),
    ]);

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
            usdToArs(priceData._min.price || 0)
        ),
        maxPrice: Math.ceil(
            usdToArs(priceData._max.price || 0)
        ),
        page: pageNum,
        totalPages: Math.ceil(total / limit),
        total,
    };
}
