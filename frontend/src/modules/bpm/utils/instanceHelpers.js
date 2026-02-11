/**
 * Funciones auxiliares para instancias de proceso
 */

import { INSTANCE_STATUS, INSTANCE_STATUS_LABELS } from '../constants/instanceStatus';

/**
 * Obtener el label de un estado de instancia
 */
export const getInstanceStatusLabel = (status) => {
  return INSTANCE_STATUS_LABELS[status] || status;
};

/**
 * Verificar si una instancia puede ser cancelada
 */
export const canCancelInstance = (instance) => {
  return instance?.estado === INSTANCE_STATUS.ACTIVE || 
         instance?.estado === INSTANCE_STATUS.PAUSED;
};

/**
 * Verificar si una instancia puede ser pausada
 */
export const canPauseInstance = (instance) => {
  return instance?.estado === INSTANCE_STATUS.ACTIVE;
};

/**
 * Verificar si una instancia puede ser reanudada
 */
export const canResumeInstance = (instance) => {
  return instance?.estado === INSTANCE_STATUS.PAUSED;
};

/**
 * Verificar si una instancia está en curso
 */
export const isInstanceInProgress = (instance) => {
  return instance?.estado === INSTANCE_STATUS.ACTIVE || 
         instance?.estado === INSTANCE_STATUS.PAUSED;
};

/**
 * Verificar si una instancia está finalizada
 */
export const isInstanceFinished = (instance) => {
  return instance?.estado === INSTANCE_STATUS.COMPLETED || 
         instance?.estado === INSTANCE_STATUS.CANCELLED;
};

/**
 * Calcular tiempo transcurrido
 */
export const calculateElapsedTime = (startDate) => {
  if (!startDate) return null;
  
  const start = new Date(startDate);
  const now = new Date();
  const diff = now - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Calcular tiempo total de ejecución
 */
export const calculateTotalTime = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};

/**
 * Filtrar instancias por criterios
 */
export const filterInstances = (instances, filters) => {
  let filtered = [...instances];

  if (filters.estado) {
    filtered = filtered.filter(i => i.estado === filters.estado);
  }

  if (filters.proceso_id) {
    filtered = filtered.filter(i => i.proceso_id === filters.proceso_id);
  }

  if (filters.responsable_id) {
    filtered = filtered.filter(i => i.responsable_id === filters.responsable_id);
  }

  if (filters.fecha_desde) {
    filtered = filtered.filter(i => new Date(i.fecha_inicio) >= new Date(filters.fecha_desde));
  }

  if (filters.fecha_hasta) {
    filtered = filtered.filter(i => new Date(i.fecha_inicio) <= new Date(filters.fecha_hasta));
  }

  if (filters.busqueda) {
    const search = filters.busqueda.toLowerCase();
    filtered = filtered.filter(i => 
      i.codigo?.toLowerCase().includes(search) ||
      i.proceso_nombre?.toLowerCase().includes(search) ||
      i.descripcion?.toLowerCase().includes(search)
    );
  }

  return filtered;
};

/**
 * Ordenar instancias
 */
export const sortInstances = (instances, sortBy, sortOrder = 'desc') => {
  const sorted = [...instances];
  
  sorted.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (sortBy.includes('fecha')) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Calcular estadísticas de instancias
 */
export const calculateInstanceStats = (instances) => {
  return {
    total: instances.length,
    active: instances.filter(i => i.estado === INSTANCE_STATUS.ACTIVE).length,
    paused: instances.filter(i => i.estado === INSTANCE_STATUS.PAUSED).length,
    completed: instances.filter(i => i.estado === INSTANCE_STATUS.COMPLETED).length,
    cancelled: instances.filter(i => i.estado === INSTANCE_STATUS.CANCELLED).length,
    error: instances.filter(i => i.estado === INSTANCE_STATUS.ERROR).length
  };
};

/**
 * Agrupar instancias por proceso
 */
export const groupInstancesByProcess = (instances) => {
  return instances.reduce((acc, instance) => {
    const processName = instance.proceso_nombre || 'Sin proceso';
    if (!acc[processName]) {
      acc[processName] = [];
    }
    acc[processName].push(instance);
    return acc;
  }, {});
};
