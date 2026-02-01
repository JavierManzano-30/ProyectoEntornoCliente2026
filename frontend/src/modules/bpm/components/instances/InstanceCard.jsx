/**
 * Componente de tarjeta de instancia de proceso
 */

import React, { useState } from 'react';
import { PROCESS_STATUS_COLORS } from '../../constants/processStatus';
import { INSTANCE_STATUS_LABELS } from '../../constants/instanceStatus';
import { MoreVertical, Clock, AlertCircle } from 'lucide-react';
import SLAProgressBar from '../shared/SLAProgressBar';
import './InstanceCard.css';

const InstanceCard = ({
  instance,
  onPause,
  onResume,
  onCancel,
  onView,
  showSLA = true
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const canPause = instance.estado === 'active';
  const canResume = instance.estado === 'paused';
  const canCancel = ['active', 'paused'].includes(instance.estado);

  const isOverdue = instance.fecha_limite && new Date(instance.fecha_limite) < new Date();

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    if (!instance.progreso_total) return 0;
    return Math.min(100, (instance.tareas_completadas / instance.progreso_total) * 100);
  };

  return (
    <div className="instance-card">
      <div className="instance-card-header">
        <div className="instance-info-group">
          <h3 className="instance-number">Instancia #{instance.numero}</h3>
          <span className={`status-badge status-${instance.estado}`}>
            {INSTANCE_STATUS_LABELS[instance.estado]}
          </span>
        </div>
        <div className="instance-menu" onClick={handleMenuClick}>
          <button className="menu-btn">
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { onView && onView(instance); setMenuOpen(false); }}>
                Ver Detalles
              </button>
              {canPause && (
                <button onClick={() => { onPause && onPause(instance); setMenuOpen(false); }}>
                  Pausar
                </button>
              )}
              {canResume && (
                <button onClick={() => { onResume && onResume(instance); setMenuOpen(false); }}>
                  Reanudar
                </button>
              )}
              {canCancel && (
                <button className="action-danger" onClick={() => { onCancel && onCancel(instance); setMenuOpen(false); }}>
                  Cancelar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="instance-process">{instance.proceso_nombre}</p>

      <div className="instance-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <span className="progress-text">
          {instance.tareas_completadas} de {instance.progreso_total} completadas
        </span>
      </div>

      {showSLA && instance.fecha_limite && (
        <SLAProgressBar
          item={instance}
          showDetails={false}
          size="small"
        />
      )}

      <div className="instance-meta">
        <div className="meta-item">
          <Clock size={14} />
          <span>{formatDate(instance.fecha_inicio)}</span>
        </div>
        {isOverdue && (
          <div className="meta-item overdue">
            <AlertCircle size={14} />
            <span>Vencida</span>
          </div>
        )}
      </div>

      {instance.solicitante && (
        <div className="instance-requester">
          <span className="label">Solicitante:</span>
          <span className="value">{instance.solicitante}</span>
        </div>
      )}
    </div>
  );
};

export default InstanceCard;
