/**
 * Cálculos de SLA para el módulo BPM
 */

import { SLA_STATUS, SLA_THRESHOLDS } from '../constants/slaThresholds';

/**
 * Calcular el porcentaje de tiempo consumido
 */
export const calculateSLAPercentage = (startDate, targetDate) => {
  if (!startDate || !targetDate) return 0;
  
  const start = new Date(startDate);
  const target = new Date(targetDate);
  const now = new Date();
  
  const totalTime = target - start;
  const elapsedTime = now - start;
  
  if (totalTime <= 0) return 100;
  
  const percentage = (elapsedTime / totalTime) * 100;
  return Math.min(Math.max(percentage, 0), 150); // Límite entre 0 y 150%
};

/**
 * Determinar el estado del SLA
 */
export const getSLAStatus = (percentage, isCompleted = false) => {
  if (isCompleted) return SLA_STATUS.COMPLETED;
  if (percentage >= SLA_THRESHOLDS.OVERDUE) return SLA_STATUS.OVERDUE;
  if (percentage >= SLA_THRESHOLDS.AT_RISK) return SLA_STATUS.AT_RISK;
  return SLA_STATUS.ON_TIME;
};

/**
 * Obtener el estado SLA de una tarea o instancia
 */
export const calculateSLA = (item) => {
  if (!item) return null;
  
  const isCompleted = item.estado === 'completed' || item.estado === 'completada';
  const percentage = calculateSLAPercentage(item.fecha_inicio, item.fecha_limite);
  const status = getSLAStatus(percentage, isCompleted);
  
  return {
    percentage,
    status,
    isCompleted,
    timeRemaining: calculateTimeRemaining(item.fecha_limite),
    isOverdue: percentage >= 100 && !isCompleted
  };
};

/**
 * Calcular tiempo restante en formato legible
 */
export const calculateTimeRemaining = (targetDate) => {
  if (!targetDate) return null;
  
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Vencido hace ${days}d`;
    if (hours > 0) return `Vencido hace ${hours}h`;
    return 'Vencido';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 1) return `${days} días`;
  if (days === 1) return `1 día ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Calcular tiempo transcurrido
 */
export const calculateElapsedTime = (startDate, endDate = null) => {
  if (!startDate) return null;
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diff = end - start;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Obtener color según el estado del SLA
 */
export const getSLAColor = (status) => {
  const colors = {
    [SLA_STATUS.ON_TIME]: '#10b981',
    [SLA_STATUS.AT_RISK]: '#f59e0b',
    [SLA_STATUS.OVERDUE]: '#ef4444',
    [SLA_STATUS.COMPLETED]: '#6b7280'
  };
  
  return colors[status] || colors[SLA_STATUS.ON_TIME];
};

/**
 * Formatear duración en formato legible
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || milliseconds < 0) return '0m';
  
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Calcular métricas de cumplimiento de SLA
 */
export const calculateSLAMetrics = (items) => {
  if (!items || items.length === 0) {
    return {
      total: 0,
      onTime: 0,
      atRisk: 0,
      overdue: 0,
      completed: 0,
      onTimePercentage: 0,
      complianceRate: 0
    };
  }
  
  const metrics = items.reduce((acc, item) => {
    const sla = calculateSLA(item);
    
    acc.total++;
    
    switch (sla.status) {
      case SLA_STATUS.ON_TIME:
        acc.onTime++;
        break;
      case SLA_STATUS.AT_RISK:
        acc.atRisk++;
        break;
      case SLA_STATUS.OVERDUE:
        acc.overdue++;
        break;
      case SLA_STATUS.COMPLETED:
        acc.completed++;
        if (!sla.isOverdue) {
          acc.completedOnTime++;
        }
        break;
    }
    
    return acc;
  }, {
    total: 0,
    onTime: 0,
    atRisk: 0,
    overdue: 0,
    completed: 0,
    completedOnTime: 0
  });
  
  metrics.onTimePercentage = metrics.total > 0 
    ? ((metrics.onTime / metrics.total) * 100).toFixed(1)
    : 0;
    
  metrics.complianceRate = metrics.completed > 0
    ? ((metrics.completedOnTime / metrics.completed) * 100).toFixed(1)
    : 0;
  
  return metrics;
};
