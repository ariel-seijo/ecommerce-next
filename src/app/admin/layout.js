import { Suspense } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/features/admin/components/AdminHeader";
import layoutStyles from "@/features/admin/styles/AdminLayout.module.css";
import "@/features/admin/styles/admin-tokens.css";
import "@/features/admin/styles/admin-components.css";
import "@/features/admin/styles/forms.css";
import "@/features/admin/styles/table.css";
import "@/features/admin/styles/print-order.css";

export const metadata = {
  title: "Panel de Administración | ElectroShop",
  description: "Panel de administración para gestionar tu tienda online",
};

function HeaderSkeleton() {
  return <div style={{ height: "var(--admin-header-height, 64px)", background: "rgb(8, 8, 8)", borderBottom: "var(--admin-border-thin)" }} />;
}

export default function AdminLayout({ children }) {
  return (
    <div className={layoutStyles.layout} data-admin-root="true">
      <Suspense fallback={null}>
        <Sidebar className={layoutStyles.sidebar} />
      </Suspense>

      <div className={layoutStyles.main}>
        <div className={layoutStyles.header}>
          <Suspense fallback={<HeaderSkeleton />}>
            <AdminHeader />
          </Suspense>
        </div>

        <main className={layoutStyles.content} id="admin-content" tabIndex={-1}>
          <div
            className="sr-announce"
            aria-live="polite"
            aria-atomic="true"
            id="sr-live"
          />
          {children}
        </main>
      </div>
    </div>
  );
}
