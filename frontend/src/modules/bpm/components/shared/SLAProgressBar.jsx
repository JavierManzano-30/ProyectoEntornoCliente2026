/**
 * Componente de barra de progreso para SLA
 */

import React from 'react';
import { calculateSLA, getSLAColor } from '../../utils/slaCalculations';
import { SLA_STATUS_LABELS } from '../../constants/slaThresholds';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import './SLAProgressBar.css';

const SLAProgressBar = ({ item, showLabel = true, showIcon = true, size = 'medium' }) => {
  if (!item || !item.fecha_inicio || !item.fecha_limite) {
    return null;
  }

  const sla = calculateSLA(item);
  const color = getSLAColor(sla.status);

  const getIcon = () => {
    switch (sla.status) {
      case 'overdue':
        return <AlertTriangle size={16} />;
      case 'at_risk':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className={`sla-progress-bar-container sla-progress-${size}`}>
      {showLabel && (
        <div className="sla-progress-header">
          {showIcon && <span className="sla-progress-icon">{getIcon()}</span>}
          <span className={`sla-progress-label sla-status-${sla.status}`}>
            {SLA_STATUS_LABELS[sla.status]}
          </span>
          {sla.timeRemaining && (
            <span className="sla-progress-time">{sla.timeRemaining}</span>
          )}
        </div>
      )}
      
      <div className="sla-progress-bar">
        <div 
          className={`sla-progress-fill sla-fill-${sla.status}`}
          style={{ 
            width: `${Math.min(sla.percentage, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
      
      {sla.percentage > 0 && (
        <span className="sla-progress-percentage">
          {sla.percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};

export default SLAProgressBar;
