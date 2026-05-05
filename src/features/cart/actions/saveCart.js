"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

/**
 * Persists the current cart state to the database atomically.
 * Called on logout (and optionally during active sessions for safety).
 * Replaces ALL cart items for the authenticated user in a single transaction.
 *
 * @param {Array<{productId: number, quantity: number}>} items
 */
export async function saveCart(items) {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId) {
    throw new Error("Not authenticated");
  }

  const userId = session.userId;

  await prisma.$transaction(async (tx) => {
    // Step 1 — Clear all existing cart items for this user
    await tx.cartItem.deleteMany({ where: { userId } });

    // Step 2 — Insert only items with quantity > 0
    if (items.length > 0) {
      await tx.cartItem.createMany({
        data: items.map((item) => ({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }
  });
}
