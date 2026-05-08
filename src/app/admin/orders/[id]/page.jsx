"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  PackageOpen,
  MapPin,
  CreditCard,
  Download,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

const ReceiptDownload = dynamic(
  () => import("@/features/orders/components/ReceiptDownload"),
  { ssr: false }
);

const STATUS_LABELS = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
};

const STATUS_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: [],
  CANCELLED: [],
};

function getStatusBadgeClass(status) {
  switch (status) {
    case "PENDING": return "table-badge table-badge-warning";
    case "PAID": return "table-badge table-badge-success";
    case "SHIPPED": return "table-badge table-badge-info";
    case "CANCELLED": return "table-badge table-badge-danger";
    default: return "table-badge";
  }
}

const PAYMENT_LABELS = {
  card: "Tarjeta de Crédito/Débito",
  transfer: "Transferencia Bancaria",
  cash: "Efectivo (al retirar)",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Pedido no encontrado");
          throw new Error("Error al cargar el pedido");
        }
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner" role="status" aria-label="Cargando pedido">
        <span className="visually-hidden">Cargando pedido...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        <span aria-hidden="true">&#9888;</span> {error}
      </div>
    );
  }

  if (!order) return null;

  const shipping = order.shippingAddress || {};
  const availableTransitions = STATUS_TRANSITIONS[order.status] || [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/admin/orders"
            className="btn btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
          <h2 className="visually-hidden" style={{ display: "none" }}>Detalle del pedido</h2>
        </div>
        <span className={getStatusBadgeClass(order.status)} style={{ fontSize: "0.8rem", padding: "0.4rem 1rem" }}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 className="admin-card-title" style={{ marginBottom: "0.3rem" }}>
              {order.orderNumber}
            </h3>
            <p style={{ color: "var(--admin-muted)", fontSize: "0.8rem", margin: 0 }}>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {availableTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating}
                className={`btn ${status === "CANCELLED" ? "btn-danger" : "btn-primary"}`}
                style={{ fontSize: "0.75rem", padding: "0.4rem 1rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                {updating ? (
                  <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} />
                ) : null}
                {status === "PAID" && "Marcar como Pagado"}
                {status === "SHIPPED" && "Marcar como Enviado"}
                {status === "CANCELLED" && "Cancelar Pedido"}
              </button>
            ))}
            <ReceiptDownload order={order} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={16} color="#24abf3" />
            Dirección de envío
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Nombre</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.fullName || "—"}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Email</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.email || "—"}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Teléfono</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.phone || "—"}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Dirección</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.address || "—"}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Ciudad</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.city || "—"}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--admin-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>CP</span>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.88rem", color: "var(--admin-text)", fontWeight: 600 }}>
                {shipping.zip || "—"}
              </p>
            </div>
          </div>
          {shipping.notes && (
            <p style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(36, 171, 243, 0.05)", borderLeft: "3px solid var(#24abf3)", fontSize: "0.8rem", color: "var(--admin-muted)", fontStyle: "italic" }}>
              Nota: {shipping.notes}
            </p>
          )}
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={16} color="var(#24abf3)" />
            Resumen del pedido
          </h3>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.85rem", color: "var(--admin-text)" }}>
              <span>Cliente</span>
              <span style={{ fontWeight: 600 }}>{order.user?.name || order.user?.email || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.85rem", color: "var(--admin-text)" }}>
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.85rem", color: "var(--admin-text)" }}>
              <span>Envío</span>
              <span>{order.shippingCost === 0 ? "Gratis" : formatCurrency(order.shippingCost)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.85rem", color: "var(--admin-text)" }}>
              <span>Método</span>
              <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </div>
            {order.cardDetails?.last4 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", fontSize: "0.8rem", color: "var(--admin-muted)" }}>
                <span>Tarjeta</span>
                <span>**** {order.cardDetails.last4}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", fontSize: "1rem", fontWeight: 900, color: "var(--admin-text)", borderTop: "1px solid var(--admin-border)", marginTop: "0.4rem" }}>
              <span>TOTAL</span>
              <span style={{ color: "var(#24abf3)" }}>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PackageOpen size={16} color="var(#24abf3)" />
          Productos ({order.items.length})
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
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          style={{ width: 36, height: 36, objectFit: "contain", background: "rgb(18,18,18)", borderRadius: 2 }}
                        />
                      )}
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.productTitle}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>{item.productSku}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
