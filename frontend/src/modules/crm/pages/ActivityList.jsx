import React, { useMemo, useState } from 'react';
import { CheckCircle2, Activity as ActivityIcon, RefreshCw, Search, Clock, AlertTriangle } from 'lucide-react';
import CRMHeader from '../components/common/CRMHeader';
import ActivityTypeIcon from '../components/common/ActivityTypeIcon';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useActivities } from '../hooks/useActivities';
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_COLORS } from '../constants/activityTypes';
import { calculateActivityStats, getOverdueActivities, getUpcomingActivities } from '../utils/activityHelpers';
import './ActivityList.css';

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ActivityList = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const {
    activities,
    allActivities,
    loading,
    error,
    refetch,
    completeActivity,
  } = useActivities();

  const filteredActivities = useMemo(() => {
    const term = search.trim().toLowerCase();
    return activities.filter((activity) => {
      const matchSearch =
        !term ||
        activity.titulo?.toLowerCase().includes(term) ||
        activity.descripcion?.toLowerCase().includes(term) ||
        activity.cliente?.nombre?.toLowerCase().includes(term) ||
        activity.oportunidad?.nombre?.toLowerCase().includes(term);
      const matchType = !type || activity.tipo === type;
      const matchStatus = !status || activity.estado === status;
      return matchSearch && matchType && matchStatus;
    });
  }, [activities, search, type, status]);

  const stats = useMemo(() => calculateActivityStats(allActivities), [allActivities]);
  const overdueCount = useMemo(() => getOverdueActivities(allActivities).length, [allActivities]);
  const upcomingCount = useMemo(() => getUpcomingActivities(allActivities, 7).length, [allActivities]);

  const handleComplete = async (activityId) => {
    try {
      await completeActivity(activityId);
    } catch {
      // Error manejado por hook.
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando actividades..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="activity-list-page">
      <CRMHeader
        title="Actividades"
        subtitle="Seguimiento comercial de llamadas, emails, reuniones y tareas"
        icon={ActivityIcon}
        actions={(
          <Button variant="secondary" icon={RefreshCw} onClick={refetch}>
            Actualizar
          </Button>
        )}
      />

      <div className="activity-list-stats">
        <Card className="activity-stat-card">
          <p className="activity-stat-label">Total Actividades</p>
          <p className="activity-stat-value">{stats.total}</p>
        </Card>
        <Card className="activity-stat-card">
          <p className="activity-stat-label">Pendientes</p>
          <p className="activity-stat-value">{stats.pendientes}</p>
        </Card>
        <Card className="activity-stat-card">
          <p className="activity-stat-label">Próximas (7 días)</p>
          <p className="activity-stat-value">{upcomingCount}</p>
        </Card>
        <Card className="activity-stat-card">
          <p className="activity-stat-label">Atrasadas</p>
          <p className="activity-stat-value">{overdueCount}</p>
        </Card>
      </div>

      <Card className="activity-filter-card">
        <div className="activity-filters">
          <div className="activity-search">
            <Search size={18} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, descripción, cliente u oportunidad"
            />
          </div>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Todos los tipos</option>
            {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </Card>

      <Card padding="none">
        <div className="activity-table-wrap">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Oportunidad</th>
                <th>Programada</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="activity-main-cell">
                        <strong>{activity.titulo || 'Sin título'}</strong>
                        <span>{activity.descripcion || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="activity-type-cell">
                        <ActivityTypeIcon type={activity.tipo} size={16} />
                        <span>{ACTIVITY_TYPE_LABELS[activity.tipo] || activity.tipo}</span>
                      </div>
                    </td>
                    <td>{activity.cliente?.nombre || '-'}</td>
                    <td>{activity.oportunidad?.nombre || '-'}</td>
                    <td>{formatDate(activity.fechaProgramada)}</td>
                    <td>
                      <Badge variant={ACTIVITY_STATUS_COLORS[activity.estado] || 'default'}>
                        {ACTIVITY_STATUS_LABELS[activity.estado] || activity.estado}
                      </Badge>
                    </td>
                    <td>
                      {activity.estado !== 'completada' ? (
                        <Button
                          variant="success"
                          size="small"
                          icon={CheckCircle2}
                          onClick={() => handleComplete(activity.id)}
                        >
                          Completar
                        </Button>
                      ) : (
                        <span className="activity-done">
                          <Clock size={14} />
                          Finalizada
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="activity-empty">
                    <AlertTriangle size={16} />
                    <span>No hay actividades para los filtros actuales</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ActivityList;
