import React from 'react';
import Badge from '../../../../components/common/Badge';
import { Shield } from 'lucide-react';
import './RoleCard.css';

const RoleCard = ({ role, onClick }) => {
  return (
    <div className="role-card" onClick={() => onClick && onClick(role.id)}>
      <div className="role-card-header">
        <div className="role-card-icon">
          <Shield size={24} />
        </div>
        <div className="role-card-info">
          <h3 className="role-card-name">{role.nombre}</h3>
          <p className="role-card-description">{role.descripcion}</p>
        </div>
      </div>
      
      <div className="role-card-details">
        <div className="role-card-stat">
          <span className="stat-value">{role.usuariosAsignados}</span>
          <span className="stat-label">Usuarios</span>
        </div>
        <div className="role-card-stat">
          <span className="stat-value">{role.permisos.length}</span>
          <span className="stat-label">Permisos</span>
        </div>
        <div className="role-card-badge">
          {role.editable ? (
            <Badge variant="blue" size="small">Personalizable</Badge>
          ) : (
            <Badge variant="gray" size="small">Sistema</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
