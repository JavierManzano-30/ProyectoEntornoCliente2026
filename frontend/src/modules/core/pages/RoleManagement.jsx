import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoles } from '../hooks/useRoles';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import RoleCard from '../components/roles/RoleCard';
import { Plus, Shield, Users, Lock, Search } from 'lucide-react';
import './RoleManagement.css';

const RoleManagement = () => {
  const navigate = useNavigate();
  const { roles, stats, loading, error, refetch } = useRoles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(role =>
    role.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen text="Cargando roles..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="role-management-page">
      <PageHeader
        title="Gestión de Roles"
        subtitle="Administra roles y permisos del sistema"
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/core/roles/nuevo')}>
            Nuevo Rol
          </Button>
        }
      />

      <div className="role-metrics">
        <Card padding="medium">
          <div className="metric-icon blue">
            <Shield size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.totalRoles}</span>
            <span className="metric-label">Total Roles</span>
          </div>
        </Card>

        <Card padding="medium">
          <div className="metric-icon green">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.totalUsuarios}</span>
            <span className="metric-label">Usuarios Asignados</span>
          </div>
        </Card>

        <Card padding="medium">
          <div className="metric-icon purple">
            <Lock size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.permisosTotales}</span>
            <span className="metric-label">Permisos Totales</span>
          </div>
        </Card>

        <Card padding="medium">
          <div className="metric-icon orange">
            <Shield size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-value">{stats.rolesEditables}</span>
            <span className="metric-label">Roles Personalizados</span>
          </div>
        </Card>
      </div>

      <Card padding="large">
        <div className="roles-header">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRoles.length === 0 ? (
          <div className="empty-state">
            <Shield size={48} />
            <h3>No se encontraron roles</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="roles-grid">
            {filteredRoles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                onClick={() => navigate(`/core/roles/${role.id}`)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RoleManagement;
