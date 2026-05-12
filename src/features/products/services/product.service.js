import { prisma } from "@/lib/prisma";
import { generateSku as generateSkuLib } from "@/lib/sku";
import { deleteAsset } from "@/lib/cloudinary";

const VALID_SORT_FIELDS = ["price", "stock", "sold", "createdAt"];

/**
 * Fetches a paginated, filtered, and sorted list of products.
 *
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10] - Max 50
 * @param {string} [params.search] - Searches title, SKU, and brand (case-insensitive)
 * @param {number|string} [params.categoryId]
 * @param {'active'|'inactive'|'all'} [params.status]
 * @param {boolean} [params.featured]
 * @param {'price'|'stock'|'sold'|'createdAt'} [params.sort]
 * @param {'asc'|'desc'} [params.order]
 * @returns {Promise<{ products: Array, total: number, page: number, totalPages: number }>}
 */
export async function getAllProducts(params = {}) {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(params.limit) || 10));
  const skip = (page - 1) * limit;

  const where = {};

  if (params.categoryId) {
    where.categoryId = parseInt(params.categoryId);
  }

  if (params.status === "active") {
    where.active = true;
  } else if (params.status === "inactive") {
    where.active = false;
  }

  if (params.featured === true || params.featured === "true") {
    where.featured = true;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { sku: { contains: params.search, mode: "insensitive" } },
      { brand: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const orderBy = {};
  if (VALID_SORT_FIELDS.includes(params.sort)) {
    orderBy[params.sort] = params.order === "asc" ? "asc" : "desc";
  } else {
    orderBy.createdAt = "desc";
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        imagesRel: {
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetches a single product by its numeric ID.
 *
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      imagesRel: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

/**
 * Creates a new product with optional auto-generated SKU inside a transaction.
 *
 * @param {object} data
 * @param {string} data.title
 * @param {string} data.slug
 * @param {string} [data.description]
 * @param {number} data.price
 * @param {number|null} [data.oldPrice]
 * @param {number} data.stock
 * @param {string} [data.brand]
 * @param {number} data.categoryId
 * @param {string} data.thumbnail
 * @param {string[]} [data.images]
 * @param {number} [data.rating]
 * @param {number} [data.sold]
 * @param {boolean} [data.featured]
 * @param {boolean} [data.active]
 * @param {string} [data.sku]
 * @returns {Promise<object>}
 */
export async function createProduct(data) {
  const {
    title,
    slug,
    description,
    price,
    oldPrice,
    stock,
    brand,
    categoryId,
    thumbnail,
    images,
    rating,
    sold,
    featured,
    active,
    sku,
  } = data;

  if (!title || !slug || price === undefined || stock === undefined || !categoryId || !thumbnail) {
    throw new Error("Missing required fields");
  }

  if (parseFloat(price) <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (parseInt(stock) < 0) {
    throw new Error("Stock must be at least 0");
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
    select: { name: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const existingSlug = await prisma.product.findUnique({ where: { slug } });
  if (existingSlug) {
    throw new Error("Slug already exists");
  }

  if (sku) {
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      throw new Error("SKU already exists");
    }
  }

  const product = await prisma.$transaction(async (tx) => {
    const generatedSku = sku || await generateSkuLib(
      {
        title,
        brand: brand || "Generic",
        categoryName: category.name,
      },
      tx
    );

    return tx.product.create({
      data: {
        title,
        slug,
        description: description || "",
        price: parseFloat(price),
        oldPrice: oldPrice != null ? parseFloat(oldPrice) : null,
        stock: parseInt(stock),
        brand: brand || "Generic",
        sku: generatedSku,
        categoryId: parseInt(categoryId),
        thumbnail,
        images: images || [],
        rating: parseFloat(rating) || 0,
        sold: parseInt(sold) || 0,
        featured: featured === true || featured === "true",
        active: active !== false && active !== "false",
      },
    });
  });

  return product;
}

/**
 * Updates an existing product. Only provided fields are updated.
 *
 * @param {number} id
 * @param {object} data - Same shape as createProduct (all fields optional)
 * @returns {Promise<object>}
 */
export async function updateProduct(id, data) {
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Product not found");
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (slugExists) {
      throw new Error("Slug already exists");
    }
  }

  if (data.price !== undefined && parseFloat(data.price) <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (data.stock !== undefined && parseInt(data.stock) < 0) {
    throw new Error("Stock must be at least 0");
  }

  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.oldPrice !== undefined) updateData.oldPrice = data.oldPrice != null ? parseFloat(data.oldPrice) : null;
  if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
  if (data.brand !== undefined) updateData.brand = data.brand;
  if (data.categoryId !== undefined) updateData.categoryId = parseInt(data.categoryId);
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.images !== undefined) updateData.images = data.images;
  if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
  if (data.sold !== undefined) updateData.sold = parseInt(data.sold);
  if (data.featured !== undefined) updateData.featured = data.featured === true || data.featured === "true";
  if (data.active !== undefined) updateData.active = data.active === true || data.active === "true";
  if (data.sku !== undefined) {
    const skuExists = await prisma.product.findFirst({
      where: { sku: data.sku, id: { not: id } },
    });
    if (skuExists) {
      throw new Error("SKU already exists");
    }
    updateData.sku = data.sku;
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      imagesRel: true,
    },
  });

  return product;
}

/**
 * Hard-deletes a product and attempts to clean up associated Cloudinary assets.
 * Cloudinary cleanup is best-effort — failures are logged but do not block deletion.
 *
 * @param {number} id
 * @returns {Promise<object>} The deleted product
 */
export async function deleteProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      imagesRel: { select: { publicId: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  for (const image of product.imagesRel) {
    try {
      await deleteAsset(image.publicId);
    } catch (err) {
      console.error(`[CLOUDINARY CLEANUP] Failed to delete ${image.publicId}:`, err);
    }
  }

  await prisma.product.delete({ where: { id } });

  return product;
}

/**
 * Toggles the active status of a product (soft-delete / enable).
 *
 * @param {number} id
 * @param {boolean} active
 * @returns {Promise<object>}
 */
export async function toggleProductStatus(id, active) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: { active },
    include: {
      category: true,
      imagesRel: true,
    },
  });
}

/**
 * Toggles the featured flag of a product.
 *
 * @param {number} id
 * @param {boolean} featured
 * @returns {Promise<object>}
 */
export async function toggleProductFeatured(id, featured) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: { featured },
    include: {
      category: true,
      imagesRel: true,
    },
  });
}

/**
 * Atomically updates only the stock field of a product.
 *
 * @param {number} id
 * @param {number} stock - Must be >= 0
 * @returns {Promise<object>}
 */
export async function updateProductStock(id, stock) {
  const parsed = parseInt(stock);

  if (isNaN(parsed) || parsed < 0) {
    throw new Error("Stock must be a non-negative integer");
  }

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: { stock: parsed },
    select: {
      id: true,
      stock: true,
      updatedAt: true,
    },
  });
}

/**
 * Generates a preview SKU without performing a DB write.
 * For the final/atomic SKU, use createProduct() which handles it in a transaction.
 *
 * @param {number|string} categoryId
 * @param {string} brand
 * @param {string} title
 * @returns {Promise<string>}
 */
export async function generateSku(categoryId, brand, title) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
    select: { name: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const sku = await generateSkuLib({
    title,
    brand: brand || "Generic",
    categoryName: category.name,
  });

  return sku;
}
