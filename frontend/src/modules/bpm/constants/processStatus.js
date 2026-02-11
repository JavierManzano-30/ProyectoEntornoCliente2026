/**
 * Estados de procesos en el módulo BPM
 */

export const PROCESS_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  INACTIVE: 'inactive'
};

export const PROCESS_STATUS_LABELS = {
  [PROCESS_STATUS.DRAFT]: 'Borrador',
  [PROCESS_STATUS.PUBLISHED]: 'Publicado',
  [PROCESS_STATUS.ARCHIVED]: 'Archivado',
  [PROCESS_STATUS.INACTIVE]: 'Inactivo'
};

export const PROCESS_STATUS_COLORS = {
  [PROCESS_STATUS.DRAFT]: 'gray',
  [PROCESS_STATUS.PUBLISHED]: 'green',
  [PROCESS_STATUS.ARCHIVED]: 'orange',
  [PROCESS_STATUS.INACTIVE]: 'red'
};
