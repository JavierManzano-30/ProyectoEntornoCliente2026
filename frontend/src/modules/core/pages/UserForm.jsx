import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { createUser, updateUser } from '../services/coreService';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Save, X } from 'lucide-react';
import './UserForm.css';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, error } = useUser(id);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    rol: 'empleado',
    estado: 'activo',
    departamento: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || '',
        rol: user.rol || 'empleado',
        estado: user.estado || 'activo',
        departamento: user.departamento || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormError(null);
      
      if (id) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      
      navigate('/core/usuarios');
    } catch (err) {
      setFormError(err.message || 'Error al guardar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/core/usuarios');
  };

  if (loading && id) return <LoadingSpinner fullScreen />;
  if (error && id) return <ErrorMessage message={error} fullScreen />;

  return (
    <div className="user-form-page">
      <PageHeader
        title={id ? 'Editar Usuario' : 'Nuevo Usuario'}
        subtitle={id ? 'Modifica los datos del usuario' : 'Completa el formulario para crear un nuevo usuario'}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {formError && (
            <div className="form-error-message">
              {formError}
            </div>
          )}

          <div className="form-section">
            <h3 className="form-section-title">Información Personal</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos *</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Datos Laborales</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departamento">Departamento</label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rol">Rol *</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="empleado">Empleado</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              icon={X}
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Usuario'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default UserForm;
