import React from 'react';
import ActivityTypeIcon from '../common/ActivityTypeIcon';
import Badge from '../../../../components/common/Badge';
import { ACTIVITY_STATUS_LABELS, ACTIVITY_STATUS_COLORS } from '../../constants/activityTypes';
import './ActivityTimeline.css';

const ActivityTimeline = ({ activities }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (activities.length === 0) {
    return (
      <div className="activity-timeline-empty">
        <p>No hay actividades registradas</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {activities.map((activity, index) => (
        <div key={activity.id} className="activity-timeline__item">
          <div className="activity-timeline__marker">
            <div className="activity-timeline__icon">
              <ActivityTypeIcon type={activity.tipo} size={16} />
            </div>
            {index < activities.length - 1 && (
              <div className="activity-timeline__line"></div>
            )}
          </div>

          <div className="activity-timeline__content">
            <div className="activity-timeline__header">
              <h4 className="activity-timeline__title">{activity.titulo}</h4>
              <Badge 
                variant={ACTIVITY_STATUS_COLORS[activity.estado] || 'default'}
                size="small"
              >
                {ACTIVITY_STATUS_LABELS[activity.estado] || activity.estado}
              </Badge>
            </div>

            {activity.descripcion && (
              <p className="activity-timeline__description">{activity.descripcion}</p>
            )}

            <div className="activity-timeline__meta">
              <span className="activity-timeline__date">
                {formatDate(activity.fechaProgramada)}
              </span>
              {activity.responsable && (
                <span className="activity-timeline__owner">
                  {activity.responsable.nombre}
                </span>
              )}
            </div>

            {activity.fechaCompletado && (
              <div className="activity-timeline__completed">
                Completada: {formatDate(activity.fechaCompletado)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
