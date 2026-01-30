import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Edit, Mail, Phone, MapPin, Users, Building2 } from 'lucide-react';
import { getCompanyInitials, formatAddress, formatEmployeeCount } from '../utils/companyHelpers';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, users, loading, error, refetch } = useCompany(id);

  if (loading) return <LoadingSpinner fullScreen text="Cargando empresa..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;
  if (!company) return <ErrorMessage message="Empresa no encontrada" fullScreen />;

  return (
    <div className="company-detail-page">
      <PageHeader
        title={company.nombre}
        subtitle={company.cif}
        actions={
          <Button variant="primary" icon={Edit} onClick={() => navigate(`/core/empresas/${id}/editar`)}>
            Editar
          </Button>
        }
      />

      <Card padding="large" className="company-header-card">
        <div className="company-header-content">
          <div className="company-logo-large">
            {company.logoUrl ? <img src={company.logoUrl} alt={company.nombre} /> : getCompanyInitials(company)}
          </div>
          <div className="company-header-info">
            <h2>{company.nombre}</h2>
            <p className="company-cif">{company.cif}</p>
            <Badge variant={company.estado === 'activa' ? 'green' : 'gray'}>
              {company.estado === 'activa' ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
          <div className="company-header-stats">
            <div className="header-stat">
              <Users size={20} />
              <div>
                <span className="stat-label">Empleados</span>
                <span className="stat-value">{company.numeroEmpleados || 0}</span>
              </div>
            </div>
            <div className="header-stat">
              <Building2 size={20} />
              <div>
                <span className="stat-label">Usuarios</span>
                <span className="stat-value">{users.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="company-details-grid">
        <Card padding="large">
          <h3>Información de Contacto</h3>
          <div className="info-grid">
            <div className="info-item">
              <Mail size={18} />
              <div>
                <span className="info-label">Email</span>
                <span className="info-value">{company.email}</span>
              </div>
            </div>
            <div className="info-item">
              <Phone size={18} />
              <div>
                <span className="info-label">Teléfono</span>
                <span className="info-value">{company.telefono}</span>
              </div>
            </div>
            <div className="info-item">
              <MapPin size={18} />
              <div>
                <span className="info-label">Dirección</span>
                <span className="info-value">{formatAddress(company)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="large">
          <h3>Información Empresarial</h3>
          <div className="info-grid">
            <div className="info-item">
              <Building2 size={18} />
              <div>
                <span className="info-label">Sector</span>
                <span className="info-value">{company.sector || 'No especificado'}</span>
              </div>
            </div>
            <div className="info-item">
              <Users size={18} />
              <div>
                <span className="info-label">Número de empleados</span>
                <span className="info-value">{formatEmployeeCount(company.numeroEmpleados)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetail;
