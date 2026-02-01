/**
 * Funciones auxiliares para tareas BPM
 */

import { TASK_STATUS, TASK_STATUS_LABELS } from '../constants/taskStatus';
import { TASK_PRIORITY, TASK_PRIORITY_LABELS, TASK_PRIORITY_VALUES } from '../constants/taskPriority';

/**
 * Obtener el label de un estado de tarea
 */
export const getTaskStatusLabel = (status) => {
  return TASK_STATUS_LABELS[status] || status;
};

/**
 * Obtener el label de una prioridad de tarea
 */
export const getTaskPriorityLabel = (priority) => {
  return TASK_PRIORITY_LABELS[priority] || priority;
};

/**
 * Verificar si una tarea puede ser completada
 */
export const canCompleteTask = (task) => {
  return task?.estado === TASK_STATUS.ASSIGNED || 
         task?.estado === TASK_STATUS.IN_PROGRESS;
};

/**
 * Verificar si una tarea puede ser transferida
 */
export const canTransferTask = (task) => {
  return task?.estado === TASK_STATUS.ASSIGNED || 
         task?.estado === TASK_STATUS.IN_PROGRESS;
};

/**
 * Verificar si una tarea está vencida
 */
export const isTaskOverdue = (task) => {
  if (!task?.fecha_limite) return false;
  
  const now = new Date();
  const deadline = new Date(task.fecha_limite);
  return now > deadline && task.estado !== TASK_STATUS.COMPLETED;
};

/**
 * Calcular tiempo restante
 */
export const calculateTimeRemaining = (deadline) => {
  if (!deadline) return null;
  
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff < 0) return 'Vencida';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 1) return `${days} días`;
  if (days === 1) return `1 día ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Filtrar tareas por criterios
 */
export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  if (filters.estado) {
    filtered = filtered.filter(t => t.estado === filters.estado);
  }

  if (filters.prioridad) {
    filtered = filtered.filter(t => t.prioridad === filters.prioridad);
  }

  if (filters.proceso_id) {
    filtered = filtered.filter(t => t.proceso_id === filters.proceso_id);
  }

  if (filters.vencidas) {
    filtered = filtered.filter(t => isTaskOverdue(t));
  }

  if (filters.busqueda) {
    const search = filters.busqueda.toLowerCase();
    filtered = filtered.filter(t => 
      t.nombre?.toLowerCase().includes(search) ||
      t.descripcion?.toLowerCase().includes(search) ||
      t.proceso_nombre?.toLowerCase().includes(search)
    );
  }

  return filtered;
};

/**
 * Ordenar tareas por prioridad
 */
export const sortTasksByPriority = (tasks, order = 'desc') => {
  const sorted = [...tasks];
  
  sorted.sort((a, b) => {
    const priorityA = TASK_PRIORITY_VALUES[a.prioridad] || 0;
    const priorityB = TASK_PRIORITY_VALUES[b.prioridad] || 0;
    
    return order === 'desc' ? priorityB - priorityA : priorityA - priorityB;
  });

  return sorted;
};

/**
 * Ordenar tareas por fecha límite
 */
export const sortTasksByDeadline = (tasks, order = 'asc') => {
  const sorted = [...tasks];
  
  sorted.sort((a, b) => {
    if (!a.fecha_limite) return 1;
    if (!b.fecha_limite) return -1;
    
    const dateA = new Date(a.fecha_limite);
    const dateB = new Date(b.fecha_limite);
    
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return sorted;
};

/**
 * Calcular estadísticas de tareas
 */
export const calculateTaskStats = (tasks) => {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.estado === TASK_STATUS.PENDING).length,
    assigned: tasks.filter(t => t.estado === TASK_STATUS.ASSIGNED).length,
    inProgress: tasks.filter(t => t.estado === TASK_STATUS.IN_PROGRESS).length,
    completed: tasks.filter(t => t.estado === TASK_STATUS.COMPLETED).length,
    overdue: tasks.filter(t => isTaskOverdue(t)).length,
    highPriority: tasks.filter(t => 
      t.prioridad === TASK_PRIORITY.HIGH || 
      t.prioridad === TASK_PRIORITY.URGENT || 
      t.prioridad === TASK_PRIORITY.CRITICAL
    ).length
  };
};

/**
 * Agrupar tareas por proceso
 */
export const groupTasksByProcess = (tasks) => {
  return tasks.reduce((acc, task) => {
    const processName = task.proceso_nombre || 'Sin proceso';
    if (!acc[processName]) {
      acc[processName] = [];
    }
    acc[processName].push(task);
    return acc;
  }, {});
};

/**
 * Agrupar tareas por prioridad
 */
export const groupTasksByPriority = (tasks) => {
  return tasks.reduce((acc, task) => {
    const priority = task.prioridad || TASK_PRIORITY.NORMAL;
    if (!acc[priority]) {
      acc[priority] = [];
    }
    acc[priority].push(task);
    return acc;
  }, {});
};
