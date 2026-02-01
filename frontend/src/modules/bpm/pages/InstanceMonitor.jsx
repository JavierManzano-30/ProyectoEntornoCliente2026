/**
 * Página de monitoreo de instancia de proceso
 */

import React, { useState } from 'react';
import { useInstance } from '../hooks/useInstance';
import { INSTANCE_STATUS_LABELS } from '../constants/instanceStatus';
import ActivityTimeline from '../components/shared/ActivityTimeline';
import DocumentList from '../components/documents/DocumentList';
import SLAProgressBar from '../components/shared/SLAProgressBar';
import { Play, Pause, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './InstanceMonitor.css';

const InstanceMonitor = ({ instanceId, onPause, onResume, onCancel }) => {
  const { instance, loading, timeline } = useInstance(instanceId);

  if (loading) {
    return <div className="monitor-loading">Cargando instancia...</div>;
  }

  if (!instance) {
    return (
      <div className="monitor-error">
        <AlertCircle size={24} />
        <p>Instancia no encontrada</p>
      </div>
    );
  }

  const canPause = instance.estado === 'active';
  const canResume = instance.estado === 'paused';

  return (
    <div className="instance-monitor">
      <div className="monitor-header">
        <div>
          <h1>Instancia #{instance.numero}</h1>
          <p className="monitor-process">{instance.proceso_nombre}</p>
        </div>
        <div className="monitor-controls">
          {canPause && (
            <button className="btn-control" onClick={() => onPause && onPause(instance)}>
              <Pause size={18} />
              Pausar
            </button>
          )}
          {canResume && (
            <button className="btn-control" onClick={() => onResume && onResume(instance)}>
              <Play size={18} />
              Reanudar
            </button>
          )}
        </div>
      </div>

      <div className="monitor-grid">
        <div className="monitor-card">
          <h3>Estado General</h3>
          <div className="status-overview">
            <div className="status-item">
              <span className="label">Estado:</span>
              <span className={`badge status-${instance.estado}`}>
                {INSTANCE_STATUS_LABELS[instance.estado]}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Progreso:</span>
              <div className="progress-box">
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{
                      width: `${(instance.tareas_completadas / instance.progreso_total) * 100}%`
                    }}
                  />
                </div>
                <span className="progress-text">
                  {instance.tareas_completadas}/{instance.progreso_total}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="monitor-card">
          <h3>Información</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Solicitante:</span>
              <span className="info-value">{instance.solicitante || '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Inicio:</span>
              <span className="info-value">
                {new Date(instance.fecha_inicio).toLocaleDateString('es-ES')}
              </span>
            </div>
            {instance.fecha_fin && (
              <div className="info-row">
                <span className="info-label">Finalización:</span>
                <span className="info-value">
                  {new Date(instance.fecha_fin).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {instance.fecha_limite && (
        <div className="monitor-sla">
          <h3>SLA</h3>
          <SLAProgressBar item={instance} showDetails={true} size="large" />
        </div>
      )}

      <div className="monitor-tabs">
        <div className="tab-panel">
          <h3>Actividades</h3>
          {timeline && timeline.length > 0 ? (
            <ActivityTimeline activities={timeline} />
          ) : (
            <p className="empty-message">No hay actividades registradas</p>
          )}
        </div>

        {instance.documentos && (
          <div className="tab-panel">
            <DocumentList documents={instance.documentos} readOnly={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InstanceMonitor;
