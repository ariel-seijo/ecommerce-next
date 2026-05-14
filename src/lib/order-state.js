export const VALID_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "CANCELLED",
  "DELIVERED",
];

export const STATUS_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

/**
 * Checks whether a transition from `currentStatus` to `nextStatus` is valid
 * according to the order state machine.
 *
 * @param {string} currentStatus - Current OrderStatus value
 * @param {string} nextStatus - Target OrderStatus value
 * @returns {boolean}
 */
export function canTransitionOrderStatus(currentStatus, nextStatus) {
  const allowed = STATUS_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(nextStatus);
}
