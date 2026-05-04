'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/useAuthStore';

const pageTitles = {
  '/admin': 'Panel',
  '/admin/products': 'Productos',
  '/admin/products/new': 'Nuevo Producto',
  '/admin/users': 'Usuarios',
  '/admin/orders': 'Pedidos',
  '/admin/settings': 'Ajustes',
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const title = pageTitles[pathname] || 'Panel';

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="admin-header" role="banner">
      <h2 className="admin-header-title" id="admin-heading">{title}</h2>
      <div className="admin-header-actions">
        <span className="user-email" aria-label={`Conectado como ${user?.email}`}>
          {user?.email}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} aria-hidden="true" />
          Salir
        </button>
      </div>
    </header>
  );
}
