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

function getStatusBadgeStyle(status) {
  switch (status) {
    case "PENDING": return { bg: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "rgba(245,158,11,0.2)" };
    case "PAID": return { bg: "rgba(36,171,243,0.08)", color: "#24abf3", border: "rgba(36,171,243,0.2)" };
    case "SHIPPED": return { bg: "rgba(0,127,255,0.08)", color: "#3399ff", border: "rgba(0,127,255,0.2)" };
    case "DELIVERED": return { bg: "rgba(34,197,94,0.08)", color: "#4ade80", border: "rgba(34,197,94,0.2)" };
    case "CANCELLED": return { bg: "rgba(255,51,102,0.08)", color: "#ff3366", border: "rgba(255,51,102,0.2)" };
    default: return { bg: "rgba(160,160,160,0.08)", color: "rgb(180,180,180)", border: "rgba(160,160,160,0.15)" };
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

const labelStyle = {
  fontSize: "0.7rem",
  fontWeight: 700,
  color: "var(--admin-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
};

const valueStyle = {
  margin: "0.2rem 0 0 0",
  fontSize: "0.88rem",
  color: "var(--admin-text)",
  fontWeight: 600,
};

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
  const statusStyle = getStatusBadgeStyle(order.status);
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="print-root">
      {/* ---- Header ---- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/admin/orders"
            className="btn btn-secondary"
            style={{
              fontSize: "0.75rem",
              padding: "0.35rem 0.75rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
          <h2 className="visually-hidden">Detalle del pedido {order.orderNumber}</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            className="print-badge"
            style={{
              display: "inline-block",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {STATUS_LABELS[order.status] || order.status}
          </span>
          <PrintButton />
        </div>
      </div>

      {/* ---- Order Info Card ---- */}
      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h3
              className="admin-card-title print-orderNumber"
              style={{
                marginBottom: "0.3rem",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontSize: "1.1rem",
                color: "#24abf3",
              }}
            >
              {order.orderNumber}
            </h3>
            <p
              className="print-mono"
              style={{ color: "var(--admin-muted)", fontSize: "0.8rem", margin: 0 }}
            >
              {formatDate(order.createdAt)}
            </p>
          </div>
          <ReceiptDownloadWrapper order={order} />
        </div>
      </div>

      {/* ---- Status Timeline ---- */}
      <OrderStatusTimeline order={order} />

      {/* ---- Two-Column Grid ---- */}
      <div
        className="print-shipping-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* ---- Left: Shipping Address ---- */}
        <div className="admin-card">
          <h3
            className="admin-card-title"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <MapPin size={16} color="#24abf3" />
            Dirección de envío
          </h3>

          {!shipping.address ? (
            <p style={{ color: "var(--admin-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
              Sin dirección de envío registrada
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <div>
                  <span className="print-shipping-label" style={labelStyle}>Nombre</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.fullName || "—"}
                  </p>
                </div>
                <div>
                  <span className="print-shipping-label" style={labelStyle}>Email</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.email || "—"}
                  </p>
                </div>
                <div>
                  <span className="print-shipping-label" style={labelStyle}>Teléfono</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.phone || "—"}
                  </p>
                </div>
                <div>
                  <span className="print-shipping-label" style={labelStyle}>Dirección</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.address || "—"}
                  </p>
                </div>
                <div>
                  <span className="print-shipping-label" style={labelStyle}>Ciudad</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.city || "—"}
                  </p>
                </div>
                <div>
                  <span className="print-shipping-label" style={labelStyle}>CP</span>
                  <p className="print-shipping-value" style={valueStyle}>
                    {shipping.zip || "—"}
                  </p>
                </div>
              </div>
              {shipping.notes && (
                <p
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "rgba(36, 171, 243, 0.04)",
                    borderLeft: "3px solid #24abf3",
                    fontSize: "0.8rem",
                    color: "var(--admin-muted)",
                    fontStyle: "italic",
                  }}
                >
                  Nota: {shipping.notes}
                </p>
              )}
            </>
          )}
        </div>

        {/* ---- Right: Order Summary ---- */}
        <div className="admin-card">
          <h3
            className="admin-card-title"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <CreditCard size={16} color="#24abf3" />
            Resumen del pedido
          </h3>
          <div style={{ marginTop: "1rem" }}>
            <div className="print-total-row" style={rowStyle}>
              <span>Cliente</span>
              <span style={{ fontWeight: 600 }}>
                {order.user?.name || order.user?.email || "—"}
              </span>
            </div>
            <div className="print-total-row" style={rowStyle}>
              <span>Subtotal</span>
              <span className="print-mono">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="print-total-row" style={rowStyle}>
              <span>Envío</span>
              <span className="print-mono">
                {order.shippingCost === 0 ? "Gratis" : formatArs(order.shippingCost)}
              </span>
            </div>
            <div className="print-total-row" style={rowStyle}>
              <span>Método</span>
              <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </div>
            {order.cardDetails?.last4 && (
              <div className="print-total-row" style={rowStyle}>
                <span>Tarjeta</span>
                <span className="print-mono">**** {order.cardDetails.last4}</span>
              </div>
            )}
            <div
              className="print-total-row print-total-divider"
              style={{
                ...rowStyle,
                borderTop: "1px solid var(--admin-border)",
                marginTop: "0.4rem",
                paddingTop: "0.6rem",
                fontSize: "1rem",
                fontWeight: 900,
              }}
            >
              <span>TOTAL</span>
              <span
                className="print-mono"
                style={{ color: "#24abf3", fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
              >
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Products Table ---- */}
      <div className="admin-card">
        <h3
          className="admin-card-title"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <PackageOpen size={16} color="#24abf3" />
          Productos ({totalItems})
        </h3>
        <div className="admin-table-wrapper" style={{ marginTop: "1rem" }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: "contain",
                            background: "rgb(18,18,18)",
                            borderRadius: 2,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            background: "rgb(18,18,18)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ShoppingCart size={16} color="rgb(60,60,60)" />
                        </div>
                      )}
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                        {item.productTitle}
                      </span>
                    </div>
                  </td>
                  <td className="print-mono" style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
                    {item.productSku}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td className="print-mono" style={{ textAlign: "right" }}>
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td
                    className="print-mono"
                    style={{ textAlign: "right", fontWeight: 700 }}
                  >
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

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.4rem 0",
  fontSize: "0.85rem",
  color: "var(--admin-text)",
};

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
