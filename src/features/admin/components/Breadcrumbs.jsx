'use client';

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS = {
  admin: "Admin",
  products: "Productos",
  users: "Usuarios",
  orders: "Pedidos",
  settings: "Ajustes",
  new: "Nuevo",
};

function isIdSegment(segment) {
  return /^[a-z0-9]{15,}$/.test(segment) || /^\d+$/.test(segment);
}

function getLabel(parent, segment) {
  if (parent === "products" && isIdSegment(segment)) return "Editar";
  if (parent === "orders" && isIdSegment(segment)) return "Detalle";
  if (parent === "users" && isIdSegment(segment)) return "Editar";
  return LABELS[segment] || segment;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: getLabel(segments[i - 1] || "", seg),
    last: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Ruta de navegación" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", fontWeight: 600, color: "rgb(160, 160, 160)", flexShrink: 0, minWidth: 0 }}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          {i > 0 && <ChevronRight size={12} style={{ color: "rgb(80, 80, 80)", flexShrink: 0 }} />}
          <span
            style={{
              color: crumb.last ? "#e4e4e4" : "rgb(160, 160, 160)",
              fontWeight: crumb.last ? 700 : 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 160,
            }}
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
