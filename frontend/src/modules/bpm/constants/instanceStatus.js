/**
 * Estados de instancias de proceso en el módulo BPM
 */

export const INSTANCE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ERROR: 'error'
};

export const INSTANCE_STATUS_LABELS = {
  [INSTANCE_STATUS.PENDING]: 'Pendiente',
  [INSTANCE_STATUS.ACTIVE]: 'Activa',
  [INSTANCE_STATUS.PAUSED]: 'Pausada',
  [INSTANCE_STATUS.COMPLETED]: 'Completada',
  [INSTANCE_STATUS.CANCELLED]: 'Cancelada',
  [INSTANCE_STATUS.ERROR]: 'Error'
};

export const INSTANCE_STATUS_COLORS = {
  [INSTANCE_STATUS.PENDING]: 'blue',
  [INSTANCE_STATUS.ACTIVE]: 'green',
  [INSTANCE_STATUS.PAUSED]: 'orange',
  [INSTANCE_STATUS.COMPLETED]: 'gray',
  [INSTANCE_STATUS.CANCELLED]: 'red',
  [INSTANCE_STATUS.ERROR]: 'red'
};
