import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PackageOpen,
  MapPin,
  CreditCard,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { getOrderDetailAction } from "@/features/orders/actions/orderActions";
import { formatPrice, formatArs } from "@/lib/utils/currency";
import OrderStatusTimeline from "@/features/orders/components/OrderStatusTimeline";
import PrintButton from "@/features/orders/components/PrintButton";
import DetailSkeleton from "@/features/orders/components/DetailSkeleton";
import ReceiptDownloadWrapper from "@/features/orders/components/ReceiptDownloadWrapper";

export const metadata = {
  title: "Detalle del Pedido | Panel de Administración",
  description: "Detalle del pedido — ElectroShop Admin",
};

const STATUS_LABELS = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  DELIVERED: "Entregado",
};

const PAYMENT_LABELS = {
  card: "Tarjeta de Crédito/Débito",
  transfer: "Transferencia Bancaria",
  cash: "Efectivo (al retirar)",
};

function getStatusBadgeClass(status) {
  switch (status) {
    case "PENDING": return "badge-warning";
    case "PAID": return "badge-info";
    case "SHIPPED": return "badge-blue";
    case "DELIVERED": return "badge-success";
    case "CANCELLED": return "badge-danger";
    default: return "badge-neutral";
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function OrderDetailContent({ id }) {
  const result = await getOrderDetailAction(id);

  if (result.error) {
    return (
      <div className="error-message" role="alert">
        <AlertCircle size={18} aria-hidden="true" />
        {result.error}
      </div>
    );
  }

  const order = result.order;
  const shipping = order.shippingAddress || {};
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="print-root">
      {/* ---- Header ---- */}
      <div className="order-detail-header">
        <div className="order-detail-header-left">
          <Link
            href="/admin/orders"
            className="btn btn-secondary btn-sm order-detail-back"
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
          <h2 className="visually-hidden">Detalle del pedido {order.orderNumber}</h2>
        </div>

        <div className="order-detail-header-right">
          <span className={`badge ${getStatusBadgeClass(order.status)} print-badge`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
          <PrintButton />
        </div>
      </div>

      {/* ---- Order Info Card ---- */}
      <div className="admin-card admin-card-spacing">
        <div className="order-info-card-inner">
          <div>
            <h3 className="admin-card-title order-detail-number">
              {order.orderNumber}
            </h3>
            <p className="order-detail-date print-mono">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <ReceiptDownloadWrapper order={order} />
        </div>
      </div>

      {/* ---- Status Timeline ---- */}
      <OrderStatusTimeline order={order} />

      {/* ---- Two-Column Grid ---- */}
      <div className="order-detail-grid print-shipping-grid">
        {/* ---- Left: Shipping Address ---- */}
        <div className="admin-card">
          <h3 className="admin-card-title admin-card-title-with-icon">
            <MapPin size={16} className="order-detail-section-icon" />
            Dirección de envío
          </h3>

          {!shipping.address ? (
            <p className="order-no-shipping">
              Sin dirección de envío registrada
            </p>
          ) : (
            <>
              <div className="order-detail-shipping-grid">
                <div>
                  <span className="order-detail-label print-shipping-label">Nombre</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.fullName || "—"}
                  </p>
                </div>
                <div>
                  <span className="order-detail-label print-shipping-label">Email</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.email || "—"}
                  </p>
                </div>
                <div>
                  <span className="order-detail-label print-shipping-label">Teléfono</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.phone || "—"}
                  </p>
                </div>
                <div>
                  <span className="order-detail-label print-shipping-label">Dirección</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.address || "—"}
                  </p>
                </div>
                <div>
                  <span className="order-detail-label print-shipping-label">Ciudad</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.city || "—"}
                  </p>
                </div>
                <div>
                  <span className="order-detail-label print-shipping-label">CP</span>
                  <p className="order-detail-value print-shipping-value">
                    {shipping.zip || "—"}
                  </p>
                </div>
              </div>
              {shipping.notes && (
                <p className="order-detail-notes">
                  Nota: {shipping.notes}
                </p>
              )}
            </>
          )}
        </div>

        {/* ---- Right: Order Summary ---- */}
        <div className="admin-card">
          <h3 className="admin-card-title admin-card-title-with-icon">
            <CreditCard size={16} className="order-detail-section-icon" />
            Resumen del pedido
          </h3>
          <div className="order-summary-body">
            <div className="order-detail-row print-total-row">
              <span>Cliente</span>
              <span style={{ fontWeight: 600 }}>
                {order.user?.name || order.user?.email || "—"}
              </span>
            </div>
            <div className="order-detail-row print-total-row">
              <span>Subtotal</span>
              <span className="order-detail-mono print-mono">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="order-detail-row print-total-row">
              <span>Envío</span>
              <span className="order-detail-mono print-mono">
                {order.shippingCost === 0 ? "Gratis" : formatArs(order.shippingCost)}
              </span>
            </div>
            <div className="order-detail-row print-total-row">
              <span>Método</span>
              <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </div>
            {order.cardDetails?.last4 && (
              <div className="order-detail-row print-total-row">
                <span>Tarjeta</span>
                <span className="order-detail-mono print-mono">**** {order.cardDetails.last4}</span>
              </div>
            )}
            <div className="order-detail-row order-detail-row-divider print-total-row print-total-divider">
              <span>TOTAL</span>
              <span className="order-detail-total print-mono">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Products Table ---- */}
      <div className="admin-card">
        <h3 className="admin-card-title admin-card-title-with-icon">
          <PackageOpen size={16} className="order-detail-section-icon" />
          Productos ({totalItems})
        </h3>
        <div className="table-container order-table-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th style={{ textAlign: "center" }}>Cant.</th>
                <th style={{ textAlign: "right" }}>Precio unit.</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="order-detail-product-cell">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="order-detail-product-img"
                        />
                      ) : (
                        <div className="order-detail-product-placeholder">
                          <ShoppingCart size={16} />
                        </div>
                      )}
                      <span className="order-detail-product-name">
                        {item.productTitle}
                      </span>
                    </div>
                  </td>
                  <td className="order-detail-mono print-mono">{item.productSku}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td className="order-detail-mono print-mono" style={{ textAlign: "right" }}>
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="order-detail-mono print-mono" style={{ textAlign: "right", fontWeight: 700 }}>
                    {formatPrice(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <h2 className="visually-hidden">Detalle del pedido</h2>
      <Suspense fallback={<DetailSkeleton />}>
        <OrderDetailContent id={id} />
      </Suspense>
    </div>
  );
}
