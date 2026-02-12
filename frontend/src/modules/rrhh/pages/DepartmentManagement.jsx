import React, { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Plus, Edit, Trash2, Users, Building2 } from 'lucide-react';
import './DepartmentManagement.css';

const INITIAL_FORM = {
  name: '',
  parentId: '',
  active: true,
};

const DepartmentManagement = () => {
  const {
    departments,
    departmentTree,
    loading,
    error,
    processing,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch,
  } = useDepartments();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const openCreateModal = () => {
    setEditingDepartment(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setFormErrorMessage('');
    setShowCreateModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      parentId: department.parentId || '',
      active: department.active !== false,
    });
    setFormErrors({});
    setFormErrorMessage('');
    setShowCreateModal(true);
  };

  const closeModal = () => {
    if (processing) return;
    setShowCreateModal(false);
    setEditingDepartment(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setFormErrorMessage('');
  };

  const handleFormChange = (field) => (event) => {
    const value = field === 'active' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
    setFormErrorMessage('');
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'El nombre es obligatorio';
    }

    if (
      editingDepartment &&
      formData.parentId &&
      String(formData.parentId) === String(editingDepartment.id)
    ) {
      nextErrors.parentId = 'Un departamento no puede ser su propio padre';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitDepartment = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        parentId: formData.parentId || null,
        active: formData.active,
      };

      if (editingDepartment) {
        await handleUpdate(editingDepartment.id, payload);
      } else {
        await handleCreate(payload);
      }

      closeModal();
    } catch (err) {
      setFormErrorMessage(err.response?.data?.error?.message || err.message || 'No se pudo guardar el departamento');
    }
  };

  const onDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el departamento "${name}"?`)) {
      try {
        await handleDelete(id);
      } catch (err) {
        alert('Error al eliminar el departamento: ' + err.message);
      }
    }
  };

  const renderDepartmentNode = (dept) => {
    return (
      <div key={dept.id} className="department-node">
        <Card padding="medium" className="department-card">
          <div className="department-card-content">
            <div className="department-info">
              <Building2 size={20} />
              <div>
                <h4>{dept.name}</h4>
                <p className="department-description">{dept.description || 'Sin descripción'}</p>
              </div>
            </div>
            <div className="department-stats">
              <span className="stat-item">
                <Users size={16} />
                {dept.employeeCount || 0} empleados
              </span>
            </div>
            <div className="department-actions">
              <Button
                variant="secondary"
                size="small"
                icon={Edit}
                onClick={() => openEditModal(dept)}
              >
                Editar
              </Button>
              <Button
                variant="error"
                size="small"
                icon={Trash2}
                onClick={() => onDelete(dept.id, dept.name)}
                disabled={processing}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
        {dept.children && dept.children.length > 0 && (
          <div className="department-children">
            {dept.children.map(child => renderDepartmentNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando departamentos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="department-management-page">
      <PageHeader
        title="Gestión de Departamentos"
        subtitle="Administra la estructura organizativa de la empresa"
        actions={
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={openCreateModal}
          >
            Nuevo Departamento
          </Button>
        }
      />

      {/* Estadísticas */}
      <div className="department-stats-grid">
        <Card padding="medium">
          <div className="stat-card">
            <Building2 size={32} />
            <div>
              <p className="stat-value">{departments.length}</p>
              <p className="stat-label">Departamentos Totales</p>
            </div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="stat-card">
            <Users size={32} />
            <div>
              <p className="stat-value">
                {departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0)}
              </p>
              <p className="stat-label">Empleados Asignados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Árbol de departamentos */}
      <div className="departments-tree">
        {departmentTree.length > 0 ? (
          departmentTree.map(dept => renderDepartmentNode(dept))
        ) : (
          <Card padding="large">
            <div className="empty-state">
              <Building2 size={48} />
              <p>No hay departamentos creados</p>
              <Button 
                variant="primary" 
                onClick={openCreateModal}
              >
                Crear Primer Departamento
              </Button>
            </div>
          </Card>
        )}
      </div>

      {showCreateModal && (
        <div className="department-modal-overlay" onClick={closeModal}>
          <div className="department-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editingDepartment ? 'Editar Departamento' : 'Nuevo Departamento'}</h3>

            <form onSubmit={handleSubmitDepartment} className="department-form">
              {formErrorMessage && (
                <div className="department-form-error">{formErrorMessage}</div>
              )}

              <div className="department-form-group">
                <label htmlFor="department-name">Nombre *</label>
                <input
                  id="department-name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  disabled={processing}
                />
                {formErrors.name && <p className="department-field-error">{formErrors.name}</p>}
              </div>

              <div className="department-form-group">
                <label htmlFor="department-parent">Departamento padre</label>
                <select
                  id="department-parent"
                  value={formData.parentId}
                  onChange={handleFormChange('parentId')}
                  disabled={processing}
                >
                  <option value="">Ninguno</option>
                  {departments
                    .filter((department) => !editingDepartment || String(department.id) !== String(editingDepartment.id))
                    .map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                </select>
                {formErrors.parentId && <p className="department-field-error">{formErrors.parentId}</p>}
              </div>

              <div className="department-form-group department-checkbox-group">
                <label htmlFor="department-active" className="department-checkbox-label">
                  <input
                    id="department-active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleFormChange('active')}
                    disabled={processing}
                  />
                  <span>Departamento activo</span>
                </label>
              </div>

              <div className="department-form-actions">
                <Button type="button" variant="secondary" onClick={closeModal} disabled={processing}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={processing}>
                  {editingDepartment ? 'Guardar Cambios' : 'Crear Departamento'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
