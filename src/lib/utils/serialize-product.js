/**
 * Strips non-essential fields from a Prisma Product before passing it
 * across the RSC → Client boundary. Reduces the serialized HTML payload.
 *
 * Fields kept: everything the storefront client components render.
 * Fields dropped: heavy arrays (images[]), timestamps, relations (cartItems, orderItems).
 */
export function serializeProductForClient(product) {
  if (!product) return product;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    thumbnail: product.thumbnail,
    stock: product.stock,
    brand: product.brand,
    sku: product.sku,
    rating: product.rating,
    sold: product.sold,
    featured: product.featured,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : null,
    imagesRel: Array.isArray(product.imagesRel)
      ? product.imagesRel.map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          format: img.format,
          blurDataURL: img.blurDataURL,
        }))
      : undefined,
  };
}

export function serializeProductsForClient(products) {
  if (!Array.isArray(products)) return products;
  return products.map(serializeProductForClient);
}
