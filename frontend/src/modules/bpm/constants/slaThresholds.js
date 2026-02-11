/**
 * Umbrales de SLA para el módulo BPM
 */

export const SLA_STATUS = {
  ON_TIME: 'on_time',
  AT_RISK: 'at_risk',
  OVERDUE: 'overdue',
  COMPLETED: 'completed'
};

export const SLA_STATUS_LABELS = {
  [SLA_STATUS.ON_TIME]: 'A Tiempo',
  [SLA_STATUS.AT_RISK]: 'En Riesgo',
  [SLA_STATUS.OVERDUE]: 'Vencida',
  [SLA_STATUS.COMPLETED]: 'Completada'
};

export const SLA_STATUS_COLORS = {
  [SLA_STATUS.ON_TIME]: 'green',
  [SLA_STATUS.AT_RISK]: 'yellow',
  [SLA_STATUS.OVERDUE]: 'red',
  [SLA_STATUS.COMPLETED]: 'gray'
};

// Umbrales en porcentaje del tiempo total
export const SLA_THRESHOLDS = {
  AT_RISK: 80,  // 80% del tiempo consumido
  OVERDUE: 100  // 100% o más del tiempo consumido
};

// Colores para barras de progreso de SLA
export const SLA_PROGRESS_COLORS = {
  SAFE: '#10b981',      // Verde
  WARNING: '#f59e0b',   // Amarillo
  DANGER: '#ef4444'     // Rojo
};
