'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils/currency';
import ImageUploadWidget from './ImageUploadWidget';
import AdminGallery from './AdminGallery';
import ThumbnailUploader from './ThumbnailUploader';

const initialFormState = {
  title: '',
  slug: '',
  description: '',
  price: '',
  oldPrice: '',
  stock: '',
  brand: '',
  categoryId: '',
  thumbnail: '',
  images: [],
  rating: '0',
  sold: '0',
};

export default function ProductForm({ product, categories, onSubmit, isSubmitting, onRefreshProduct }) {
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        title: product.title || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        oldPrice: product.oldPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        brand: product.brand || '',
        categoryId: product.categoryId?.toString() || '',
        thumbnail: product.thumbnail || '',
        images: product.images?.filter((img) => img) || [],
        rating: product.rating?.toString() || '0',
        sold: product.sold?.toString() || '0',
      };
    }
    return initialFormState;
  });

  const productImages = product?.imagesRel || [];

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function handleTitleBlur() {
    if (!product && formData.title && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.slug.trim()) newErrors.slug = 'El slug es obligatorio';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio válido es obligatorio';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'El inventario válido es obligatorio';
    if (!formData.categoryId) newErrors.categoryId = 'La categoría es obligatoria';
    if (!formData.thumbnail) newErrors.thumbnail = 'La miniatura es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      rating: parseFloat(formData.rating) || 0,
      sold: parseInt(formData.sold) || 0,
    });
  }

  const fieldErrorId = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <div className="product-form-layout">
      <form onSubmit={handleSubmit} className="product-form-main" noValidate>
        <div className="form-section">
          <h3 className="form-section-title">Información básica</h3>
          <div className="form-group">
            <label className="form-label form-label_required" htmlFor="title">Título</label>
            <input type="text" id="title" name="title" className={`form-input ${errors.title ? 'error' : ''}`} value={formData.title} onChange={handleChange} onBlur={handleTitleBlur} placeholder="Título del producto" aria-invalid={!!errors.title} aria-describedby={fieldErrorId('title')} />
            {errors.title && <span className="form-error" id="title-error" role="alert">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label className="form-label form-label_required" htmlFor="slug">Slug</label>
            <input type="text" id="slug" name="slug" className={`form-input ${errors.slug ? 'error' : ''}`} value={formData.slug} onChange={handleChange} placeholder="slug-url-producto" aria-invalid={!!errors.slug} aria-describedby={fieldErrorId('slug')} />
            {errors.slug && <span className="form-error" id="slug-error" role="alert">{errors.slug}</span>}
            <span className="form-hint" id="slug-hint">Se genera automáticamente del título si se deja vacío al crear</span>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Descripción</label>
            <textarea id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange} placeholder="Descripción del producto..." />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Precio e inventario</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label form-label_required" htmlFor="price">Precio ($)</label>
              <input type="number" id="price" name="price" className={`form-input ${errors.price ? 'error' : ''}`} value={formData.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" aria-invalid={!!errors.price} aria-describedby={fieldErrorId('price')} />
              {errors.price && <span className="form-error" id="price-error" role="alert">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="oldPrice">Precio anterior ($)</label>
              <input type="number" id="oldPrice" name="oldPrice" className="form-input" value={formData.oldPrice} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label form-label_required" htmlFor="stock">Inventario</label>
              <input type="number" id="stock" name="stock" className={`form-input ${errors.stock ? 'error' : ''}`} value={formData.stock} onChange={handleChange} placeholder="0" min="0" aria-invalid={!!errors.stock} aria-describedby={fieldErrorId('stock')} />
              {errors.stock && <span className="form-error" id="stock-error" role="alert">{errors.stock}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="brand">Marca</label>
              <input type="text" id="brand" name="brand" className="form-input" value={formData.brand} onChange={handleChange} placeholder="Marca del producto" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Medios</h3>
          <div className="form-group">
            <label className="form-label form-label_required">Miniatura</label>
            <ThumbnailUploader
              value={formData.thumbnail}
              onChange={(url) => {
                setFormData((prev) => ({ ...prev, thumbnail: url }));
                if (errors.thumbnail) {
                  setErrors((prev) => ({ ...prev, thumbnail: "" }));
                }
              }}
            />
            {errors.thumbnail && <span className="form-error" id="thumbnail-error" role="alert">{errors.thumbnail}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Galeria Cloudinary ({productImages.length}/10)</label>
            <AdminGallery
              images={productImages}
              onImageDeleted={() => onRefreshProduct?.()}
            />
            {product?.id && (
              <div style={{ marginTop: '12px' }}>
                <ImageUploadWidget
                  productId={product.id}
                  existingCount={productImages.length}
                  onImagesUploaded={() => onRefreshProduct?.()}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Clasificación</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label form-label_required" htmlFor="categoryId">Categoría</label>
              <select id="categoryId" name="categoryId" className={`form-select ${errors.categoryId ? 'error' : ''}`} value={formData.categoryId} onChange={handleChange} aria-invalid={!!errors.categoryId} aria-describedby={fieldErrorId('categoryId')}>
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              {errors.categoryId && <span className="form-error" id="categoryId-error" role="alert">{errors.categoryId}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="rating">Rating (0-5)</label>
              <input type="number" id="rating" name="rating" className="form-input" value={formData.rating} onChange={handleChange} placeholder="0" step="0.1" min="0" max="5" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (product ? 'Actualizando...' : 'Creando...') : product ? 'Actualizar producto' : 'Crear producto'}
          </button>
          <button type="button" className="btn btn-secondary" disabled={isSubmitting}>Cancelar</button>
        </div>
      </form>

      <aside className="product-form-preview" aria-label="Vista previa del producto">
        <h3 className="preview-title-bar">Vista previa</h3>
        <div className="preview-card">
          <div className="preview-img">
            {formData.thumbnail ? <img src={formData.thumbnail} alt={formData.title || 'Producto'} /> : <div className="preview-placeholder">Sin imagen</div>}
          </div>
          <div className="preview-meta">
            <div className="preview-top">
              <span className="preview-category">{categories.find((c) => c.id.toString() === formData.categoryId)?.name || 'Categoría'}</span>
              <span className="preview-brand">{formData.brand || 'Marca'}</span>
            </div>
            <h4 className="preview-title">{formData.title || 'Título del producto'}</h4>
            <div className="preview-rating">
              <Star size={14} fill="#fbbf24" color="#fbbf24" aria-hidden="true" />
              <span>{formData.rating || '0.0'}</span>
              <small>(0 vendidos)</small>
            </div>
            <div className="preview-price">
              {formData.oldPrice && <span className="preview-old">{formatPrice(parseFloat(formData.oldPrice))}</span>}
              <span className="preview-current">{formData.price ? formatPrice(parseFloat(formData.price)) : formatPrice(0)}</span>
            </div>
          </div>
          <button className="preview-btn" disabled aria-disabled="true">Agregar al carrito</button>
        </div>
      </aside>
    </div>
  );
}
