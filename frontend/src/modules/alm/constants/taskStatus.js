// Estados de tareas
export const TASK_STATUS = {
  TODO: 'pendiente',
  IN_PROGRESS: 'en_progreso',
  IN_REVIEW: 'en_revision',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'Pendiente',
  [TASK_STATUS.IN_PROGRESS]: 'En Progreso',
  [TASK_STATUS.IN_REVIEW]: 'En Revisión',
  [TASK_STATUS.COMPLETED]: 'Completada',
  [TASK_STATUS.CANCELLED]: 'Cancelada'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: '#6b7280',
  [TASK_STATUS.IN_PROGRESS]: '#2563eb',
  [TASK_STATUS.IN_REVIEW]: '#8b5cf6',
  [TASK_STATUS.COMPLETED]: '#10b981',
  [TASK_STATUS.CANCELLED]: '#ef4444'
};

export const TASK_STATUS_BG_COLORS = {
  [TASK_STATUS.TODO]: '#f3f4f6',
  [TASK_STATUS.IN_PROGRESS]: '#eff6ff',
  [TASK_STATUS.IN_REVIEW]: '#f5f3ff',
  [TASK_STATUS.COMPLETED]: '#d1fae5',
  [TASK_STATUS.CANCELLED]: '#fee2e2'
};
