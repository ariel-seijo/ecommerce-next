'use client';

import Link from 'next/link';
import { Edit, Trash2, Star, Package } from 'lucide-react';

export default function ProductTable({ products, onDelete, isDeleting }) {
  if (!products || products.length === 0) {
    return (
      <div className="table-empty" role="status">
        <Package size={48} className="table-empty-icon" aria-hidden="true" />
        <p className="table-empty-text">No se encontraron productos. Crea tu primer producto para comenzar.</p>
      </div>
    );
  }

  function getStockBadge(stock) {
    if (stock === 0) {
      return <span className="table-badge table-badge-danger">Agotado</span>;
    }
    if (stock < 10) {
      return <span className="table-badge table-badge-warning">Bajo stock ({stock})</span>;
    }
    return <span className="table-badge table-badge-success">En stock ({stock})</span>;
  }

  return (
    <div className="table-container">
      <table className="admin-table" aria-label="Lista de productos">
        <caption className="visually-hidden">Tabla de productos con {products.length} registros</caption>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Precio</th>
            <th scope="col">Inventario</th>
            <th scope="col">Marca</th>
            <th scope="col">Rating</th>
            <th scope="col">Vendidos</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="table-product-cell">
                  <img
                    src={product.thumbnail || '/placeholder.png'}
                    alt={product.title}
                    className="table-product-thumb"
                  />
                  <div className="table-product-info">
                    <span className="table-product-title">{product.title}</span>
                    <span className="table-product-slug">/{product.slug}</span>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <strong>${product.price.toFixed(2)}</strong>
                  {product.oldPrice && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--admin-muted)', marginLeft: '8px', fontSize: '12px' }}>
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </td>
              <td>{getStockBadge(product.stock)}</td>
              <td>{product.brand}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} aria-label={`Rating ${product.rating.toFixed(1)} de 5`}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" aria-hidden="true" />
                  {product.rating.toFixed(1)}
                </span>
              </td>
              <td>{product.sold}</td>
              <td>
                <div className="table-actions">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="btn btn-secondary btn-sm"
                    aria-label={`Editar ${product.title}`}
                  >
                    <Edit size={14} aria-hidden="true" />
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(product)}
                    disabled={isDeleting}
                    aria-label={`Eliminar ${product.title}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
