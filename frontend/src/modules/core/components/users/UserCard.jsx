import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getFullName, getInitials } from '../../utils/userHelpers';
import { USER_STATUS_LABELS, USER_STATUS_COLORS } from '../../constants/userStatus';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '../../constants/userRoles';
import './UserCard.css';

const UserCard = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={() => onClick && onClick(user.id)}>
      <div className="user-card-header">
        <div className="user-card-avatar">
          {getInitials(user)}
        </div>
        <div className="user-card-info">
          <h3 className="user-card-name">{getFullName(user)}</h3>
          <p className="user-card-email">{user.email}</p>
        </div>
        <Badge variant={USER_STATUS_COLORS[user.estado]}>
          {USER_STATUS_LABELS[user.estado]}
        </Badge>
      </div>
      
      <div className="user-card-details">
        <div className="user-card-detail">
          <span className="detail-label">Rol</span>
          <Badge variant={USER_ROLE_COLORS[user.rol]} size="small">
            {USER_ROLE_LABELS[user.rol]}
          </Badge>
        </div>
        <div className="user-card-detail">
          <span className="detail-label">Departamento</span>
          <span className="detail-value">{user.departamento || 'Sin departamento'}</span>
        </div>
        <div className="user-card-detail">
          <span className="detail-label">Teléfono</span>
          <span className="detail-value">{user.telefono || 'No especificado'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
