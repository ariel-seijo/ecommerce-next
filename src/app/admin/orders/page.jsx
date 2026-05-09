"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { formatArs, usdToArs } from "@/lib/utils/currency";

const STATUS_LABELS = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
};

const STATUS_FILTERS = [
  { value: "", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "PAID", label: "Pagadas" },
  { value: "SHIPPED", label: "Enviadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "PENDING": return "table-badge table-badge-warning";
    case "PAID": return "table-badge table-badge-success";
    case "SHIPPED": return "table-badge table-badge-info";
    case "CANCELLED": return "table-badge table-badge-danger";
    default: return "table-badge";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = statusFilter
          ? `/api/admin/orders?status=${statusFilter}`
          : "/api/admin/orders";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar pedidos");
        const data = await res.json();
        setOrders(data.orders);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="loading-spinner" role="status" aria-label="Cargando pedidos">
        <span className="visually-hidden">Cargando pedidos...</span>
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

  return (
    <div>
      <h2 className="visually-hidden">Gestión de pedidos</h2>

      {stats && (
        <div className="admin-stats">
          {[
            {
              label: "Pendientes",
              value: stats.find((s) => s.status === "PENDING")?._count?.id || 0,
              color: "#fbbf24",
            },
            {
              label: "Pagados",
              value: stats.find((s) => s.status === "PAID")?._count?.id || 0,
              color: "#22c55e",
            },
            {
              label: "Enviados",
              value: stats.find((s) => s.status === "SHIPPED")?._count?.id || 0,
              color: "#007fff",
            },
            {
              label: "Cancelados",
              value: stats.find((s) => s.status === "CANCELLED")?._count?.id || 0,
              color: "#ef4444",
            },
          ].map((stat, i) => (
            <div key={i} className="admin-stat-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span className="admin-stat-label">{stat.label}</span>
                <ShoppingCart size={18} color={stat.color} aria-hidden="true" />
              </div>
              <div className="admin-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Pedidos</h3>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`btn ${statusFilter === f.value ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <p style={{ color: "var(--admin-muted)", textAlign: "center", padding: "2rem" }}>
            No hay pedidos {statusFilter ? "con este estado" : ""}
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: "#24abf3", fontSize: "0.85rem" }}>
                        {order.orderNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                          {order.user?.name || "—"}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--admin-muted)" }}>
                          {order.user?.email || "—"}
                        </span>
                      </div>
                    </td>
                    <td>{order.items.length}</td>
                    <td style={{ fontWeight: 700 }}>{formatArs(usdToArs(order.subtotal) + (order.shippingCost ?? 0))}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--admin-muted)" }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-secondary"
                        style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        aria-label={`Ver pedido ${order.orderNumber}`}
                      >
                        <Eye size={14} />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
