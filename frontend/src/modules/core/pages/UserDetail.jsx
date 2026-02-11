import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Edit, Mail, Phone, Calendar, User, Shield } from 'lucide-react';
import { getFullName, getInitials, formatLastAccess } from '../utils/userHelpers';
import { USER_STATUS_LABELS, USER_STATUS_COLORS } from '../constants/userStatus';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '../constants/userRoles';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, error, refetch } = useUser(id);
  const [activeTab, setActiveTab] = useState('general');

  const handleEdit = () => {
    navigate(`/core/usuarios/${id}/editar`);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando usuario..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;
  if (!user) return <ErrorMessage message="Usuario no encontrado" fullScreen />;

  return (
    <div className="user-detail-page">
      <PageHeader
        title={getFullName(user)}
        subtitle={USER_ROLE_LABELS[user.rol]}
        actions={
          <Button variant="primary" icon={Edit} onClick={handleEdit}>
            Editar
          </Button>
        }
      />

      {/* Cabecera del usuario */}
      <Card padding="large" className="user-header-card">
        <div className="user-header-content">
          <div className="user-avatar-large">
            {getInitials(user)}
          </div>
          <div className="user-header-info">
            <h2>{getFullName(user)}</h2>
            <p className="user-email">{user.email}</p>
            <Badge variant={USER_STATUS_COLORS[user.estado]}>
              {USER_STATUS_LABELS[user.estado]}
            </Badge>
          </div>
          <div className="user-header-stats">
            <div className="header-stat">
              <Shield size={20} />
              <div>
                <span className="stat-label">Rol</span>
                <span className="stat-value">{USER_ROLE_LABELS[user.rol]}</span>
              </div>
            </div>
            <div className="header-stat">
              <Calendar size={20} />
              <div>
                <span className="stat-label">Último acceso</span>
                <span className="stat-value">{formatLastAccess(user.ultimoAcceso)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pestañas */}
      <div className="user-tabs">
        <button
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Información General
        </button>
        <button
          className={`tab-button ${activeTab === 'permisos' ? 'active' : ''}`}
          onClick={() => setActiveTab('permisos')}
        >
          Permisos y Accesos
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="user-tab-content">
        {activeTab === 'general' && (
          <Card padding="large">
            <h3 className="section-title">Datos Personales</h3>
            <div className="info-grid">
              <div className="info-item">
                <User size={18} />
                <div>
                  <span className="info-label">Nombre completo</span>
                  <span className="info-value">{getFullName(user)}</span>
                </div>
              </div>

              <div className="info-item">
                <Mail size={18} />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>

              <div className="info-item">
                <Phone size={18} />
                <div>
                  <span className="info-label">Teléfono</span>
                  <span className="info-value">{user.telefono || 'No especificado'}</span>
                </div>
              </div>

              <div className="info-item">
                <User size={18} />
                <div>
                  <span className="info-label">Departamento</span>
                  <span className="info-value">{user.departamento || 'Sin departamento'}</span>
                </div>
              </div>

              <div className="info-item">
                <Calendar size={18} />
                <div>
                  <span className="info-label">Fecha de registro</span>
                  <span className="info-value">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <Shield size={18} />
                <div>
                  <span className="info-label">Estado</span>
                  <Badge variant={USER_STATUS_COLORS[user.estado]}>
                    {USER_STATUS_LABELS[user.estado]}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'permisos' && (
          <Card padding="large">
            <h3 className="section-title">Permisos y Accesos</h3>
            <div className="permissions-section">
              <div className="permission-item">
                <Shield size={20} />
                <div>
                  <strong>Rol asignado</strong>
                  <p>
                    <Badge variant={USER_ROLE_COLORS[user.rol]}>
                      {USER_ROLE_LABELS[user.rol]}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="permission-info">
                Los permisos específicos del usuario están determinados por su rol.
                Para modificar permisos, cambia el rol del usuario o gestiona los roles del sistema.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
