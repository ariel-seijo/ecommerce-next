import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED", "DELIVERED"];
const VALID_SORT_FIELDS = ["createdAt", "total", "status"];

const STATUS_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  subtotal: true,
  shippingCost: true,
  total: true,
  createdAt: true,
  user: {
    select: { id: true, name: true, email: true },
  },
  _count: {
    select: { items: true },
  },
};

const ORDER_DETAIL_INCLUDE = {
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      productTitle: true,
      productSku: true,
      productImage: true,
      productId: true,
    },
  },
  user: {
    select: { id: true, name: true, email: true },
  },
};

/**
 * Fetches a paginated, filtered, and searchable list of orders.
 * Uses `select` to avoid loading order items in list view.
 *
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10] - Max 50
 * @param {string} [params.status] - Filter by OrderStatus enum value
 * @param {string} [params.search] - Searches orderNumber or user email (case-insensitive)
 * @param {string} [params.dateFrom] - ISO date string for createdAt >=
 * @param {string} [params.dateTo] - ISO date string for createdAt <=
 * @param {'createdAt'|'total'|'status'} [params.sort=createdAt]
 * @param {'asc'|'desc'} [params.order=desc]
 * @returns {Promise<{ orders: Array, total: number, page: number, totalPages: number }>}
 */
export async function getAllOrders(params = {}) {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(params.limit) || 10));
  const skip = (page - 1) * limit;

  const where = {};

  if (params.status && VALID_STATUSES.includes(params.status)) {
    where.status = params.status;
  }

  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: "insensitive" } },
      { user: { email: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) {
      where.createdAt.gte = new Date(params.dateFrom);
    }
    if (params.dateTo) {
      const endDate = new Date(params.dateTo);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  const orderBy = {};
  if (VALID_SORT_FIELDS.includes(params.sort)) {
    orderBy[params.sort] = params.order === "asc" ? "asc" : "desc";
  } else {
    orderBy.createdAt = "desc";
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: ORDER_LIST_SELECT,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Fetches a single order with full detail: items, user, shipping address.
 *
 * @param {string} id - Order ID (cuid)
 * @returns {Promise<object>}
 */
export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: ORDER_DETAIL_INCLUDE,
  });

  if (!order) {
    throw new Error("Pedido no encontrado");
  }

  return order;
}

/**
 * Updates the status of an order with state machine validation.
 * Cancelling an order automatically restores product stock.
 *
 * @param {string} id - Order ID (cuid)
 * @param {string} newStatus - Target OrderStatus value
 * @returns {Promise<object>} Updated order with full detail
 */
export async function updateOrderStatus(id, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error("Estado no válido");
  }

  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new Error("Pedido no encontrado");
    }

    if (existing.status === newStatus) {
      throw new Error("El pedido ya tiene este estado");
    }

    const allowed = STATUS_TRANSITIONS[existing.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Transición inválida: no se puede cambiar de ${existing.status} a ${newStatus}`
      );
    }

    if (newStatus === "CANCELLED") {
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: id },
        select: { productId: true, quantity: true },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }
    }

    const updated = await tx.order.update({
      where: { id },
      data: { status: newStatus },
      include: ORDER_DETAIL_INCLUDE,
    });

    return updated;
  });

  return order;
}

/**
 * Computes dashboard metrics for the admin overview.
 *
 * @returns {Promise<{
 *   totalRevenue: number,
 *   pendingCount: number,
 *   totalOrders: number,
 *   cancelledCount: number,
 *   cancellationRate: number,
 *   averageTicket: number
 * }>}
 */
export async function getDashboardMetrics() {
  const [revenueAgg, pendingCount, totalOrders, cancelledCount, completedCount] = await Promise.all([
    prisma.order.aggregate({
      where: {
        OR: [
          { status: "PAID" },
          { status: "SHIPPED" },
          { status: "DELIVERED" },
        ],
      },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.count({
      where: {
        OR: [
          { status: "PAID" },
          { status: "SHIPPED" },
          { status: "DELIVERED" },
        ],
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.total || 0;
  const cancellationRate = totalOrders > 0 ? (cancelledCount / totalOrders) * 100 : 0;
  const averageTicket = completedCount > 0 ? totalRevenue / completedCount : 0;

  return {
    totalRevenue,
    pendingCount,
    totalOrders,
    cancelledCount,
    cancellationRate: Math.round(cancellationRate * 100) / 100,
    averageTicket: Math.round(averageTicket * 100) / 100,
  };
}
