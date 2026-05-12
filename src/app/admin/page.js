import { getDashboardData } from "@/features/admin/services/dashboard.service";
import StatsCards from "@/features/admin/components/dashboard/StatsCards";
import RevenueChart from "@/features/admin/components/dashboard/RevenueChart";
import RecentActivity from "@/features/admin/components/dashboard/RecentActivity";
import LowStockAlert from "@/features/admin/components/dashboard/LowStockAlert";

export const metadata = {
  title: "Panel de Control | ElectroShop Admin",
  description: "Centro de control con métricas, tendencias y actividad reciente",
};

export const revalidate = 300;

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <h2 className="visually-hidden">Panel de control</h2>

      <StatsCards data={data} />

      <LowStockAlert
        lowStockCount={data.lowStockCount}
        lowStockProducts={data.lowStockProducts}
      />

      <RevenueChart data={data.timeline} totalRevenue={data.totalRevenue} />

      <RecentActivity
        latestOrders={data.latestOrders}
        topProducts={data.topProducts}
      />
    </div>
  );
}