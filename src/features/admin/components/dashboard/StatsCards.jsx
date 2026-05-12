"use client";

import { DollarSign, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import styles from "./StatsCards.module.css";

const STATS_CONFIG = [
  {
    key: "totalRevenue",
    label: "Ingresos Totales",
    icon: DollarSign,
    color: "#00e5ff",
    format: (v) => formatPrice(v),
    trendKey: "revenueGrowth",
  },
  {
    key: "totalOrders",
    label: "Órdenes",
    icon: ShoppingCart,
    color: "#ff00ff",
    format: (v) => String(v),
    trendKey: "ordersGrowth",
  },
  {
    key: "totalUsers",
    label: "Usuarios",
    icon: Users,
    color: "#ffd600",
    format: (v) => String(v),
    trendKey: "usersGrowth",
  },
  {
    key: "lowStockCount",
    label: "Stock Crítico",
    icon: AlertTriangle,
    color: "#22c55e",
    format: (v) => String(v),
    trendKey: null,
    isLowStock: true,
  },
];

export default function StatsCards({ data }) {
  return (
    <div className={styles.grid}>
      {STATS_CONFIG.map((stat) => {
        const Icon = stat.icon;
        const value = data?.[stat.key] ?? 0;
        const trend = stat.trendKey ? data?.[stat.trendKey] : null;
        const isLowStock = stat.isLowStock && value > 0;
        const color = isLowStock ? "#ef4444" : stat.color;
        const formattedValue = stat.format(value);

        const isPositiveTrend = trend > 0;
        const isNegativeTrend = trend < 0;

        const isMono = stat.key === "totalRevenue";

        return (
          <article
            key={stat.key}
            className={styles.card}
            style={{ "--accent-color": color }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.label}>{stat.label}</span>
              <Icon size={20} color={color} aria-hidden="true" />
            </div>
            <p
              className={styles.value}
              style={{ color }}
              data-mono={isMono ? "true" : undefined}
            >
              {formattedValue}
            </p>
            {trend !== null && (
              <div
                className={styles.trend}
                data-positive={isPositiveTrend}
                data-negative={isNegativeTrend}
              >
                <span>{isPositiveTrend ? "▲" : isNegativeTrend ? "▼" : "–"}</span>
                <span className={styles.trendValue}>{Math.abs(trend)}%</span>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}