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
      order.orderNumber.length > 19
        ? order.orderNumber.slice(0, 18) + "…"
        : order.orderNumber;

    return {
      title: `Pedido #${num} - Detalle de Compra | ElectroShop`,
    };
  } catch {
    return { title: "Pedido | ElectroShop" };
  }
}

export default function OrderDetailLayout({ children }) {
  return children;
}
