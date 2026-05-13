import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import { getDashboardData } from "@/features/admin/services/dashboard.service";
import StatsCards from "@/features/admin/components/dashboard/StatsCards";
import RevenueChart from "@/features/admin/components/dashboard/RevenueChart";
import RecentActivity from "@/features/admin/components/dashboard/RecentActivity";
import LowStockAlert from "@/features/admin/components/dashboard/LowStockAlert";
import DashboardSkeleton from "@/features/admin/components/dashboard/DashboardSkeleton";

export const metadata = {
  title: "Panel de Control | ElectroShop Admin",
  description: "Centro de control con métricas, tendencias y actividad reciente",
};

export const revalidate = 300;

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <>
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
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="admin-card-title admin-card-title-with-icon page-title-spacing">
        <LayoutDashboard size={20} color="var(--admin-primary-glow)" aria-hidden="true" />
        Panel de Control
      </h2>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}