"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import {
  generateSignature,
  generateBlurDataURL,
  deleteAsset,
} from "@/lib/cloudinary";
import { saveProductImagesSchema, formatZodError } from "@/lib/validations";

/**
 * Generates a signed upload signature for the Cloudinary Upload Widget.
 * When called without params, returns a default signature for widget initialization.
 * When called with paramsToSign (from the upload widget callback), signs those exact
 * parameters for per-file authenticated upload.
 *
 * Must be called from an admin-authenticated context.
 *
 * @param {Record<string, string | number>} [paramsToSign]
 * @returns {{ timestamp: number, signature: string, cloudName: string, apiKey: string } | { error: string }}
 */
export async function getCloudinarySignatureAction(paramsToSign) {
  try {
    await requireAdmin();

    const params = paramsToSign || {};
    const { timestamp, signature, cloudName, apiKey } = generateSignature(params);

    return { timestamp, signature, cloudName, apiKey };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[SIGNATURE ERROR]", error);
    return { error: "Error al generar la firma de subida" };
  }
}

/**
 * Persists uploaded image metadata to the database.
 * Generates a blurDataURL placeholder for each image before saving.
 *
 * @param {number} productId
 * @param {Array<{ url: string, publicId: string, width: number, height: number, format: string }>} images
 * @returns {{ images: Array } | { error: string }}
 */
export async function saveProductImagesAction(productId, images) {
  try {
    await requireAdmin();

    if (!productId || !images || !images.length) {
      return { error: "Faltan datos: productId e images son requeridos" };
    }

    if (images.length > 10) {
      return { error: "Máximo 10 imágenes por producto" };
    }

    const parsed = saveProductImagesSchema.safeParse({ productId, images });
    if (!parsed.success) {
      return { error: formatZodError(parsed.error) };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return { error: "Producto no encontrado" };
    }

    const existingCount = await prisma.productImage.count({
      where: { productId },
    });

    const imagesWithBlur = await Promise.all(
      images.map(async (img, i) => {
        let blurDataURL = "";

        try {
          blurDataURL = await generateBlurDataURL(img.url);
        } catch (blurError) {
          console.error("[BLUR ERROR]", blurError);
        }

        return {
          url: img.url,
          publicId: img.publicId,
          width: img.width,
          height: img.height,
          format: img.format,
          blurDataURL,
          sortOrder: existingCount + i,
          productId,
        };
      })
    );

    const imageRecords = await prisma.$transaction(
      imagesWithBlur.map((data) =>
        prisma.productImage.create({ data })
      )
    );

    return { images: imageRecords };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[SAVE IMAGES ERROR]", error);
    return { error: "Error al guardar las imágenes en la base de datos" };
  }
}

/**
 * Deletes an image asset from Cloudinary and removes its database record.
 * Cloudinary deletion is attempted first; the DB record is only removed
 * after confirming Cloudinary cleanup (or if the asset was already gone).
 *
 * @param {string} imageId - ProductImage cuid
 * @returns {{ success: boolean } | { error: string }}
 */
export async function deleteProductImageAction(imageId) {
  try {
    await requireAdmin();

    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
      select: { id: true, publicId: true },
    });

    if (!image) {
      return { error: "Imagen no encontrada" };
    }

    try {
      const result = await deleteAsset(image.publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        console.error("[CLOUDINARY DELETE]", result);
        return { error: "Error al eliminar la imagen de Cloudinary" };
      }
    } catch (cloudinaryError) {
      console.error("[CLOUDINARY DELETE ERROR]", cloudinaryError);
      return { error: "Error al eliminar la imagen de Cloudinary" };
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return { success: true };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[DELETE IMAGE ERROR]", error);
    return { error: "Error al eliminar la imagen" };
  }
}

/**
 * Reorders product images by updating their sortOrder values.
 * The order of imageIds in the array determines the new sortOrder (0-based).
 *
 * @param {number} productId
 * @param {string[]} imageIds - Ordered array of ProductImage cuid values
 * @returns {{ success: boolean } | { error: string }}
 */
export async function reorderProductImagesAction(productId, imageIds) {
  try {
    await requireAdmin();

    if (!productId || !imageIds || !imageIds.length) {
      return { error: "Faltan datos" };
    }

    await prisma.$transaction(
      imageIds.map((imageId, index) =>
        prisma.productImage.update({
          where: { id: imageId, productId },
          data: { sortOrder: index },
        })
      )
    );

    return { success: true };
  } catch (error) {
    if (error.message === "Unauthorized") {
      return { error: "No autorizado" };
    }
    console.error("[REORDER IMAGES ERROR]", error);
    return { error: "Error al reordenar las imágenes" };
  }
}
