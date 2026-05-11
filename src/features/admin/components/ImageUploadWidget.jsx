"use client";

import { useState, useRef, useCallback } from "react";
import Script from "next/script";
import { Upload, Loader } from "lucide-react";
import {
  getCloudinarySignatureAction,
  saveProductImagesAction,
} from "@/features/admin/actions/imageActions";
import { useToastStore } from "@/features/toast";
import styles from "./ImageUploadWidget.module.css";

export default function ImageUploadWidget({
  productId,
  onImagesUploaded,
  existingCount = 0,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const widgetRef = useRef(null);
  const collectedRef = useRef([]);
  const toast = useToastStore((s) => s.toast);

  const remainingSlots = Math.max(0, 10 - existingCount);

  const handleUploadResult = useCallback(
    async (error, result) => {
      if (error) {
        toast("Error en la subida", "error");
        return;
      }

      if (result.event === "success") {
        collectedRef.current.push({
          url: result.info.secure_url,
          publicId: result.info.public_id,
          width: result.info.width,
          height: result.info.height,
          format: result.info.format,
        });
      }

      if (result.event === "queues-end") {
        if (collectedRef.current.length === 0) return;

        setIsUploading(true);

        try {
          const saveResult = await saveProductImagesAction(
            productId,
            collectedRef.current
          );

          if (saveResult.error) {
            toast(saveResult.error, "error");
          } else {
            toast(
              `${saveResult.images.length} imagen(es) guardada(s)`,
              "success"
            );
            onImagesUploaded?.();
          }
        } catch {
          toast("Error al guardar las imagenes", "error");
        } finally {
          setIsUploading(false);
          collectedRef.current = [];
        }
      }
    },
    [productId, onImagesUploaded, toast]
  );

  const openWidget = useCallback(async () => {
    if (!scriptLoaded || !productId || remainingSlots <= 0) return;

    try {
      const sigResult = await getCloudinarySignatureAction();

      if (sigResult.error) {
        toast(sigResult.error, "error");
        return;
      }

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: sigResult.cloudName,
          apiKey: sigResult.apiKey,
          uploadSignature: (callback, paramsToSign) => {
            getCloudinarySignatureAction(paramsToSign)
              .then((res) => {
                if (res.error) {
                  toast(res.error, "error");
                  return;
                }
                callback(res.signature);
              })
              .catch(() => {
                toast("Error al firmar la subida", "error");
              });
          },
          maxFileSize: 2000000,
          resourceType: "image",
          multiple: true,
          maxFiles: remainingSlots,
        },
        handleUploadResult
      );

      widgetRef.current = widget;
      widget.open();
    } catch {
      toast("Error al abrir el widget de subida", "error");
    }
  }, [scriptLoaded, productId, remainingSlots, handleUploadResult, toast]);

  if (!productId) return null;

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className={styles.uploadSection}>
        <button
          type="button"
          className={styles.btnUpload}
          onClick={openWidget}
          disabled={!scriptLoaded || isUploading || remainingSlots <= 0}
          aria-busy={isUploading}
        >
          {isUploading ? (
            <>
              <Loader size={16} className={styles.spinner} aria-hidden="true" />
              Guardando...
            </>
          ) : (
            <>
              <Upload size={16} aria-hidden="true" />
              Subir imagenes
            </>
          )}
        </button>

        {remainingSlots > 0 && !isUploading && (
          <span className={styles.counter}>
            {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"}{" "}
            disponible{remainingSlots === 1 ? "" : "s"}
          </span>
        )}

        {isUploading && (
          <div className={styles.uploadingOverlay} role="status" aria-live="polite">
            <Loader size={16} className={styles.spinner} aria-hidden="true" />
            Procesando imagenes...
          </div>
        )}
      </div>
    </>
  );
}
