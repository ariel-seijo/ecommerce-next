"use client";

import { useState } from "react";
import { Trash2, Loader, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { deleteProductImageAction } from "@/features/admin/actions/imageActions";
import { useToastStore } from "@/features/toast";
import styles from "./AdminGallery.module.css";

export default function AdminGallery({ images, onImageDeleted, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  const toast = useToastStore((s) => s.toast);

  async function handleDelete(imageId, isLegacy) {
    if (isLegacy && onDelete) {
      setDeletingId(imageId);
      try {
        await onDelete(imageId);
        toast("Imagen removida", "success");
        onImageDeleted?.();
      } catch (err) {
        toast(err.message || "Error al remover la imagen", "error");
      } finally {
        setDeletingId(null);
      }
      return;
    }

    setDeletingId(imageId);

    try {
      const result = await deleteProductImageAction(imageId);

      if (result.error) {
        toast(result.error, "error");
      } else {
        toast("Imagen eliminada", "success");
        onImageDeleted?.();
      }
    } catch {
      toast("Error al eliminar la imagen", "error");
    } finally {
      setDeletingId(null);
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className={styles.empty}>
        <ImageIcon size={24} aria-hidden="true" />
        <span>Sin imagenes</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery} role="list" aria-label="Galeria de imagenes">
      {images.map((img) => {
        const isDeleting = deletingId === img.id;
        const isLegacy = img._legacy === true;

        return (
          <div key={img.id} className={styles.card} role="listitem">
            <div className={styles.imageWrap}>
              <Image
                src={img.url}
                alt={`Imagen ${img.format} ${img.width}x${img.height}`}
                width={200}
                height={200}
                sizes="200px"
                loading="lazy"
                unoptimized={isLegacy}
              />

              {isDeleting && (
                <div className={styles.deletingOverlay}>
                  <Loader size={20} className={styles.spinner} aria-hidden="true" />
                </div>
              )}
            </div>

            <div className={styles.meta}>
              <span className={styles.formatBadge}>
                {isLegacy ? "url" : img.format}
              </span>
              {!isLegacy && (
                <span className={styles.dimensions}>
                  {img.width} x {img.height}
                </span>
              )}
            </div>

            <button
              type="button"
              className={styles.btnDelete}
              onClick={() => handleDelete(img.id, isLegacy)}
              disabled={isDeleting}
              aria-label={`Eliminar imagen ${img.format}${!isLegacy ? ` ${img.width}x${img.height}` : ""}`}
              aria-busy={isDeleting}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
