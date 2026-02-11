// Prioridades de tareas
export const TASK_PRIORITY = {
  LOW: 'baja',
  MEDIUM: 'media',
  HIGH: 'alta',
  CRITICAL: 'critica'
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Baja',
  [TASK_PRIORITY.MEDIUM]: 'Media',
  [TASK_PRIORITY.HIGH]: 'Alta',
  [TASK_PRIORITY.CRITICAL]: 'Crítica'
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: '#6b7280',
  [TASK_PRIORITY.MEDIUM]: '#3b82f6',
  [TASK_PRIORITY.HIGH]: '#f59e0b',
  [TASK_PRIORITY.CRITICAL]: '#ef4444'
};

export const TASK_PRIORITY_BG_COLORS = {
  [TASK_PRIORITY.LOW]: '#f3f4f6',
  [TASK_PRIORITY.MEDIUM]: '#dbeafe',
  [TASK_PRIORITY.HIGH]: '#fef3c7',
  [TASK_PRIORITY.CRITICAL]: '#fee2e2'
};

export const TASK_PRIORITY_ORDER = {
  [TASK_PRIORITY.LOW]: 1,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.HIGH]: 3,
  [TASK_PRIORITY.CRITICAL]: 4
};
