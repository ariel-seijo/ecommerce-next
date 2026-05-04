'use client';

import { Edit, Trash2, Mail } from 'lucide-react';

export default function UserTable({ users, onDelete, onEdit, isDeleting }) {
  if (users.length === 0) {
    return (
      <div className="table-empty" role="status">
        <Mail size={48} className="table-empty-icon" aria-hidden="true" />
        <p className="table-empty-text">No se encontraron usuarios</p>
      </div>
    );
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="table-container">
      <table className="admin-table" aria-label="Lista de usuarios">
        <caption className="visually-hidden">Tabla de usuarios con {users.length} registros</caption>
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col">Creado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <span style={{ fontWeight: 700, color: 'var(--admin-text)' }}>
                  {user.email}
                </span>
              </td>
              <td>
                <span
                  className={`table-badge ${
                    user.role === 'admin'
                      ? 'table-badge-success'
                      : 'table-badge-warning'
                  }`}
                >
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </td>
              <td style={{ color: 'var(--admin-text-light)', fontSize: '13px' }}>
                {formatDate(user.createdAt)}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(user)}
                    aria-label={`Editar usuario ${user.email}`}
                  >
                    <Edit size={14} aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(user)}
                    disabled={isDeleting}
                    aria-label={`Eliminar usuario ${user.email}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
