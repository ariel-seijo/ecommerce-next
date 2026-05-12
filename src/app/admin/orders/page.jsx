import { Suspense } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { getOrdersAction, getDashboardMetricsAction } from "@/features/orders/actions/orderActions";
import OrderMetrics from "@/features/orders/components/OrderMetrics";
import OrderFilters from "@/features/orders/components/OrderFilters";
import OrderTable from "@/features/orders/components/OrderTable";
import OrderTableSkeleton from "@/features/orders/components/OrderTableSkeleton";

export const metadata = {
  title: "Pedidos | Panel de Administración",
  description: "Gestión de pedidos — ElectroShop Admin",
};

async function OrdersContent({ searchParams }) {
  const params = await searchParams;
  const [ordersResult, metricsResult] = await Promise.all([
    getOrdersAction({
      page: params.page,
      status: params.status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    }),
    getDashboardMetricsAction(),
  ]);

  if (ordersResult.error || metricsResult.error) {
    return (
      <div className="error-message" role="alert">
        <AlertCircle size={18} aria-hidden="true" />
        {ordersResult.error || metricsResult.error}
      </div>
    );
  }

  const { orders, total, page, totalPages } = ordersResult;

  return (
    <>
      <OrderMetrics metrics={metricsResult} />
      <OrderFilters />
      <div
        className="admin-card"
        style={{ padding: 0, overflow: "visible", background: "transparent", border: "none", boxShadow: "none" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0 14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 900,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#e4e4e4",
            }}
          >
            <ShoppingCart size={18} color="#24abf3" aria-hidden="true" />
            Pedidos ({total})
          </h3>
        </div>
        <OrderTable orders={orders} total={total} page={page} totalPages={totalPages} />
      </div>
    </>
  );
}

export default function AdminOrdersPage({ searchParams }) {
  return (
    <div>
      <h2 className="visually-hidden">Gestión de pedidos</h2>
      <Suspense fallback={<OrderTableSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
