import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import '@/styles/admin/dashboard.css';
import '@/styles/admin/forms.css';
import '@/styles/admin/table.css';

export const metadata = {
  title: 'Admin Dashboard | E-Commerce',
  description: 'Panel de administración para gestionar tu tienda online',
};

export default function AdminLayout({ children }) {
  return (
    <>
      <a href="#admin-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="admin-layout" role="application" aria-label="Panel de administración">
        <Sidebar />
        <div className="admin-main">
          <Header />
          <main className="admin-content" id="admin-content" tabIndex={-1}>
            <div className="sr-announce" aria-live="polite" aria-atomic="true" id="sr-live" />

            {children}
          </main>
        </div>
      </div>
    </>
  );
}
