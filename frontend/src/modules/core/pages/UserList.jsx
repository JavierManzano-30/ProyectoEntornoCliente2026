import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Users as UsersIcon, UserPlus, Search, Filter, Mail, Phone } from 'lucide-react';
import { getFullName, getInitials, formatLastAccess } from '../utils/userHelpers';
import { USER_STATUS_LABELS, USER_STATUS_COLORS } from '../constants/userStatus';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '../constants/userRoles';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    handlePageChange,
    handleSearch,
    handleSort,
    sortConfig,
    stats,
    refetch,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleViewUser = (id) => {
    navigate(`/core/usuarios/${id}`);
  };

  const handleCreateUser = () => {
    navigate('/core/usuarios/nuevo');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando usuarios..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    {
      label: 'Total Usuarios',
      value: stats?.total || 0,
      icon: UsersIcon,
      color: 'blue',
      trend: `${stats?.active || 0} activos`,
    },
    {
      label: 'Nuevos del Mes',
      value: stats?.newThisMonth || 0,
      icon: UserPlus,
      color: 'green',
      trend: '+' + Math.round(((stats?.newThisMonth || 0) / (stats?.total || 1)) * 100) + '%',
    },
    {
      label: 'Administradores',
      value: stats?.byRole?.admin || 0,
      icon: UsersIcon,
      color: 'red',
      trend: 'con acceso total',
    },
    {
      label: 'Managers',
      value: stats?.byRole?.manager || 0,
      icon: UsersIcon,
      color: 'purple',
      trend: 'gestores',
    },
  ];

  return (
    <div className="user-list-page">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
        actions={
          <Button 
            variant="primary" 
            icon={UserPlus}
            onClick={handleCreateUser}
          >
            Nuevo Usuario
          </Button>
        }
      />

      {/* Métricas */}
      <div className="user-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} padding="medium" className="metric-card">
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-trend">{metric.trend}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Barra de búsqueda y filtros */}
      <Card padding="medium" className="search-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Rol</label>
              <select
                value={filters.rol}
                onChange={(e) => handleFilterChange('rol', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">Administrador</option>
                <option value="manager">Manager</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Estado</label>
              <select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setFilters({ search: '', rol: '', estado: '', departamento: '' });
                setSearchTerm('');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Listado de usuarios */}
      <Card>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Usuario
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Contacto
                </th>
                <th onClick={() => handleSort('rol')} className="sortable">
                  Rol
                </th>
                <th onClick={() => handleSort('estado')} className="sortable">
                  Estado
                </th>
                <th>Departamento</th>
                <th onClick={() => handleSort('ultimoAcceso')} className="sortable">
                  Último acceso
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} onClick={() => handleViewUser(user.id)}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {getInitials(user)}
                      </div>
                      <span className="user-name">{getFullName(user)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      {user.telefono && (
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{user.telefono}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge variant={USER_ROLE_COLORS[user.rol]} size="small">
                      {USER_ROLE_LABELS[user.rol]}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={USER_STATUS_COLORS[user.estado]} size="small">
                      {USER_STATUS_LABELS[user.estado]}
                    </Badge>
                  </td>
                  <td>{user.departamento || '-'}</td>
                  <td>{formatLastAccess(user.ultimoAcceso)}</td>
                  <td>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(user.id);
                      }}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <UsersIcon size={48} />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <Button
              variant="secondary"
              size="small"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Anterior
            </Button>
            <span className="pagination-info">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="small"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserList;
