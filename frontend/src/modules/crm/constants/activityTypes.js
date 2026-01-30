export const ACTIVITY_TYPES = {
  LLAMADA: 'llamada',
  EMAIL: 'email',
  REUNION: 'reunion',
  TAREA: 'tarea',
  NOTA: 'nota',
  CITA: 'cita',
};

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.LLAMADA]: 'Llamada',
  [ACTIVITY_TYPES.EMAIL]: 'Email',
  [ACTIVITY_TYPES.REUNION]: 'Reunión',
  [ACTIVITY_TYPES.TAREA]: 'Tarea',
  [ACTIVITY_TYPES.NOTA]: 'Nota',
  [ACTIVITY_TYPES.CITA]: 'Cita',
};

export const ACTIVITY_TYPE_ICONS = {
  [ACTIVITY_TYPES.LLAMADA]: 'Phone',
  [ACTIVITY_TYPES.EMAIL]: 'Mail',
  [ACTIVITY_TYPES.REUNION]: 'Users',
  [ACTIVITY_TYPES.TAREA]: 'CheckSquare',
  [ACTIVITY_TYPES.NOTA]: 'FileText',
  [ACTIVITY_TYPES.CITA]: 'Calendar',
};

export const ACTIVITY_STATUSES = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
};

export const ACTIVITY_STATUS_LABELS = {
  [ACTIVITY_STATUSES.PENDIENTE]: 'Pendiente',
  [ACTIVITY_STATUSES.EN_PROGRESO]: 'En Progreso',
  [ACTIVITY_STATUSES.COMPLETADA]: 'Completada',
  [ACTIVITY_STATUSES.CANCELADA]: 'Cancelada',
};

export const ACTIVITY_STATUS_COLORS = {
  [ACTIVITY_STATUSES.PENDIENTE]: 'warning',
  [ACTIVITY_STATUSES.EN_PROGRESO]: 'info',
  [ACTIVITY_STATUSES.COMPLETADA]: 'success',
  [ACTIVITY_STATUSES.CANCELADA]: 'error',
};
