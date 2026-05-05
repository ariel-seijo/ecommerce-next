"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";

/**
 * Read-only fetch of the authenticated user's DB cart.
 * Used for: session restoration, multi-tab refresh, empty-guest-cart login.
 *
 * @returns {Promise<Array>} The user's cart items with product data included
 */
export async function fetchCart() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId) {
    throw new Error("Not authenticated");
  }

  return prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: { product: true },
  });
}
