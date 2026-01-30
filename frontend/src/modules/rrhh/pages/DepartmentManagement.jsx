import React, { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Plus, Edit, Trash2, Users, Building2 } from 'lucide-react';
import './DepartmentManagement.css';

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

  const onDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar el departamento "${name}"?`)) {
      try {
        await handleDelete(id);
      } catch (err) {
        alert('Error al eliminar el departamento: ' + err.message);
      }
    }
  };

  const renderDepartmentNode = (dept, level = 0) => {
    return (
      <div key={dept.id} className="department-node" style={{ marginLeft: `${level * 30}px` }}>
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
                onClick={() => setEditingDepartment(dept)}
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
            {dept.children.map(child => renderDepartmentNode(child, level + 1))}
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
            onClick={() => setShowCreateModal(true)}
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
                onClick={() => setShowCreateModal(true)}
              >
                Crear Primer Departamento
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
