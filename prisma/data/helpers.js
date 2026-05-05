export function slugify(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function detectBrand(title, category) {
    const t = title.toLowerCase();

    if (t.includes("ryzen")) return "AMD";
    if (t.includes("intel")) return "Intel";
    if (t.includes("rtx")) return "NVIDIA";
    if (t.includes("rx")) return "AMD";

    if (category === "RAM") return "Corsair";
    if (category === "STORAGE") {
        if (t.includes("hdd")) return "Seagate";
        return "Kingston";
    }

    return "Generic";
}

export function buildProduct(product, categoryId, categoryName) {
    const slug = slugify(product.title);
    const brand = detectBrand(product.title, categoryName);

    return {
        title: product.title,
        slug,
        description: product.description || `${product.title} ideal para gaming y alto rendimiento.`,
        price: product.price,
        oldPrice: Math.round(product.price * 1.12),
        thumbnail: product.thumbnail,
        images: [product.thumbnail],
        stock: product.stock,
        brand,
        sku: `${categoryName}-${slug}`.toUpperCase(),
        rating: 4.5,
        sold: Math.floor(Math.random() * 250),
        featured: product.featured ?? false,
        active: true,
        categoryId,
    };
}