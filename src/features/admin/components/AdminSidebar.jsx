'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Menu, X } from "lucide-react";

const navItems = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Ajustes', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-controls="admin-sidebar"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`admin-sidebar ${mobileOpen ? "open" : ""}`}
        aria-label="Navegación principal"
      >
        <div className="admin-sidebar-logo">
          <h1>ElectroShop</h1>
          <span>Panel de Administración</span>
        </div>

        <nav aria-label="Administración">
          <ul className="admin-nav" role="list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`admin-nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon aria-hidden="true" size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid var(--admin-border)", flexShrink: 0 }}>
          <span style={{ fontSize: "0.65rem", color: "var(--admin-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
            v1.0.0
          </span>
        </div>
      </aside>
    </>
  );
}
