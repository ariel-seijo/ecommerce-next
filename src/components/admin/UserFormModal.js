'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function UserFormModal({ isOpen, user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'customer',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        role: user.role || 'customer',
        password: '',
      });
    } else {
      setFormData({
        email: '',
        role: 'customer',
        password: '',
      });
    }
    setErrors({});
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!user && !formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es obligatorio';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (!isSubmitting) {
      onClose();
    }
  }

  if (!isOpen) return null;

  const errorId = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <div className="modal-overlay" onClick={handleClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <div className="modal-header">
          <h3 className="modal-title" id="user-form-title">
            {user ? 'Editar usuario' : 'Crear usuario'}
          </h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Cerrar formulario"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="user-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="user-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="usuario@ejemplo.com"
              disabled={isSubmitting}
              ref={firstInputRef}
              aria-invalid={!!errors.email}
              aria-describedby={errorId('email')}
              autoComplete="email"
            />
            {errors.email && <span className="form-error" id="email-error" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="user-role" className="form-label">
              Rol
            </label>
            <select
              id="user-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`form-select ${errors.role ? 'form-input-error' : ''}`}
              disabled={isSubmitting}
              aria-invalid={!!errors.role}
              aria-describedby={errorId('role')}
            >
              <option value="customer">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && <span className="form-error" id="role-error" role="alert">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="user-password" className="form-label">
              Contraseña {user && <span style={{ color: 'var(--admin-muted)', fontSize: '12px' }}>(dejar vacío para mantener la actual)</span>}
            </label>
            <input
              type="password"
              id="user-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="Mínimo 6 caracteres"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errorId('password')}
              autoComplete="new-password"
            />
            {errors.password && <span className="form-error" id="password-error" role="alert">{errors.password}</span>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : user ? 'Actualizar usuario' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
