"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

/**
 * Merges a guest cart (from localStorage) into the user's permanent DB cart.
 * Uses Prisma $transaction for atomicity — entire merge succeeds or rolls back.
 * Caps each item at Product.stock; skips inactive products and zero-stock items.
 *
 * @param {Array<{productId: number, quantity: number}>} items
 * @returns {Promise<Array>} The full synced cart with product data included
 */
export async function syncCart(items) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId) {
    throw new Error("Not authenticated");
  }

  const userId = session.userId;

  return prisma.$transaction(async (tx) => {
    // Step 1 — Fetch current stock + active status for all involved products
    const productIds = items.map((i) => i.productId);

    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, active: true },
    });

    const stockMap = new Map(
      products.map((p) => [p.id, { stock: p.stock, active: p.active }])
    );

    // Step 2 — Fetch existing DB cart items for this user
    const existing = await tx.cartItem.findMany({
      where: { userId, productId: { in: productIds } },
    });

    const existingMap = new Map(
      existing.map((e) => [e.productId, e.quantity])
    );

    // Step 3 — Merge: sum guest quantity + existing DB quantity, cap at stock
    for (const item of items) {
      const product = stockMap.get(item.productId);

      // Product doesn't exist, is inactive, or has no stock — remove from cart
      if (!product || !product.active || product.stock <= 0) {
        await tx.cartItem.deleteMany({
          where: { userId, productId: item.productId },
        });
        continue;
      }

      const existingQty = existingMap.get(item.productId) ?? 0;
      const requestedTotal = existingQty + item.quantity;
      const finalQty = Math.min(requestedTotal, product.stock);

      if (finalQty <= 0) {
        await tx.cartItem.deleteMany({
          where: { userId, productId: item.productId },
        });
        continue;
      }

      await tx.cartItem.upsert({
        where: {
          userId_productId: { userId, productId: item.productId },
        },
        create: {
          userId,
          productId: item.productId,
          quantity: finalQty,
        },
        update: { quantity: finalQty },
      });
    }

    // Step 4 — Return the full synced cart with product data
    // The database is now the single source of truth
    return tx.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  });
}
