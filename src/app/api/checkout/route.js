import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/features/orders/lib/orderNumber";

function calculateShipping(subtotal) {
  return subtotal >= 50000 ? 0 : 1500;
}

export async function POST(request) {
  try {
    const response = new NextResponse();
    const session = await getIronSession(request, response, sessionOptions);

    if (!session.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shipping, paymentMethod, cardDetails, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    if (!shipping || !shipping.fullName || !shipping.email || !shipping.address) {
      return NextResponse.json(
        { error: "Faltan datos de envío" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = calculateShipping(subtotal);
    const total = subtotal + shippingCost;

    const order = await prisma.$transaction(async (tx) => {
      const orderNumber = await generateOrderNumber(tx);

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { id: true, active: true, stock: true, title: true, price: true, sku: true, thumbnail: true },
        });

        if (!product) {
          throw new Error(`El producto "${item.title}" ya no existe`);
        }
        if (!product.active) {
          throw new Error(`El producto "${product.title}" no está disponible`);
        }
        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para "${product.title}". Disponible: ${product.stock}, solicitado: ${item.quantity}`
          );
        }
        if (product.price !== item.price) {
          throw new Error(
            `El precio de "${product.title}" ha cambiado. Por favor revisá tu carrito.`
          );
        }
      }

      for (const item of items) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });

        if (updateResult.count === 0) {
          const product = await tx.product.findUnique({
            where: { id: item.id },
            select: { title: true, stock: true },
          });
          throw new Error(
            `Stock insuficiente para "${product.title}". Stock actual: ${product.stock}`
          );
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.userId,
          status: "PENDING",
          shippingAddress: shipping,
          paymentMethod,
          cardDetails: cardDetails
            ? {
                last4: cardDetails.cardNumber?.slice(-4) || null,
                expiry: cardDetails.cardExpiry || null,
                holder: cardDetails.cardHolder || null,
              }
            : null,
          subtotal,
          shippingCost,
          total,
          notes: notes || null,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
              productTitle: item.title,
              productSku: item.sku || "N/A",
              productImage: item.thumbnail,
            })),
          },
        },
        include: {
          items: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al procesar el pedido";

    if (message.includes("Stock insuficiente") || message.includes("no existe") || message.includes("no está disponible") || message.includes("ha cambiado")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
