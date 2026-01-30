import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '../hooks/useCompanies';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import CompanyCard from '../components/companies/CompanyCard';
import { Building2, Plus, Search, LayoutGrid, List } from 'lucide-react';
import './CompanyList.css';

const CompanyList = () => {
  const navigate = useNavigate();
  const { companies, loading, error, handleSearch, stats, refetch } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando empresas..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    { label: 'Total Empresas', value: stats?.total || 0, icon: Building2, color: 'blue' },
    { label: 'Empresas Activas', value: stats?.active || 0, icon: Building2, color: 'green' },
    { label: 'Total Empleados', value: stats?.totalEmployees || 0, icon: Building2, color: 'purple' },
    { label: 'Promedio Empleados', value: stats?.avgEmployees || 0, icon: Building2, color: 'orange' },
  ];

  return (
    <div className="company-list-page">
      <PageHeader
        title="Gestión de Empresas"
        subtitle="Administra las empresas del sistema"
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/core/empresas/nuevo')}>
            Nueva Empresa
          </Button>
        }
      />

      {/* Métricas */}
      <div className="company-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} padding="medium">
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Búsqueda y vista */}
      <Card padding="medium" className="search-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o CIF..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </Card>

      {/* Listado de empresas */}
      <div className={`companies-container ${viewMode}`}>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={(id) => navigate(`/core/empresas/${id}`)}
          />
        ))}

        {companies.length === 0 && (
          <div className="empty-state">
            <Building2 size={48} />
            <p>No se encontraron empresas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
