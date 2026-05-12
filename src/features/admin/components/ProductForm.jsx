"use client";

import { useState } from "react";
import { Star, Check, X as XIcon, Wand2, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import {
  createProductAction,
  updateProductAction,
  generateSkuAction,
} from "@/features/admin/actions/productActions";
import { useToastStore } from "@/features/toast";
import ImageUploadWidget from "./ImageUploadWidget";
import AdminGallery from "./AdminGallery";
import ThumbnailUploader from "./ThumbnailUploader";
import styles from "./ProductForm.module.css";

const initialFormState = {
  title: "",
  slug: "",
  description: "",
  price: "",
  oldPrice: "",
  stock: "",
  brand: "",
  sku: "",
  categoryId: "",
  thumbnail: "",
  images: [],
  rating: "0",
  sold: "0",
  featured: false,
  active: true,
};

export default function ProductForm({
  mode,
  productId,
  product,
  categories,
  brands = [],
  onRefreshProduct,
  onSuccess,
  onCancel,
}) {
  const isEdit = mode === "edit";
  const toast = useToastStore((s) => s.toast);

  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        oldPrice: product.oldPrice?.toString() || "",
        stock: product.stock?.toString() || "",
        brand: product.brand || "",
        sku: product.sku || "",
        categoryId: product.categoryId?.toString() || "",
        thumbnail: product.thumbnail || "",
        images: product.images?.filter((img) => img) || [],
        rating: product.rating?.toString() || "0",
        sold: product.sold?.toString() || "0",
        featured: product.featured || false,
        active: product.active !== false,
      };
    }
    return initialFormState;
  });

  const productImages = product?.imagesRel || [];
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  const [isCustomBrand, setIsCustomBrand] = useState(() => {
    if (product && brands.length > 0) {
      return product.brand && !brands.includes(product.brand);
    }
    return false;
  });

  /* ── Field change ── */

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleToggle(key) {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleBrandSelect(e) {
    const value = e.target.value;
    if (value === "__custom_brand__") {
      setIsCustomBrand(true);
      if (brands.includes(formData.brand)) {
        setFormData((prev) => ({ ...prev, brand: "" }));
      }
    } else {
      setIsCustomBrand(false);
      setFormData((prev) => ({ ...prev, brand: value }));
    }
    if (errors.brand) {
      setErrors((prev) => ({ ...prev, brand: "" }));
    }
  }

  /* ── Slug auto-generate ── */

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleBlur() {
    if (!isEdit && formData.title && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }

  /* ── SKU generation ── */

  async function handleGenerateSku() {
    if (!formData.categoryId) {
      toast("Selecciona una categoría primero", "error");
      return;
    }
    if (!formData.brand.trim()) {
      toast("Ingresa la marca primero", "error");
      return;
    }
    if (!formData.title.trim()) {
      toast("Ingresa el título primero", "error");
      return;
    }

    setIsGeneratingSku(true);
    const result = await generateSkuAction(
      formData.categoryId,
      formData.brand,
      formData.title
    );
    setIsGeneratingSku(false);

    if (result.error) {
      toast(result.error, "error");
    } else {
      setFormData((prev) => ({ ...prev, sku: result.sku }));
      toast("SKU generado", "success");
    }
  }

  /* ── Validation ── */

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.slug.trim()) newErrors.slug = "El slug es obligatorio";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "El precio válido es obligatorio";
    if (formData.stock === "" || parseInt(formData.stock) < 0)
      newErrors.stock = "El inventario válido es obligatorio";
    if (!formData.categoryId)
      newErrors.categoryId = "La categoría es obligatoria";
    if (!formData.thumbnail)
      newErrors.thumbnail = "La miniatura es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ── Submit ── */

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      rating: parseFloat(formData.rating) || 0,
      sold: parseInt(formData.sold) || 0,
    };

    const action = isEdit
      ? updateProductAction(productId, data)
      : createProductAction(data);

    const result = await action;
    setIsSubmitting(false);

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(
        isEdit ? "Producto actualizado" : "Producto creado exitosamente",
        "success"
      );
      onSuccess?.();
    }
  }

  /* ── Helpers ── */

  const fieldErrorId = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <div className={styles.layout}>
      <form
        onSubmit={handleSubmit}
        className={styles.main}
        noValidate
      >
        {/* ======== SECTION 1: Información general ======== */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Información general</legend>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="title">
              <span className={styles.labelRequired}>Título</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              value={formData.title}
              onChange={handleChange}
              onBlur={handleTitleBlur}
              placeholder="Título del producto"
              aria-invalid={!!errors.title}
              aria-describedby={fieldErrorId("title")}
            />
            {errors.title && (
              <span className={styles.error} id="title-error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="slug">
              <span className={styles.labelRequired}>Slug</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              className={`${styles.input} ${styles.inputMono} ${errors.slug ? styles.inputError : ""}`}
              value={formData.slug}
              onChange={handleChange}
              placeholder="slug-url-producto"
              aria-invalid={!!errors.slug}
              aria-describedby={fieldErrorId("slug")}
            />
            {errors.slug && (
              <span className={styles.error} id="slug-error" role="alert">
                {errors.slug}
              </span>
            )}
            <span className={styles.hint}>
              Se genera automáticamente del título si se deja vacío al crear
            </span>
          </div>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto…"
              rows={4}
            />
          </div>
        </fieldset>

        {/* ======== SECTION 2: Precios y Stock ======== */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Precios y Stock</legend>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="price">
                <span className={styles.labelRequired}>Precio ($)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                aria-invalid={!!errors.price}
                aria-describedby={fieldErrorId("price")}
              />
              {errors.price && (
                <span className={styles.error} id="price-error" role="alert">
                  {errors.price}
                </span>
              )}
            </div>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="oldPrice">
                Precio anterior ($)
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                className={styles.input}
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="stock">
                <span className={styles.labelRequired}>Inventario</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className={`${styles.input} ${errors.stock ? styles.inputError : ""}`}
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                aria-invalid={!!errors.stock}
                aria-describedby={fieldErrorId("stock")}
              />
              {errors.stock && (
                <span className={styles.error} id="stock-error" role="alert">
                  {errors.stock}
                </span>
              )}
            </div>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="brand">
                Marca
              </label>
              {!isCustomBrand ? (
                <select
                  id="brand"
                  name="brand"
                  className={styles.select}
                  value={formData.brand}
                  onChange={handleBrandSelect}
                >
                  <option value="">Seleccionar marca</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="__custom_brand__">Otra...</option>
                </select>
              ) : (
                <div className={styles.skuRow}>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    className={styles.input}
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Escribí la marca"
                    autoFocus
                  />
                  <button
                    type="button"
                    className={styles.skuBtn}
                    onClick={() => {
                      setIsCustomBrand(false);
                      setFormData((prev) => ({ ...prev, brand: "" }));
                    }}
                    title="Volver a la lista de marcas"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ======== SECTION 3: SKU y Clasificación ======== */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>SKU y Clasificación</legend>

          <div className={styles.group}>
            <label className={styles.label} htmlFor="sku">
              SKU
            </label>
            <div className={styles.skuRow}>
              <input
                type="text"
                id="sku"
                name="sku"
                className={`${styles.input} ${styles.inputMono}`}
                value={formData.sku}
                onChange={handleChange}
                placeholder="COMP-CAT-BRD-MODEL-001"
                aria-label="SKU del producto"
              />
              <button
                type="button"
                className={styles.skuBtn}
                onClick={handleGenerateSku}
                disabled={isGeneratingSku}
                aria-label="Generar SKU automáticamente"
              >
                {isGeneratingSku ? (
                  <Loader2 size={14} className={styles.spin} aria-hidden="true" />
                ) : (
                  <Wand2 size={14} aria-hidden="true" />
                )}
                Generar
              </button>
            </div>
            <span className={styles.hint}>
              Formato: COMP-&#123;CAT&#125;-&#123;BRD&#125;-&#123;MODELO&#125;-&#123;SEQ&#125;
            </span>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="categoryId">
                <span className={styles.labelRequired}>Categoría</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                className={`${styles.select} ${errors.categoryId ? styles.inputError : ""}`}
                value={formData.categoryId}
                onChange={handleChange}
                aria-invalid={!!errors.categoryId}
                aria-describedby={fieldErrorId("categoryId")}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className={styles.error} id="categoryId-error" role="alert">
                  {errors.categoryId}
                </span>
              )}
            </div>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="rating">
                Rating (0-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                className={styles.input}
                value={formData.rating}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
          </div>
        </fieldset>

        {/* ======== SECTION 4: Medios ======== */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Medios</legend>

          <div className={styles.group}>
            <label className={styles.label}>
              <span className={styles.labelRequired}>Miniatura</span>
            </label>
            <ThumbnailUploader
              value={formData.thumbnail}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, thumbnail: url }));
                if (errors.thumbnail) {
                  setErrors((prev) => ({ ...prev, thumbnail: "" }));
                }
              }}
            />
            {errors.thumbnail && (
              <span className={styles.error} id="thumbnail-error" role="alert">
                {errors.thumbnail}
              </span>
            )}
          </div>

          {isEdit && (
            <div className={styles.group}>
              <label className={styles.label}>
                Galería Cloudinary ({productImages.length}/10)
              </label>
              <AdminGallery
                images={productImages}
                onImageDeleted={() => onRefreshProduct?.()}
              />
              <div className={styles.galleryUpload}>
                <ImageUploadWidget
                  productId={productId}
                  existingCount={productImages.length}
                  onImagesUploaded={() => onRefreshProduct?.()}
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* ======== SECTION 5: Estado ======== */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Estado del producto</legend>

          <div className={styles.toggles}>
            <button
              type="button"
              className={`${styles.switch} ${formData.active ? styles.switchOn : styles.switchOff}`}
              onClick={() => handleToggle("active")}
              aria-pressed={formData.active}
              aria-label={formData.active ? "Desactivar producto" : "Activar producto"}
            >
              {formData.active ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <XIcon size={14} aria-hidden="true" />
              )}
              <span>{formData.active ? "Activo" : "Inactivo"}</span>
            </button>

            <button
              type="button"
              className={`${styles.switch} ${formData.featured ? styles.switchOn : styles.switchOff}`}
              onClick={() => handleToggle("featured")}
              aria-pressed={formData.featured}
              aria-label={formData.featured ? "Quitar destacado" : "Marcar como destacado"}
            >
              <Star
                size={14}
                fill={formData.featured ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span>Destacado</span>
            </button>
          </div>
        </fieldset>

        {/* ======== Actions ======== */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={styles.spin} aria-hidden="true" />
                {isEdit ? "Actualizando…" : "Creando…"}
              </>
            ) : isEdit ? (
              "Actualizar producto"
            ) : (
              "Crear producto"
            )}
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            disabled={isSubmitting}
            onClick={() => onCancel?.()}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* ======== Live Preview ======== */}
      <aside className={styles.preview} aria-label="Vista previa del producto">
        <h3 className={styles.previewTitle}>Vista previa</h3>
        <div className={styles.previewCard}>
          <div className={styles.previewImg}>
            {formData.thumbnail ? (
              <img
                src={formData.thumbnail}
                alt={formData.title || "Producto"}
              />
            ) : (
              <div className={styles.previewPlaceholder}>Sin imagen</div>
            )}
          </div>
          <div className={styles.previewMeta}>
            <div className={styles.previewTop}>
              <span className={styles.previewCat}>
                {categories.find((c) => c.id.toString() === formData.categoryId)
                  ?.name || "Categoría"}
              </span>
              <span className={styles.previewBrand}>
                {formData.brand || "Marca"}
              </span>
            </div>
            <h4 className={styles.previewName}>
              {formData.title || "Título del producto"}
            </h4>
            <div className={styles.previewRating}>
              <Star size={14} fill="#fbbf24" color="#fbbf24" aria-hidden="true" />
              <span>{formData.rating || "0.0"}</span>
              <small>(0 vendidos)</small>
            </div>
            <div className={styles.previewPrice}>
              {formData.oldPrice && (
                <span className={styles.previewOld}>
                  {formatPrice(parseFloat(formData.oldPrice))}
                </span>
              )}
              <span className={styles.previewCurrent}>
                {formData.price
                  ? formatPrice(parseFloat(formData.price))
                  : formatPrice(0)}
              </span>
            </div>
            {formData.sku && (
              <div className={styles.previewSku}>{formData.sku}</div>
            )}
          </div>
          <button className={styles.previewBtn} disabled aria-disabled="true">
            Agregar al carrito
          </button>
        </div>
      </aside>
    </div>
  );
}
