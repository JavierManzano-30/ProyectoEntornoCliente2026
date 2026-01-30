import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Card from '../../../components/common/Card';
import { Users, Building2, UserPlus, Activity, TrendingUp, Clock } from 'lucide-react';
import { formatLastAccess } from '../utils/userHelpers';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, stats, loading, error, refetch } = useDashboard();

  if (loading) return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const metrics = [
    {
      label: 'Total Usuarios',
      value: stats?.totalUsuarios || 0,
      icon: Users,
      color: 'blue',
      trend: `${stats?.usuariosActivos || 0} activos`,
      link: '/core/usuarios',
    },
    {
      label: 'Nuevos del Mes',
      value: stats?.usuariosNuevos || 0,
      icon: UserPlus,
      color: 'green',
      trend: '+' + Math.round(((stats?.usuariosNuevos || 0) / (stats?.totalUsuarios || 1)) * 100) + '%',
      link: '/core/usuarios',
    },
    {
      label: 'Total Empresas',
      value: stats?.totalEmpresas || 0,
      icon: Building2,
      color: 'purple',
      trend: `${stats?.empresasActivas || 0} activas`,
      link: '/core/empresas',
    },
    {
      label: 'Sesiones Activas',
      value: stats?.sesionesActivas || 0,
      icon: Activity,
      color: 'orange',
      trend: 'En tiempo real',
    },
  ];

  const activityTypeIcons = {
    user: Users,
    company: Building2,
    role: Activity,
    login: Activity,
  };

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard de Administración"
        subtitle="Panel de control y métricas del sistema"
      />

      {/* Métricas principales */}
      <div className="dashboard-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={index} 
              padding="medium" 
              className={`dashboard-metric-card ${metric.link ? 'clickable' : ''}`}
              onClick={() => metric.link && navigate(metric.link)}
            >
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={28} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-trend">
                    <TrendingUp size={14} />
                    {metric.trend}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Actividad reciente */}
      <div className="dashboard-content">
        <Card padding="large">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={20} />
              Actividad Reciente
            </h2>
          </div>
          
          <div className="activity-list">
            {dashboardData?.actividadReciente?.length > 0 ? (
              dashboardData.actividadReciente.map(activity => {
                const ActivityIcon = activityTypeIcons[activity.tipo] || Activity;
                return (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-icon-${activity.tipo}`}>
                      <ActivityIcon size={16} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.usuario}</strong> {activity.accion}
                      </div>
                      <div className="activity-time">
                        {formatLastAccess(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="activity-empty">
                <Activity size={48} />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </Card>

        {/* Accesos rápidos */}
        <Card padding="large">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={20} />
              Accesos Rápidos
            </h2>
          </div>
          
          <div className="quick-actions">
            <button className="quick-action" onClick={() => navigate('/core/usuarios/nuevo')}>
              <div className="quick-action-icon quick-action-icon-blue">
                <UserPlus size={24} />
              </div>
              <span className="quick-action-label">Nuevo Usuario</span>
            </button>
            
            <button className="quick-action" onClick={() => navigate('/core/empresas/nuevo')}>
              <div className="quick-action-icon quick-action-icon-purple">
                <Building2 size={24} />
              </div>
              <span className="quick-action-label">Nueva Empresa</span>
            </button>
            
            <button className="quick-action" onClick={() => navigate('/core/usuarios')}>
              <div className="quick-action-icon quick-action-icon-green">
                <Users size={24} />
              </div>
              <span className="quick-action-label">Ver Usuarios</span>
            </button>
            
            <button className="quick-action" onClick={() => navigate('/core/roles')}>
              <div className="quick-action-icon quick-action-icon-orange">
                <Activity size={24} />
              </div>
              <span className="quick-action-label">Gestionar Roles</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
