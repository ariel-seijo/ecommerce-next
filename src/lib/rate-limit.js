const attempts = new Map();

/**
 * Extracts the client IP from the request, prioritizing headers set by
 * reverse proxies (Vercel, Nginx, etc.).
 *
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Simple in-memory rate limiter using a sliding window.
 * Each `key` (e.g. "login", "register") is tracked independently per IP.
 *
 * - No Redis or external services required.
 * - Auto-expires old entries on every check.
 * - Resets on cold starts (acceptable for serverless).
 *
 * @param {string} ip - Client IP address
 * @param {string} key - Action key (e.g. "login", "register", "forgot-password")
 * @param {object} [options]
 * @param {number} [options.maxAttempts=5] - Max requests allowed in the window
 * @param {number} [options.windowMs=60000] - Time window in milliseconds
 * @returns {{ allowed: boolean }}
 */
export function checkRateLimit(
  ip,
  key,
  { maxAttempts = 5, windowMs = 60_000 } = {}
) {
  const now = Date.now();
  const mapKey = `${ip}:${key}`;

  const timestamps = attempts.get(mapKey) || [];

  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxAttempts) {
    attempts.set(mapKey, valid);
    return { allowed: false };
  }

  valid.push(now);
  attempts.set(mapKey, valid);

  return { allowed: true };
}
