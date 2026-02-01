/**
 * Funciones auxiliares para procesos BPM
 */

import { PROCESS_STATUS, PROCESS_STATUS_LABELS } from '../constants/processStatus';

/**
 * Obtener el label de un estado de proceso
 */
export const getProcessStatusLabel = (status) => {
  return PROCESS_STATUS_LABELS[status] || status;
};

/**
 * Verificar si un proceso puede ser editado
 */
export const canEditProcess = (process) => {
  return process?.estado === PROCESS_STATUS.DRAFT;
};

/**
 * Verificar si un proceso puede ser publicado
 */
export const canPublishProcess = (process) => {
  return process?.estado === PROCESS_STATUS.DRAFT && process?.validado === true;
};

/**
 * Verificar si un proceso puede ser archivado
 */
export const canArchiveProcess = (process) => {
  return process?.estado === PROCESS_STATUS.PUBLISHED || process?.estado === PROCESS_STATUS.INACTIVE;
};

/**
 * Verificar si un proceso puede iniciar instancias
 */
export const canStartInstances = (process) => {
  return process?.estado === PROCESS_STATUS.PUBLISHED;
};

/**
 * Formatear versión de proceso
 */
export const formatProcessVersion = (version) => {
  if (!version) return 'v1.0';
  return `v${version}`;
};

/**
 * Obtener información de versión
 */
export const getVersionInfo = (process) => {
  if (!process) return null;
  
  return {
    current: formatProcessVersion(process.version),
    published: process.fecha_publicacion,
    author: process.autor
  };
};

/**
 * Filtrar procesos por criterios
 */
export const filterProcesses = (processes, filters) => {
  let filtered = [...processes];

  if (filters.estado) {
    filtered = filtered.filter(p => p.estado === filters.estado);
  }

  if (filters.categoria) {
    filtered = filtered.filter(p => p.categoria === filters.categoria);
  }

  if (filters.busqueda) {
    const search = filters.busqueda.toLowerCase();
    filtered = filtered.filter(p => 
      p.nombre?.toLowerCase().includes(search) ||
      p.descripcion?.toLowerCase().includes(search) ||
      p.codigo?.toLowerCase().includes(search)
    );
  }

  return filtered;
};

/**
 * Ordenar procesos
 */
export const sortProcesses = (processes, sortBy, sortOrder = 'asc') => {
  const sorted = [...processes];
  
  sorted.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    // Manejar fechas
    if (sortBy.includes('fecha')) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    // Manejar strings
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
 * Calcular estadísticas de procesos
 */
export const calculateProcessStats = (processes) => {
  return {
    total: processes.length,
    drafts: processes.filter(p => p.estado === PROCESS_STATUS.DRAFT).length,
    published: processes.filter(p => p.estado === PROCESS_STATUS.PUBLISHED).length,
    archived: processes.filter(p => p.estado === PROCESS_STATUS.ARCHIVED).length,
    active: processes.filter(p => p.instancias_activas > 0).length
  };
};
