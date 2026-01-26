import React from 'react';
import { calculateSLAStatus, formatTimeRemaining, getSLAColorClass } from '../../utils/slaHelpers';
import { AlertTriangle, Clock } from 'lucide-react';
import './SLAIndicator.css';

const SLAIndicator = ({ ticket, showDetails = true }) => {
  if (!ticket || !ticket.nivelSLA) {
    return null;
  }

  const slaStatus = calculateSLAStatus(ticket);
  const { overallStatus, response, resolution } = slaStatus;

  return (
    <div className={`sla-indicator ${getSLAColorClass(overallStatus)}`}>
      <div className="sla-header">
        {overallStatus === 'breached' && <AlertTriangle size={16} />}
        {overallStatus === 'warning' && <Clock size={16} />}
        <span className="sla-status-text">
          {overallStatus === 'breached' && 'SLA Incumplido'}
          {overallStatus === 'warning' && 'SLA en Riesgo'}
          {overallStatus === 'ok' && 'SLA en Tiempo'}
        </span>
      </div>

      {showDetails && (
        <div className="sla-details">
          {!ticket.fechaPrimeraRespuesta && (
            <div className="sla-metric">
              <span className="sla-metric-label">Tiempo de respuesta:</span>
              <div className="sla-progress-bar">
                <div 
                  className={`sla-progress-fill ${getSLAColorClass(response.status)}`}
                  style={{ width: `${Math.min(response.percentage, 100)}%` }}
                />
              </div>
              <span className="sla-metric-value">
                {formatTimeRemaining(response.deadline - response.hoursElapsed)}
              </span>
            </div>
          )}

          {!ticket.fechaResolucion && (
            <div className="sla-metric">
              <span className="sla-metric-label">Tiempo de resolución:</span>
              <div className="sla-progress-bar">
                <div 
                  className={`sla-progress-fill ${getSLAColorClass(resolution.status)}`}
                  style={{ width: `${Math.min(resolution.percentage, 100)}%` }}
                />
              </div>
              <span className="sla-metric-value">
                {formatTimeRemaining(resolution.deadline - resolution.hoursElapsed)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SLAIndicator;
