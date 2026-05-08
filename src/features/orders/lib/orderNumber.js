import { prisma } from "@/lib/prisma";

export async function generateOrderNumber(tx) {
  const db = tx || prisma;
  const year = new Date().getFullYear();
  const prefix = `#ORD-${year}-`;

  const lastOrder = await db.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });

  if (!lastOrder) {
    return `${prefix}0001`;
  }

  const lastNumber = parseInt(lastOrder.orderNumber.split("-").pop(), 10);
  const nextNumber = lastNumber + 1;
  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}
