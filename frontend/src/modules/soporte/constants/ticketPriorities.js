export const TICKET_PRIORITIES = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica',
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITIES.BAJA]: 'Baja',
  [TICKET_PRIORITIES.MEDIA]: 'Media',
  [TICKET_PRIORITIES.ALTA]: 'Alta',
  [TICKET_PRIORITIES.CRITICA]: 'Crítica',
};

export const TICKET_PRIORITY_COLORS = {
  [TICKET_PRIORITIES.BAJA]: 'default',
  [TICKET_PRIORITIES.MEDIA]: 'info',
  [TICKET_PRIORITIES.ALTA]: 'warning',
  [TICKET_PRIORITIES.CRITICA]: 'error',
};
