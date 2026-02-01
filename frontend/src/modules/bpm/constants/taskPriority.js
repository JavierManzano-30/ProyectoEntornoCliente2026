/**
 * Prioridades de tareas en el módulo BPM
 */

export const TASK_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Baja',
  [TASK_PRIORITY.NORMAL]: 'Normal',
  [TASK_PRIORITY.HIGH]: 'Alta',
  [TASK_PRIORITY.URGENT]: 'Urgente',
  [TASK_PRIORITY.CRITICAL]: 'Crítica'
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'gray',
  [TASK_PRIORITY.NORMAL]: 'blue',
  [TASK_PRIORITY.HIGH]: 'orange',
  [TASK_PRIORITY.URGENT]: 'red',
  [TASK_PRIORITY.CRITICAL]: 'purple'
};

export const TASK_PRIORITY_VALUES = {
  [TASK_PRIORITY.LOW]: 1,
  [TASK_PRIORITY.NORMAL]: 2,
  [TASK_PRIORITY.HIGH]: 3,
  [TASK_PRIORITY.URGENT]: 4,
  [TASK_PRIORITY.CRITICAL]: 5
};
