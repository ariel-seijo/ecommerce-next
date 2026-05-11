"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Check,
  X as XIcon,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import {
  updateProductStockAction,
  toggleProductActiveAction,
  toggleProductFeaturedAction,
  deleteProductAction,
} from "@/features/admin/actions/productActions";
import { useToastStore } from "@/features/toast";
import ConfirmModal from "./ConfirmModal";
import styles from "./ProductTable.module.css";

const SORTABLE_COLUMNS = [
  { key: "createdAt", label: "Fecha" },
  { key: "price", label: "Precio" },
  { key: "stock", label: "Inventario" },
  { key: "sold", label: "Vendidos" },
];

function SortIcon({ column, sort, order }) {
  if (sort !== column) {
    return <ArrowUp size={12} className={styles.sortIconInactive} aria-hidden="true" />;
  }
  return order === "asc" ? (
    <ArrowUp size={12} className={styles.sortIconActive} aria-hidden="true" />
  ) : (
    <ArrowDown size={12} className={styles.sortIconActive} aria-hidden="true" />
  );
}

function getStockClass(stock) {
  if (stock === 0) return styles.badgeDanger;
  if (stock < 10) return styles.badgeWarning;
  return styles.badgeSuccess;
}

function getStockLabel(stock) {
  if (stock === 0) return "Agotado";
  if (stock < 10) return `Bajo (${stock})`;
  return `Stock (${stock})`;
}

export default function ProductTable({
  products,
  total,
  page,
  totalPages,
  sort,
  order,
  onSort,
  onPage,
}) {
  const toast = useToastStore((s) => s.toast);

  /* ── Inline stock editing ── */
  const [editingStock, setEditingStock] = useState(null);
  const [savingStock, setSavingStock] = useState(null);

  function startEdit(product) {
    setEditingStock({ id: product.id, value: product.stock.toString() });
  }

  function cancelEdit() {
    setEditingStock(null);
  }

  async function saveStock(productId) {
    if (!editingStock) return;
    const parsed = parseInt(editingStock.value);
    if (isNaN(parsed) || parsed < 0) {
      toast("Stock debe ser un n\u00famero v\u00e1lido (>= 0)", "error");
      setEditingStock(null);
      return;
    }

    setSavingStock(productId);
    const result = await updateProductStockAction(productId, parsed);
    setSavingStock(null);
    setEditingStock(null);

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Stock actualizado", "success");
    }
  }

  function handleStockKeyDown(e, productId) {
    if (e.key === "Enter") saveStock(productId);
    else if (e.key === "Escape") cancelEdit();
  }

  /* ── Toggle active / featured ── */
  const [toggling, setToggling] = useState({});

  async function handleToggleActive(product) {
    const key = `active-${product.id}`;
    setToggling((prev) => ({ ...prev, [key]: true }));
    const result = await toggleProductActiveAction(product.id, !product.active);
    setToggling((prev) => ({ ...prev, [key]: false }));

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(
        product.active ? "Producto desactivado" : "Producto activado",
        "success"
      );
    }
  }

  async function handleToggleFeatured(product) {
    const key = `featured-${product.id}`;
    setToggling((prev) => ({ ...prev, [key]: true }));
    const result = await toggleProductFeaturedAction(
      product.id,
      !product.featured
    );
    setToggling((prev) => ({ ...prev, [key]: false }));

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(
        product.featured
          ? "Producto no destacado"
          : "Producto destacado",
        "success"
      );
    }
  }

  /* ── Delete ── */
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteClick(product) {
    setDeleteModal({ isOpen: true, product });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.product) return;
    setIsDeleting(true);
    const result = await deleteProductAction(deleteModal.product.id);
    setIsDeleting(false);
    setDeleteModal({ isOpen: false, product: null });

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Producto eliminado", "success");
    }
  }

  function handleDeleteCancel() {
    setDeleteModal({ isOpen: false, product: null });
  }

  /* ── Empty state ── */
  if (!products || products.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <Package size={48} className={styles.emptyIcon} aria-hidden="true" />
        <p className={styles.emptyText}>
          No se encontraron productos. Crea tu primer producto para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ---- DESKTOP TABLE ---- */}
      <div className={styles.tableWrapper}>
        <table
          className={styles.table}
          aria-label="Lista de productos"
          role="grid"
        >
          <caption className="visually-hidden">
            Tabla de productos — {total} registros, p\u00e1gina {page} de{" "}
            {totalPages}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thProduct}>
                Producto
              </th>
              <th scope="col" className={styles.thSku}>
                SKU
              </th>
              {SORTABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={styles.thSortable}
                  aria-sort={
                    sort === col.key
                      ? order === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => onSort(col.key)}
                    aria-label={`Ordenar por ${col.label}`}
                  >
                    {col.label}
                    <SortIcon column={col.key} sort={sort} order={order} />
                  </button>
                </th>
              ))}
              <th scope="col" className={styles.thToggle}>
                Activo
              </th>
              <th scope="col" className={styles.thToggle}>
                Destacado
              </th>
              <th scope="col" className={styles.thActions}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={styles.row}>
                {/* Product info */}
                <td>
                  <div className={styles.productCell}>
                    <img
                      src={product.thumbnail || "/placeholder.png"}
                      alt={product.title}
                      className={styles.thumb}
                    />
                    <div className={styles.productInfo}>
                      <span className={styles.productTitle}>
                        {product.title}
                      </span>
                      <span className={styles.productSlug}>
                        /{product.slug}
                      </span>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className={styles.skuCell}>{product.sku}</td>

                {/* Fecha */}
                <td className={styles.dateCell}>
                  {new Date(product.createdAt).toLocaleDateString("es-AR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>

                {/* Price */}
                <td>
                  <div className={styles.priceCell}>
                    <strong>{formatPrice(product.price)}</strong>
                    {product.oldPrice && (
                      <span className={styles.oldPrice}>
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Stock — inline editable */}
                <td>
                  {editingStock?.id === product.id ? (
                    <div className={styles.stockEdit}>
                      <input
                        type="number"
                        className={styles.stockInput}
                        value={editingStock.value}
                        min="0"
                        onChange={(e) =>
                          setEditingStock((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        onBlur={() => saveStock(product.id)}
                        onKeyDown={(e) => handleStockKeyDown(e, product.id)}
                        autoFocus
                        aria-label={`Editar stock de ${product.title}`}
                      />
                      {savingStock === product.id && (
                        <Loader2
                          size={14}
                          className={styles.spin}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.badge} ${getStockClass(product.stock)}`}
                      onClick={() => startEdit(product)}
                      aria-label={`Editar stock: ${getStockLabel(product.stock)}`}
                    >
                      {getStockLabel(product.stock)}
                    </button>
                  )}
                </td>

                {/* Sold */}
                <td>{product.sold}</td>

                {/* Active toggle */}
                <td className={styles.toggleCell}>
                  <button
                    type="button"
                    className={`${styles.switch} ${
                      product.active ? styles.switchOn : styles.switchOff
                    }`}
                    onClick={() => handleToggleActive(product)}
                    disabled={toggling[`active-${product.id}`]}
                    aria-label={
                      product.active ? "Desactivar producto" : "Activar producto"
                    }
                    aria-pressed={product.active}
                  >
                    {toggling[`active-${product.id}`] ? (
                      <Loader2 size={12} className={styles.spin} aria-hidden="true" />
                    ) : product.active ? (
                      <Check size={12} aria-hidden="true" />
                    ) : (
                      <XIcon size={12} aria-hidden="true" />
                    )}
                  </button>
                </td>

                {/* Featured toggle */}
                <td className={styles.toggleCell}>
                  <button
                    type="button"
                    className={`${styles.switch} ${
                      product.featured ? styles.switchOn : styles.switchOff
                    }`}
                    onClick={() => handleToggleFeatured(product)}
                    disabled={toggling[`featured-${product.id}`]}
                    aria-label={
                      product.featured
                        ? "Quitar destacado"
                        : "Marcar como destacado"
                    }
                    aria-pressed={product.featured}
                  >
                    {toggling[`featured-${product.id}`] ? (
                      <Loader2 size={12} className={styles.spin} aria-hidden="true" />
                    ) : (
                      <Star
                        size={12}
                        fill={product.featured ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td>
                  <div className={styles.actionsCell}>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className={styles.actionBtn}
                      aria-label={`Editar ${product.title}`}
                    >
                      <Edit size={14} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => handleDeleteClick(product)}
                      aria-label={`Eliminar ${product.title}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- MOBILE CARDS ---- */}
      <div className={styles.mobileCards}>
        {products.map((product) => (
          <article key={product.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                src={product.thumbnail || "/placeholder.png"}
                alt={product.title}
                className={styles.cardThumb}
              />
              <div className={styles.cardInfo}>
                <h4 className={styles.cardTitle}>{product.title}</h4>
                <span className={styles.cardSku}>{product.sku}</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Precio</span>
                <span className={styles.cardValue}>
                  {formatPrice(product.price)}
                  {product.oldPrice && (
                    <span className={styles.oldPrice}>
                      {" "}
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Stock</span>
                {editingStock?.id === product.id ? (
                  <div className={styles.stockEdit}>
                    <input
                      type="number"
                      className={styles.stockInput}
                      value={editingStock.value}
                      min="0"
                      onChange={(e) =>
                        setEditingStock((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      onBlur={() => saveStock(product.id)}
                      onKeyDown={(e) => handleStockKeyDown(e, product.id)}
                      autoFocus
                      aria-label={`Editar stock de ${product.title}`}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`${styles.badge} ${getStockClass(product.stock)}`}
                    onClick={() => startEdit(product)}
                  >
                    {getStockLabel(product.stock)}
                  </button>
                )}
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Vendidos</span>
                <span className={styles.cardValue}>{product.sold}</span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Categor\u00eda</span>
                <span className={styles.cardValue}>
                  {product.category?.name || "\u2014"}
                </span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                type="button"
                className={`${styles.switch} ${
                  product.active ? styles.switchOn : styles.switchOff
                }`}
                onClick={() => handleToggleActive(product)}
                disabled={toggling[`active-${product.id}`]}
                aria-pressed={product.active}
              >
                {toggling[`active-${product.id}`] ? (
                  <Loader2 size={12} className={styles.spin} />
                ) : product.active ? (
                  <Check size={12} />
                ) : (
                  <XIcon size={12} />
                )}
                <span>{product.active ? "Activo" : "Inactivo"}</span>
              </button>

              <button
                type="button"
                className={`${styles.switch} ${
                  product.featured ? styles.switchOn : styles.switchOff
                }`}
                onClick={() => handleToggleFeatured(product)}
                disabled={toggling[`featured-${product.id}`]}
                aria-pressed={product.featured}
              >
                {toggling[`featured-${product.id}`] ? (
                  <Loader2 size={12} className={styles.spin} />
                ) : (
                  <Star
                    size={12}
                    fill={product.featured ? "currentColor" : "none"}
                  />
                )}
                <span>Destacado</span>
              </button>

              <Link
                href={`/admin/products/${product.id}`}
                className={styles.actionBtn}
                aria-label={`Editar ${product.title}`}
              >
                <Edit size={14} />
              </Link>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                onClick={() => handleDeleteClick(product)}
                aria-label={`Eliminar ${product.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ---- PAGINATION ---- */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Paginaci\u00f3n de productos">
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label="P\u00e1gina anterior"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => {
                if (totalPages <= 7) return true;
                if (n === 1 || n === totalPages) return true;
                if (Math.abs(n - page) <= 1) return true;
                return false;
              })
              .map((n, idx, arr) => {
                const showEllipsis =
                  idx > 0 && n - arr[idx - 1] > 1;
                return (
                  <span key={n} className={styles.pageGroup}>
                    {showEllipsis && (
                      <span className={styles.ellipsis} aria-hidden="true">
                        \u2026
                      </span>
                    )}
                    <button
                      type="button"
                      className={`${styles.pageBtn} ${
                        n === page ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => onPage(n)}
                      aria-current={n === page ? "page" : undefined}
                      aria-label={`P\u00e1gina ${n}`}
                    >
                      {n}
                    </button>
                  </span>
                );
              })}
          </div>

          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="P\u00e1gina siguiente"
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </nav>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar producto"
        message={`\u00bfEst\u00e1s seguro de que deseas eliminar \u201c${deleteModal.product?.title}\u201d? Esta acci\u00f3n no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isConfirming={isDeleting}
      />
    </>
  );
}
