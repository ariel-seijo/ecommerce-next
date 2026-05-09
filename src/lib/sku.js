import { prisma } from "@/lib/prisma";

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

/**
 * Maps a category name to its 3-char code.
 * Falls back to first 3 chars uppercased, X-padded if needed.
 */
export function getCategoryCode(categoryName) {
  const key = categoryName.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (CATEGORY_CODES[key]) return CATEGORY_CODES[key];
  return key.slice(0, 3).padEnd(3, "X");
}

/**
 * Maps a brand name to its 3-char code.
 * Falls back to first 3 chars uppercased, X-padded if needed.
 */
export function getBrandCode(brandName) {
  const key = brandName.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (BRAND_CODES[key]) return BRAND_CODES[key];
  return key.slice(0, 3).padEnd(3, "X");
}

/**
 * Extracts the model identifier from a product title.
 * Returns up to 4 uppercase alphanumeric chars. Falls back to "0M" if nothing found.
 */
export function extractModel(title, category) {
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

/**
 * Generates a unique, compact SKU.
 *
 * Format: COMP-{CAT}-{BRD}-{MODEL}-{SEQ}
 *
 * @param {object} params
 * @param {string} params.title - Product title
 * @param {string} params.brand - Product brand (e.g., "NVIDIA", "Corsair")
 * @param {string} params.categoryName - Category name (e.g., "GPU", "CPU")
 * @param {object} [tx] - Optional Prisma transaction client
 * @returns {Promise<string>} Generated SKU
 */
export async function generateSku({ title, brand, categoryName }, tx) {
  const db = tx || prisma;
  const catCode = getCategoryCode(categoryName);
  const brandCode = getBrandCode(brand);
  const model = extractModel(title, categoryName);
  const prefix = `${COMPANY_PREFIX}-${catCode}-${brandCode}-${model}-`;

  const last = await db.product.findFirst({
    where: { sku: { startsWith: prefix } },
    orderBy: { sku: "desc" },
    select: { sku: true },
  });

  if (!last) return `${prefix}001`;

  const lastNumber = parseInt(last.sku.split("-").pop(), 10);
  const next = isNaN(lastNumber) ? 1 : lastNumber + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

/**
 * Synchronous SKU generator for seed data (random suffix, no DB lookup).
 * DO NOT use in production — use generateSku() instead.
 */
export function generateSeedSku(title, brand, categoryName) {
  const catCode = getCategoryCode(categoryName);
  const brandCode = getBrandCode(brand);
  const model = extractModel(title, categoryName);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${COMPANY_PREFIX}-${catCode}-${brandCode}-${model}-${suffix}`;
}
