/**
 * Pure utility — safe for both client and server.
 * Applies Cloudinary optimization transformations to a display URL.
 * f_auto = auto format (WebP/AVIF based on browser support)
 * q_auto = auto quality (balances size vs visual quality)
 *
 * @param {string} url - Cloudinary secure_url
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    /\/image\/upload(\/[^/]*)*\/v/,
    "/image/upload/f_auto,q_auto/v"
  );
}
