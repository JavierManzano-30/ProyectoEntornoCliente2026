import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Users, UserPlus, TrendingUp, Building2, Search, Filter } from 'lucide-react';
import { getFullName, formatSalary, getYearsOfService } from '../utils/employeeHelpers';
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_COLORS } from '../constants/employeeStatus';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const {
    employees,
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
  } = useEmployees();

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

  const handleViewEmployee = (id) => {
    navigate(`/rrhh/empleados/${id}`);
  };

  const handleCreateEmployee = () => {
    navigate('/rrhh/empleados/nuevo');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando empleados..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    {
      label: 'Total Empleados',
      value: stats?.total || 0,
      icon: Users,
      color: 'blue',
      trend: `${stats?.active || 0} activos`,
    },
    {
      label: 'Nuevos del Mes',
      value: stats?.newThisMonth || 0,
      icon: UserPlus,
      color: 'green',
      trend: '+' + Math.round((stats?.newThisMonth / stats?.total || 0) * 100) + '%',
    },
    {
      label: 'Departamentos',
      value: Object.keys(stats?.byDepartment || {}).length,
      icon: Building2,
      color: 'purple',
      trend: 'activos',
    },
    {
      label: 'Salario Medio',
      value: formatSalary(stats?.averageSalary || 0),
      icon: TrendingUp,
      color: 'orange',
      trend: 'por empleado',
    },
  ];

  return (
    <div className="employee-list-page">
      <PageHeader
        title="Gestión de Empleados"
        subtitle="Administra los empleados de la empresa"
        actions={
          <Button 
            variant="primary" 
            icon={UserPlus}
            onClick={handleCreateEmployee}
          >
            Nuevo Empleado
          </Button>
        }
      />

      {/* Métricas */}
      <div className="employee-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} padding="medium" className="employee-metric-card">
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                  <p className="metric-trend">{metric.trend}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Búsqueda y filtros */}
      <Card padding="medium" className="employee-filters-card">
        <div className="filters-header">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o número de empleado..."
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
            Filtros {showFilters ? '▲' : '▼'}
          </Button>
        </div>

        {showFilters && (
          <div className="filters-grid">
            <div className="filter-item">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="suspended">Suspendido</option>
                <option value="on_leave">De Baja</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Departamento</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="">Todos</option>
                {Object.keys(stats?.byDepartment || {}).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Tabla de empleados */}
      <Card padding="none" className="employee-table-card">
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Empleado {sortConfig.sortBy === 'name' && (sortConfig.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Puesto</th>
                <th onClick={() => handleSort('department')} className="sortable">
                  Departamento {sortConfig.sortBy === 'department' && (sortConfig.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('hireDate')} className="sortable">
                  Fecha Ingreso {sortConfig.sortBy === 'hireDate' && (sortConfig.sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Antigüedad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr 
                    key={employee.id}
                    onClick={() => handleViewEmployee(employee.id)}
                    className="employee-row"
                  >
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </div>
                        <div className="employee-info">
                          <span className="employee-name">{getFullName(employee)}</span>
                          <span className="employee-email">{employee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{employee.position || '-'}</td>
                    <td>{employee.departmentName || 'Sin departamento'}</td>
                    <td>{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('es-ES') : '-'}</td>
                    <td>{getYearsOfService(employee.hireDate)} años</td>
                    <td>
                      <Badge variant={EMPLOYEE_STATUS_COLORS[employee.status]}>
                        {EMPLOYEE_STATUS_LABELS[employee.status]}
                      </Badge>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleViewEmployee(employee.id)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <p>No se encontraron empleados</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="table-pagination">
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

export default EmployeeList;
