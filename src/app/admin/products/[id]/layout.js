import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: { title: true },
    });

    if (!product) return { title: "Producto no encontrado | ElectroShop" };

    const truncated =
      product.title.length > 26
        ? product.title.slice(0, 25) + "…"
        : product.title;

    return {
      title: `Editar: ${truncated} - Admin | ElectroShop`,
    };
  } catch {
    return { title: "Editar Producto - Admin | ElectroShop" };
  }
}

export default function EditProductLayout({ children }) {
  return children;
}
