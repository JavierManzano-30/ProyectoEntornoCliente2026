import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getCompanyInitials, formatEmployeeCount } from '../../utils/companyHelpers';
import './CompanyCard.css';

const CompanyCard = ({ company, onClick }) => {
  return (
    <div className="company-card" onClick={() => onClick && onClick(company.id)}>
      <div className="company-card-header">
        <div className="company-card-logo">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.nombre} />
          ) : (
            getCompanyInitials(company)
          )}
        </div>
        <div className="company-card-info">
          <h3 className="company-card-name">{company.nombre}</h3>
          <p className="company-card-cif">{company.cif}</p>
        </div>
        <Badge variant={company.estado === 'activa' ? 'green' : 'gray'}>
          {company.estado === 'activa' ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>
      
      <div className="company-card-details">
        <div className="company-card-detail">
          <span className="detail-label">Sector</span>
          <span className="detail-value">{company.sector || 'No especificado'}</span>
        </div>
        <div className="company-card-detail">
          <span className="detail-label">Ciudad</span>
          <span className="detail-value">{company.ciudad || 'No especificada'}</span>
        </div>
        <div className="company-card-detail">
          <span className="detail-label">Empleados</span>
          <span className="detail-value">{formatEmployeeCount(company.numeroEmpleados)}</span>
        </div>
        <div className="company-card-detail">
          <span className="detail-label">Email</span>
          <span className="detail-value">{company.email}</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
