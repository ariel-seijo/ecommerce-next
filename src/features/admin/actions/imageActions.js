"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import {
  generateSignature,
  generateBlurDataURL,
  deleteAsset,
} from "@/lib/cloudinary";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.userId || session.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

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

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return { error: "Producto no encontrado" };
    }

    const imagesWithBlur = await Promise.all(
      images.map(async (img) => {
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
