/**
 * Componente de línea de tiempo para actividades
 */

import React from 'react';
import { formatDateTime, formatRelativeDate } from '../../utils/dateUtils';
import { CheckCircle, Circle, XCircle, Clock, AlertCircle } from 'lucide-react';
import './ActivityTimeline.css';

const ActivityTimeline = ({ activities = [], showDetails = true }) => {
  const getIcon = (activity) => {
    switch (activity.tipo || activity.estado) {
      case 'completada':
      case 'completed':
        return <CheckCircle className="timeline-icon timeline-icon-success" size={20} />;
      case 'cancelada':
      case 'cancelled':
        return <XCircle className="timeline-icon timeline-icon-error" size={20} />;
      case 'en_progreso':
      case 'active':
        return <Clock className="timeline-icon timeline-icon-info" size={20} />;
      case 'pendiente':
      case 'pending':
        return <Circle className="timeline-icon timeline-icon-default" size={20} />;
      default:
        return <AlertCircle className="timeline-icon timeline-icon-warning" size={20} />;
    }
  };

  const getActivityTypeLabel = (type) => {
    const labels = {
      inicio: 'Inicio',
      tarea: 'Tarea',
      aprobacion: 'Aprobación',
      gateway: 'Decisión',
      subproceso: 'Subproceso',
      finalizacion: 'Finalización',
      comentario: 'Comentario',
      documento: 'Documento',
      transferencia: 'Transferencia'
    };
    return labels[type] || type;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-timeline-empty">
        <p>No hay actividades registradas</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {activities.map((activity, index) => (
        <div key={activity.id || index} className="timeline-item">
          <div className="timeline-marker">
            {getIcon(activity)}
            {index < activities.length - 1 && <div className="timeline-line" />}
          </div>
          
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-type">
                {getActivityTypeLabel(activity.tipo || activity.type)}
              </span>
              <span className="timeline-date">
                {formatRelativeDate(activity.fecha || activity.fecha_inicio)}
              </span>
            </div>
            
            <div className="timeline-body">
              <h4 className="timeline-title">
                {activity.nombre || activity.titulo || activity.descripcion}
              </h4>
              
              {showDetails && activity.descripcion && (
                <p className="timeline-description">{activity.descripcion}</p>
              )}
              
              {activity.usuario && (
                <div className="timeline-user">
                  <span className="timeline-user-label">Por:</span>
                  <span className="timeline-user-name">
                    {activity.usuario.nombre || activity.usuario}
                  </span>
                </div>
              )}
              
              {activity.duracion && (
                <div className="timeline-meta">
                  <span className="timeline-meta-label">Duración:</span>
                  <span className="timeline-meta-value">{activity.duracion}</span>
                </div>
              )}
              
              {activity.comentario && (
                <div className="timeline-comment">
                  <p>{activity.comentario}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
