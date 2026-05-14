"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth-guards";
import * as userService from "@/features/admin/services/user.service";

/**
 * Fetches a paginated, filtered, and searchable list of users
 * with commercial aggregate data.
 *
 * @param {object} [filters]
 * @returns {{ success: true, users: Array, total: number, page: number, totalPages: number } | { error: string }}
 */
export async function getUsersAction(filters) {
  try {
    await requireAdmin();
    const result = await userService.getAllUsers(filters);
    return { success: true, ...result };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[GET USERS ERROR]", error);
    return { error: error.message || "Error al obtener usuarios" };
  }
}

/**
 * Fetches a specific user's order history summary.
 *
 * @param {string} id - User ID (cuid)
 * @returns {{ success: true, user: object, orders: Array } | { error: string }}
 */
export async function getUserOrderHistoryAction(id) {
  try {
    await requireAdmin();
    const result = await userService.getUserOrderHistory(id);
    return { success: true, ...result };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Usuario no encontrado") {
      return { error: "Usuario no encontrado" };
    }
    console.error("[GET USER ORDER HISTORY ERROR]", error);
    return { error: error.message || "Error al obtener el historial" };
  }
}

/**
 * Soft-deletes a user by setting deletedAt and anonymizing PII.
 *
 * @param {string} id - User ID (cuid)
 * @returns {{ success: true, user: object } | { error: string }}
 */
export async function deleteUserAction(id) {
  try {
    await requireAdmin();
    const user = await userService.softDeleteUser(id);
    revalidatePath("/admin/users");
    revalidateTag("admin-dashboard", "max");
    return { success: true, user };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Usuario no encontrado") {
      return { error: "Usuario no encontrado" };
    }
    if (error.message === "El usuario ya fue eliminado") {
      return { error: "El usuario ya fue eliminado" };
    }
    console.error("[DELETE USER ERROR]", error);
    return { error: error.message || "Error al eliminar el usuario" };
  }
}

/**
 * Toggles a user's account status between ACTIVE and BANNED.
 *
 * @param {string} id - User ID (cuid)
 * @returns {{ success: true, user: object } | { error: string }}
 */
export async function toggleUserStatusAction(id) {
  try {
    await requireAdmin();
    const user = await userService.toggleUserStatus(id);
    revalidatePath("/admin/users");
    revalidateTag("admin-dashboard", "max");
    return { success: true, user };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Usuario no encontrado") {
      return { error: "Usuario no encontrado" };
    }
    if (error.message === "No se puede modificar un usuario eliminado") {
      return { error: "No se puede modificar un usuario eliminado" };
    }
    console.error("[TOGGLE USER STATUS ERROR]", error);
    return { error: error.message || "Error al cambiar el estado del usuario" };
  }
}

/**
 * Updates a user's role (CUSTOMER or ADMIN).
 *
 * @param {string} id - User ID (cuid)
 * @param {string} role - "CUSTOMER" or "ADMIN"
 * @returns {{ success: true, user: object } | { error: string }}
 */
export async function updateUserRoleAction(id, role) {
  try {
    await requireAdmin();
    const userData = await userService.updateUserRole(id, role);
    revalidatePath("/admin/users");
    revalidateTag("admin-dashboard", "max");
    return { success: true, user: userData };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    if (error.message === "Usuario no encontrado") {
      return { error: "Usuario no encontrado" };
    }
    if (error.message === "Rol no válido") {
      return { error: "Rol no válido" };
    }
    if (error.message === "El usuario ya tiene este rol") {
      return { error: "El usuario ya tiene este rol" };
    }
    if (error.message === "No se puede modificar un usuario eliminado") {
      return { error: "No se puede modificar un usuario eliminado" };
    }
    console.error("[UPDATE USER ROLE ERROR]", error);
    return { error: error.message || "Error al cambiar el rol del usuario" };
  }
}
