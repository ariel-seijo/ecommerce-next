import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "@/lib/session";

/**
 * Requires a valid authenticated session.
 * Must be used inside a Server Action or any context where `cookies()` is available.
 *
 * @returns {Promise<import("iron-session").IronSession>}
 * @throws {Error} "Unauthorized" if no valid session exists
 */
export async function requireAuth() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Requires an authenticated admin session.
 * Calls `requireAuth()` first, then verifies `role === "ADMIN"`.
 *
 * @returns {Promise<import("iron-session").IronSession>}
 * @throws {Error} "Unauthorized" if session is missing or role is not ADMIN
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}
