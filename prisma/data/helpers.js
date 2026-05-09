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

const COMPANY_PREFIX = "COMP";

const CATEGORY_CODES = {
    GPU: "GPU",
    CPU: "CPU",
    RAM: "RAM",
    STORAGE: "STO",
};

const BRAND_CODES = {
    NVIDIA: "NVD",
    AMD: "AMD",
    INTEL: "INL",
    CORSAIR: "COR",
    KINGSTON: "KNG",
    SEAGATE: "SEA",
    GENERIC: "GEN",
};

function getCategoryCode(categoryName) {
    const key = categoryName.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (CATEGORY_CODES[key]) return CATEGORY_CODES[key];
    return key.slice(0, 3).padEnd(3, "X");
}

function getBrandCode(brandName) {
    const key = brandName.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (BRAND_CODES[key]) return BRAND_CODES[key];
    return key.slice(0, 3).padEnd(3, "X");
}

function extractModel(title, category) {
    const t = title.toUpperCase();
    const cat = category.toUpperCase();

    if (cat === "GPU") {
        const rtx = t.match(/RTX\s*(\d{3,4})/);
        if (rtx) return rtx[1];
        const rx = t.match(/RX\s*(\d{4,5})/);
        if (rx) return rx[1];
        const gtx = t.match(/GTX\s*(\d{3,4})/);
        if (gtx) return gtx[1];
        const arc = t.match(/ARC\s*A?(\d{3,4})/);
        if (arc) return arc[1];
    }

    if (cat === "CPU") {
        const ryzen = t.match(/RYZEN\s*\d\s*(\d{4})/);
        if (ryzen) return ryzen[1];
        const intel = t.match(/(?:CORE\s*)?I[3579][-\s]*(\d{4,5})/);
        if (intel) return intel[1];
    }

    if (cat === "RAM") {
        const speed = t.match(/(\d{4})\s*MHZ/);
        if (speed) return speed[1];
        const ddr = t.match(/DDR(\d)[-\s]*(\d{4})/);
        if (ddr) return ddr[2];
    }

    if (cat === "STORAGE") {
        const ssdModel = t.match(/(NV\d+|SN\d+|A\d+|980\s*PRO|990\s*PRO|970\s*EVO)/);
        if (ssdModel) return ssdModel[0].replace(/\s/g, "");
        const tb = t.match(/(\d+)\s*TB/);
        if (tb) return tb[1] + "TB";
        const gb = t.match(/(\d+)\s*GB/);
        if (gb) return gb[1] + "GB";
    }

    const fallback = t.match(/(\d{3,4})/);
    if (fallback) return fallback[1].slice(0, 4);

    return "0M";
}

function generateSeedSku(title, brand, categoryName) {
    const catCode = getCategoryCode(categoryName);
    const brandCode = getBrandCode(brand);
    const model = extractModel(title, categoryName);
    const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `${COMPANY_PREFIX}-${catCode}-${brandCode}-${model}-${suffix}`;
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
        sku: generateSeedSku(product.title, brand, categoryName),
        rating: 4.5,
        sold: Math.floor(Math.random() * 250),
        featured: product.featured ?? false,
        active: true,
        categoryId,
    };
}