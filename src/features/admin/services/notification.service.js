import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getAdminNotifications = unstable_cache(
  async () => {
    const [lowStock, pendingOrders] = await Promise.all([
      prisma.product.count({
        where: { stock: { lt: 5 } },
      }),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
    ]);

    return { lowStock, pendingOrders };
  },
  ["admin-notifications"],
  { tags: ["admin-notifications"], revalidate: 60 }
);
