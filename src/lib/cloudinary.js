import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error(
    "Cloudinary environment variables are not set. " +
    "Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are defined in .env"
  );
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Generates a signed upload signature for the Cloudinary Upload Widget.
 * The API_SECRET is never exposed to the client.
 *
 * @param {Record<string, string | number>} [params]
 * @returns {{ timestamp: number, signature: string, cloudName: string, apiKey: string }}
 */
export function generateSignature(params = {}) {
  const paramsToSign = { ...params };

  if (!paramsToSign.timestamp) {
    paramsToSign.timestamp = Math.round(Date.now() / 1000);
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    API_SECRET
  );

  return {
    timestamp: paramsToSign.timestamp,
    signature,
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
  };
}

/**
 * Downloads a tiny blurred placeholder of a Cloudinary asset and converts
 * it to a Base64 data URI. Uses URL-level transformations — no external
 * image processing libraries required.
 *
 * Transformation applied: w_10 (10px wide), q_10 (quality 10%), f_webp.
 * The result is a ~100-300 byte Base64 string suitable for next/image
 * placeholder="blur".
 *
 * @param {string} url - Cloudinary secure_url
 * @returns {Promise<string>} Base64 data URI (e.g. data:image/webp;base64,...)
 */
export async function generateBlurDataURL(url) {
  const tinyUrl = url.replace(
    /\/image\/upload(\/[^/]*)*\/v/,
    "/image/upload/w_10,q_10,f_webp/v"
  );

  const response = await fetch(tinyUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blur placeholder for ${tinyUrl}: HTTP ${response.status}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType =
    response.headers.get("content-type") || "image/webp";

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

/**
 * Deletes an asset from Cloudinary by its publicId.
 *
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<{ result: string }>}
 */
export async function deleteAsset(publicId) {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
}
