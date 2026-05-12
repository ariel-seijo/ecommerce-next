import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { orderNumber: true },
    });

    if (!order) return { title: "Pedido no encontrado | ElectroShop" };

    const num =
      order.orderNumber.length > 33
        ? order.orderNumber.slice(0, 32) + "…"
        : order.orderNumber;

    return {
      title: `Pedido ${num} - Admin | ElectroShop`,
    };
  } catch {
    return { title: "Pedido - Admin | ElectroShop" };
  }
}

export default function AdminOrderDetailLayout({ children }) {
  return children;
}
