'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductTable from '@/components/admin/ProductTable';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Error al obtener los productos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(product) {
    setDeleteModal({ isOpen: true, product });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.product) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteModal.product.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar el producto');

      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product.id));
      setDeleteModal({ isOpen: false, product: null });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModal({ isOpen: false, product: null });
  }

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Productos ({products.length})</h3>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus size={16} />
            Agregar producto
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <ProductTable products={products} onDelete={handleDeleteClick} isDeleting={isDeleting} />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.product?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isConfirming={isDeleting}
      />
    </div>
  );
}
