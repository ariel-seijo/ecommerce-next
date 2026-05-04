'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import UserTable from '@/components/admin/UserTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import UserFormModal from '@/components/admin/UserFormModal';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(user) {
    setDeleteModal({ isOpen: true, user });
  }

  function handleEditClick(user) {
    setEditModal({ isOpen: true, user });
  }

  function handleAddClick() {
    setEditModal({ isOpen: true, user: null });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.user) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteModal.user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u.id !== deleteModal.user.id));
      setDeleteModal({ isOpen: false, user: null });
      setSuccess('Usuario eliminado exitosamente');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModal({ isOpen: false, user: null });
  }

  function handleFormClose() {
    setEditModal({ isOpen: false, user: null });
  }

  async function handleFormSubmit(formData) {
    try {
      let res;
      if (editModal.user) {
        res = await fetch(`/api/users/${editModal.user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      const savedUser = await res.json();

      if (editModal.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === savedUser.id ? savedUser : u))
        );
        setSuccess('Usuario actualizado exitosamente');
      } else {
        setUsers((prev) => [savedUser, ...prev]);
        setSuccess('Usuario creado exitosamente');
      }

      setEditModal({ isOpen: false, user: null });
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Usuarios ({users.length})</h3>
          <button className="btn btn-primary" onClick={handleAddClick}>
            <Plus size={16} />
            Agregar usuario
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <UserTable
          users={users}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          isDeleting={isDeleting}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar usuario"
        message={`¿Estás seguro de que deseas eliminar a "${deleteModal.user?.email}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isConfirming={isDeleting}
      />

      <UserFormModal
        isOpen={editModal.isOpen}
        user={editModal.user}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
