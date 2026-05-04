'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const productId = params?.id;

  useEffect(() => {
    if (!productId) return;

    async function fetchData() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/categories'),
        ]);

        if (!productRes.ok) throw new Error('Error al obtener el producto');
        const productData = await productRes.json();
        setProduct(productData);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Error al subir archivo');
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(formData, files) {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let thumbnail = formData.thumbnail;
      let images = formData.images || [];

      if (files?.thumbnailFile) {
        thumbnail = await uploadFile(files.thumbnailFile);
      }

      if (files?.imageFiles?.length) {
        for (const file of files.imageFiles) {
          const url = await uploadFile(file);
          images.push(url);
        }
      }

      const productData = {
        ...formData,
        thumbnail,
        images,
      };

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar el producto');
      }

      setSuccess('¡Producto actualizado exitosamente!');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div className="loading-spinner" />;
  }

  if (error && !product) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          Volver a productos
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Editar producto: {product?.title}</h3>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}