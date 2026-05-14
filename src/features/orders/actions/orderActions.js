"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import * as orderService from "@/features/orders/services/order.service";

/**
 * Fetches a paginated, filtered, and searchable list of orders.
 *
 * @param {object} [filters]
 * @returns {{ success: true, orders: Array, total: number, page: number, totalPages: number } | { error: string }}
 */
export async function getOrdersAction(filters) {
  try {
    await requireAdmin();
    const result = await orderService.getAllOrders(filters);
    return { success: true, ...result };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[GET ORDERS ERROR]", error);
    return { error: error.message || "Error al obtener pedidos" };
  }
}

/**
 * Fetches a single order with full detail (items, user, shipping address).
 *
 * @param {string} id - Order ID (cuid)
 * @returns {{ success: true, order: object } | { error: string }}
 */
export async function getOrderDetailAction(id) {
  try {
    await requireAdmin();
    const order = await orderService.getOrderById(id);
    return { success: true, order };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Pedido no encontrado") {
      return { error: "Pedido no encontrado" };
    }
    console.error("[GET ORDER DETAIL ERROR]", error);
    return { error: error.message || "Error al obtener el pedido" };
  }
}

/**
 * Updates the status of an order with state machine validation.
 * Automatically restores stock on cancellation.
 *
 * @param {string} id - Order ID (cuid)
 * @param {string} status - Target OrderStatus value
 * @returns {{ success: true, order: object } | { error: string }}
 */
export async function updateOrderStatusAction(id, status) {
  try {
    await requireAdmin();
    const order = await orderService.updateOrderStatus(id, status);
    revalidatePath("/admin/orders");
    revalidateTag("admin-dashboard");
    return { success: true, order };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Pedido no encontrado") {
      return { error: "Pedido no encontrado" };
    }
    console.error("[UPDATE ORDER STATUS ERROR]", error);
    return { error: error.message || "Error al actualizar el estado del pedido" };
  }
}

/**
 * Computes admin dashboard metrics.
 *
 * @returns {{ success: true, metrics: object } | { error: string }}
 */
export async function getDashboardMetricsAction() {
  try {
    await requireAdmin();
    const metrics = await orderService.getDashboardMetrics();
    return { success: true, ...metrics };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[GET DASHBOARD METRICS ERROR]", error);
    return { error: error.message || "Error al obtener métricas" };
  }
}
