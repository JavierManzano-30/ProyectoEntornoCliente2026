import { TASK_STATUS_LABELS, TASK_STATUS } from '../constants/taskStatus';
import { TASK_PRIORITY_LABELS, TASK_PRIORITY_ORDER } from '../constants/taskPriority';

// Filtrar tareas
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    if (filters.estado && task.estado !== filters.estado) return false;
    if (filters.prioridad && task.prioridad !== filters.prioridad) return false;
    if (filters.asignadoA && task.asignadoA !== filters.asignadoA) return false;
    if (filters.proyectoId && task.proyectoId !== filters.proyectoId) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const taskTitle = (task.titulo || task.nombre || '').toLowerCase();
      if (!taskTitle.includes(searchLower) &&
          !task.descripcion?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
};

// Ordenar tareas
export const sortTasks = (tasks, sortBy, sortOrder = 'asc') => {
  const sorted = [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'prioridad') {
      aValue = TASK_PRIORITY_ORDER[aValue] || 0;
      bValue = TASK_PRIORITY_ORDER[bValue] || 0;
    }
    
    if (sortBy === 'fechaVencimiento' || sortBy === 'fechaCreacion') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Agrupar tareas por estado (para Kanban)
export const groupTasksByStatus = (tasks) => {
  return {
    [TASK_STATUS.TODO]: tasks.filter(t => t.estado === TASK_STATUS.TODO),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter(t => t.estado === TASK_STATUS.IN_PROGRESS),
    [TASK_STATUS.IN_REVIEW]: tasks.filter(t => t.estado === TASK_STATUS.IN_REVIEW),
    [TASK_STATUS.COMPLETED]: tasks.filter(t => t.estado === TASK_STATUS.COMPLETED)
  };
};

// Calcular estadísticas de tareas
export const calculateTaskStats = (tasks) => {
  return {
    total: tasks.length,
    pendientes: tasks.filter(t => t.estado === TASK_STATUS.TODO).length,
    enProgreso: tasks.filter(t => t.estado === TASK_STATUS.IN_PROGRESS).length,
    enRevision: tasks.filter(t => t.estado === TASK_STATUS.IN_REVIEW).length,
    completadas: tasks.filter(t => t.estado === TASK_STATUS.COMPLETED).length,
    horasEstimadas: tasks.reduce((sum, t) => sum + (t.horasEstimadas || 0), 0),
    horasTrabajadas: tasks.reduce((sum, t) => sum + (t.horasTrabajadas || 0), 0)
  };
};

// Verificar si una tarea está vencida
export const isTaskOverdue = (fechaVencimiento, estado) => {
  if (estado === TASK_STATUS.COMPLETED || estado === TASK_STATUS.CANCELLED) return false;
  const today = new Date();
  const dueDate = new Date(fechaVencimiento);
  return dueDate < today;
};

// Calcular progreso de tarea
export const calculateTaskProgress = (horasTrabajadas, horasEstimadas) => {
  if (!horasEstimadas || horasEstimadas === 0) return 0;
  return Math.min(Math.round((horasTrabajadas / horasEstimadas) * 100), 100);
};

// Obtener labels
export const getTaskStatusLabel = (estado) => {
  return TASK_STATUS_LABELS[estado] || estado;
};

export const getTaskPriorityLabel = (prioridad) => {
  return TASK_PRIORITY_LABELS[prioridad] || prioridad;
};

// Formatear horas
export const formatHours = (hours) => {
  if (!hours) return '0h';
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  return `${hours}h`;
};
