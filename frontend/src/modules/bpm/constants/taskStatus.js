/**
 * Estados de tareas en el módulo BPM
 */

export const TASK_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  TRANSFERRED: 'transferred',
  INFO_REQUESTED: 'info_requested'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pendiente',
  [TASK_STATUS.ASSIGNED]: 'Asignada',
  [TASK_STATUS.IN_PROGRESS]: 'En Progreso',
  [TASK_STATUS.COMPLETED]: 'Completada',
  [TASK_STATUS.CANCELLED]: 'Cancelada',
  [TASK_STATUS.TRANSFERRED]: 'Transferida',
  [TASK_STATUS.INFO_REQUESTED]: 'Info Solicitada'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'blue',
  [TASK_STATUS.ASSIGNED]: 'cyan',
  [TASK_STATUS.IN_PROGRESS]: 'green',
  [TASK_STATUS.COMPLETED]: 'gray',
  [TASK_STATUS.CANCELLED]: 'red',
  [TASK_STATUS.TRANSFERRED]: 'orange',
  [TASK_STATUS.INFO_REQUESTED]: 'yellow'
};
