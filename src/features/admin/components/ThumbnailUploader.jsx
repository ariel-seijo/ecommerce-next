"use client";

import { useState, useRef, useCallback } from "react";
import Script from "next/script";
import { Upload, Trash2, Loader, Link } from "lucide-react";
import { getCloudinarySignatureAction } from "@/features/admin/actions/imageActions";
import { useToastStore } from "@/features/toast";
import styles from "./ThumbnailUploader.module.css";

export default function ThumbnailUploader({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const widgetRef = useRef(null);
  const toast = useToastStore((s) => s.toast);

  const handleResult = useCallback(
    (error, result) => {
      if (error) {
        toast("Error en la subida", "error");
        return;
      }

      if (result.event === "success") {
        const url = result.info.secure_url;
        setPreviewUrl(url);
      }

      if (result.event === "queues-end") {
        widgetRef.current?.close();
      }

      if (result.event === "close") {
        setIsUploading(false);
      }
    },
    [toast]
  );

  const openWidget = useCallback(async () => {
    if (!scriptLoaded) return;

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
          multiple: false,
        },
        handleResult
      );

      widgetRef.current = widget;
      widget.open();
    } catch {
      toast("Error al abrir el widget de subida", "error");
    }
  }, [scriptLoaded, handleResult, toast]);

  function handleRemove() {
    setPreviewUrl("");
    setUrlValue("");
    onChange?.("");
    toast("Miniatura eliminada", "success");
  }

  function handleConfirm() {
    if (previewUrl) {
      onChange?.(previewUrl);
      toast("Miniatura actualizada", "success");
    }
  }

  function handleUrlSubmit() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    setPreviewUrl(trimmed);
    setShowUrlInput(false);
    onChange?.(trimmed);
    toast("URL de miniatura aplicada", "success");
  }

  function handleUrlKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  }

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className={styles.wrapper}>
        {previewUrl ? (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Vista previa de la miniatura" />
          </div>
        ) : (
          <div className={styles.preview}>
            <div className={styles.placeholder}>
              <Upload size={24} aria-hidden="true" />
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnUpload}
            onClick={openWidget}
            disabled={!scriptLoaded || isUploading}
          >
            {isUploading ? (
              <>
                <Loader size={14} className={styles.spinner} aria-hidden="true" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload size={14} aria-hidden="true" />
                Subir
              </>
            )}
          </button>

          <button
            type="button"
            className={styles.btnUpload}
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={isUploading}
          >
            <Link size={14} aria-hidden="true" />
            URL
          </button>

          {previewUrl && (
            <>
              <button
                type="button"
                className={styles.btnUpload}
                onClick={handleConfirm}
                disabled={isUploading}
                style={previewUrl === value ? { opacity: 0.4 } : undefined}
              >
                Aplicar
              </button>
              <button
                type="button"
                className={styles.btnRemove}
                onClick={handleRemove}
                disabled={isUploading}
              >
                <Trash2 size={14} aria-hidden="true" />
                Quitar
              </button>
            </>
          )}
        </div>

        {showUrlInput && (
          <div style={{ marginTop: "10px" }}>
            <input
              type="url"
              className={styles.urlInput}
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={handleUrlKeyDown}
              placeholder="https://res.cloudinary.com/..."
              aria-label="URL de la miniatura"
            />
          </div>
        )}
      </div>
    </>
  );
}
