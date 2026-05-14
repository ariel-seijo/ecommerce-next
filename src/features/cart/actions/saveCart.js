"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

/**
 * Persists the current cart state to the database with stock validation.
 * Each item's quantity is capped to the product's available stock.
 * Returns warnings for any items that were capped.
 *
 * @param {Array<{productId: number, quantity: number}>} items
 * @returns {{ warnings: Array<{productId: number, requested: number, capped: number, maxStock: number}> }}
 */
export async function saveCart(items) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId) {
    return { warnings: [] };
  }

  const userId = session.userId;

  const result = await prisma.$transaction(async (tx) => {
    const warnings = [];

    if (items.length === 0) {
      await tx.cartItem.deleteMany({ where: { userId } });
      return { warnings };
    }

    const productIds = items.map((i) => i.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, active: true },
    });
    const stockMap = new Map(
      products.map((p) => [p.id, { stock: p.stock, active: p.active }])
    );

    // Remove DB items no longer present in the request
    await tx.cartItem.deleteMany({
      where: { userId, productId: { notIn: productIds } },
    });

    for (const item of items) {
      const product = stockMap.get(item.productId);

      if (!product || !product.active || product.stock <= 0) {
        await tx.cartItem.deleteMany({
          where: { userId, productId: item.productId },
        });
        continue;
      }

      const finalQty = Math.min(item.quantity, product.stock);

      if (finalQty < item.quantity) {
        warnings.push({
          productId: item.productId,
          requested: item.quantity,
          capped: finalQty,
          maxStock: product.stock,
        });
      }

      if (finalQty <= 0) {
        await tx.cartItem.deleteMany({
          where: { userId, productId: item.productId },
        });
        continue;
      }

      await tx.cartItem.upsert({
        where: { userId_productId: { userId, productId: item.productId } },
        create: { userId, productId: item.productId, quantity: finalQty },
        update: { quantity: finalQty },
      });
    }

    return { warnings };
  });

  return result;
}
