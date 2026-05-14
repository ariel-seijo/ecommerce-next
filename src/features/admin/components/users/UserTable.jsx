"use client";

import { useState } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { updateUserRoleAction } from "@/features/admin/actions/userActions";
import { useToastStore } from "@/features/toast";
import ConfirmModal from "@/features/admin/components/ConfirmModal";
import UserActions from "./UserActions";
import styles from "./UserTable.module.css";

const SORTABLE_COLUMNS = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Fecha" },
  { key: "orders", label: "Órdenes" },
  { key: "lifetimeValue", label: "LTV" },
];

function SortIcon({ column, sort, order }) {
  if (sort !== column) {
    return <ArrowUp size={11} className={styles.sortIcon} aria-hidden="true" />;
  }
  return order === "asc" ? (
    <ArrowUp size={11} className={styles.sortIconActive} aria-hidden="true" />
  ) : (
    <ArrowDown size={11} className={styles.sortIconActive} aria-hidden="true" />
  );
}

function SortableTh({ col, sort, order, onSort, children }) {
  return (
    <th
      scope="col"
      className={styles.sortable}
      aria-sort={
        sort === col.key
          ? order === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      onClick={() => onSort?.(col.key)}
    >
      {children || col.label}
      <SortIcon column={col.key} sort={sort} order={order} />
    </th>
  );
}

function getStatusLabel(status, deletedAt) {
  if (deletedAt) return "Eliminado";
  if (status === "BANNED") return "Baneado";
  return "Activo";
}

function getStatusBadgeClass(status, deletedAt) {
  if (deletedAt) return "badge-danger";
  if (status === "BANNED") return "badge-danger";
  return "badge-success";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ROLES = [
  { value: "CUSTOMER", label: "Cliente" },
  { value: "ADMIN", label: "Admin" },
];

export default function UserTable({
  users,
  total,
  page,
  totalPages,
  sort = "createdAt",
  order = "desc",
  onSort,
  onPage,
  onViewOrders,
}) {
  const toast = useToastStore((s) => s.toast);
  const [roleLoading, setRoleLoading] = useState(null);
  const [roleConfirm, setRoleConfirm] = useState(null);

  function handleRoleChange(userId, newRole) {
    const user = users.find((u) => u.id === userId);
    setRoleConfirm({ userId, newRole, user });
  }

  async function handleRoleConfirm() {
    if (!roleConfirm) return;
    const { userId, newRole } = roleConfirm;
    setRoleLoading(userId);
    const result = await updateUserRoleAction(userId, newRole);
    setRoleLoading(null);
    setRoleConfirm(null);
    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(`Rol actualizado a ${ROLES.find((r) => r.value === newRole)?.label}`, "success");
    }
  }

  function handleRoleCancel() {
    setRoleConfirm(null);
  }

  if (!users || users.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <Users size={48} className={styles.emptyIcon} aria-hidden="true" />
        <p className={styles.emptyText}>No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Lista de usuarios" role="grid">
          <caption className="visually-hidden">
            Tabla de usuarios — {total} registros, página {page} de {totalPages}
          </caption>
          <thead className={styles.thead}>
            <tr>
              <SortableTh col={SORTABLE_COLUMNS[0]} sort={sort} order={order} onSort={onSort} />
              <SortableTh col={SORTABLE_COLUMNS[1]} sort={sort} order={order} onSort={onSort} />
              <SortableTh col={SORTABLE_COLUMNS[2]} sort={sort} order={order} onSort={onSort} />
              <SortableTh col={SORTABLE_COLUMNS[3]} sort={sort} order={order} onSort={onSort} />
              <SortableTh col={SORTABLE_COLUMNS[4]} sort={sort} order={order} onSort={onSort} />
              <th scope="col" className={styles.statusCol}>Estado</th>
              <th scope="col" className={styles.roleCol}>Rol</th>
              <th scope="col" className={styles.actionsCol}>
                <span className="visually-hidden">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isActive =
                !user.deletedAt && user.status === "ACTIVE";
              return (
                <tr
                  key={user.id}
                  className={`${styles.row} ${isActive ? styles.activeRow : ""}`}
                >
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.userName}>
                        {user.name || "—"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.userEmail}>{user.email}</span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td className={styles.ordersCell}>
                    {user._count?.orders ?? 0}
                  </td>
                  <td className={styles.ltvCell}>
                    <span
                      className={`${styles.ltvValue} ${(user.lifetimeValue || 0) === 0 ? styles.ltvZero : ""}`}
                    >
                      {formatPrice(user.lifetimeValue || 0)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(user.status, user.deletedAt)}`}>
                      {getStatusLabel(user.status, user.deletedAt)}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.roleSelect}
                      value={user.role}
                      disabled={roleLoading === user.id || !!user.deletedAt}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      aria-label={`Rol de ${user.email}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.actionsCell}>
                    <UserActions
                      user={user}
                      onViewOrders={onViewOrders}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---- MOBILE CARDS ---- */}
      <div className={styles.mobileCards}>
        {users.map((user) => {
          const isActive = !user.deletedAt && user.status === "ACTIVE";
          return (
            <article key={user.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>
                  {user.name || "Sin nombre"}
                </span>
                <span className={`badge ${getStatusBadgeClass(user.status, user.deletedAt)}`}>
                  {getStatusLabel(user.status, user.deletedAt)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Email</span>
                  <span className={styles.cardValue}>{user.email}</span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Fecha</span>
                  <span className={styles.cardValue}>
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>Órdenes</span>
                  <span className={styles.cardValue}>
                    {user._count?.orders ?? 0}
                  </span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>LTV</span>
                  <span className={styles.cardValue}>
                    {formatPrice(user.lifetimeValue || 0)}
                  </span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <select
                  className={styles.roleSelect}
                  value={user.role}
                  disabled={roleLoading === user.id || !!user.deletedAt}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  aria-label={`Rol de ${user.email}`}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <UserActions
                  user={user}
                  onViewOrders={onViewOrders}
                />
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              {total} usuarios — Página {page} de {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => onPage?.(page - 1)}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => {
                  if (totalPages <= 7) return true;
                  if (n === 1 || n === totalPages) return true;
                  if (Math.abs(n - page) <= 1) return true;
                  return false;
                })
                .map((n, idx, arr) => {
                  const showEllipsis = idx > 0 && n - arr[idx - 1] > 1;
                  return (
                    <span key={n} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                      {showEllipsis && (
                        <span className={styles.ellipsis} aria-hidden="true">…</span>
                      )}
                      <button
                        key={n}
                        className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                        onClick={() => onPage?.(n)}
                        aria-label={`Ir a página ${n}`}
                        aria-current={n === page ? "page" : undefined}
                      >
                        {n}
                      </button>
                    </span>
                  );
                })}
            </div>
            <button
              className={styles.pageBtn}
              onClick={() => onPage?.(page + 1)}
              disabled={page >= totalPages}
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      {roleConfirm && (
        <ConfirmModal
          isOpen
          title="Cambiar rol"
          message={
            roleConfirm.newRole === "ADMIN"
              ? `¿Convertir a "${roleConfirm.user?.email}" en Administrador? Tendrá acceso completo al panel.`
              : `¿Quitar permisos de administrador a "${roleConfirm.user?.email}"? Pasará a ser Cliente.`
          }
          onConfirm={handleRoleConfirm}
          onCancel={handleRoleCancel}
          isConfirming={!!roleLoading}
          confirmLabel={roleConfirm.newRole === "ADMIN" ? "Hacer Admin" : "Quitar Admin"}
          variant="primary"
        />
      )}
    </>
  );
}
