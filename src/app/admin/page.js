'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const products = await res.json();

        const totalProducts = products.length;
        const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sold, 0);
        const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
        const lowStock = products.filter((p) => p.stock < 10).length;

        setStats({
          totalProducts,
          totalRevenue,
          totalSold,
          lowStock,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner" role="status" aria-label="Cargando estadísticas">
        <span className="visually-hidden">Cargando panel de administración...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        <span aria-hidden="true">⚠</span> {error}
      </div>
    );
  }

  const statCards = [
    { label: 'Total productos', value: stats.totalProducts, icon: Package, color: '#007fff' },
    { label: 'Ingresos totales', value: `$${stats.totalRevenue.toLocaleString('es-AR')}`, icon: DollarSign, color: '#22c55e' },
    { label: 'Artículos vendidos', value: stats.totalSold, icon: TrendingUp, color: '#24abf3' },
    { label: 'Stock bajo', value: stats.lowStock, icon: ShoppingCart, color: '#ef4444' },
  ];

  return (
    <div>
      <h2 className="visually-hidden">Panel de control</h2>

      <div className="admin-stats">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="admin-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="admin-stat-label">{stat.label}</span>
                <Icon size={20} color={stat.color} aria-hidden="true" />
              </div>
              <div className="admin-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Acciones rápidas</h3>
        <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
          <Link href="/admin/products/new" className="btn btn-primary">
            Agregar nuevo producto
          </Link>
          <Link href="/admin/products" className="btn btn-secondary">
            Ver todos los productos
          </Link>
          <Link href="/admin/users" className="btn btn-secondary">
            Gestionar usuarios
          </Link>
        </div>
      </div>
    </div>
  );
}
