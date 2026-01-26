export const TICKET_STATUSES = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  ESPERANDO_CLIENTE: 'esperando_cliente',
  RESUELTO: 'resuelto',
  CERRADO: 'cerrado',
  CANCELADO: 'cancelado',
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUSES.PENDIENTE]: 'Pendiente',
  [TICKET_STATUSES.EN_PROGRESO]: 'En Progreso',
  [TICKET_STATUSES.ESPERANDO_CLIENTE]: 'Esperando Cliente',
  [TICKET_STATUSES.RESUELTO]: 'Resuelto',
  [TICKET_STATUSES.CERRADO]: 'Cerrado',
  [TICKET_STATUSES.CANCELADO]: 'Cancelado',
};

export const TICKET_STATUS_COLORS = {
  [TICKET_STATUSES.PENDIENTE]: 'warning',
  [TICKET_STATUSES.EN_PROGRESO]: 'info',
  [TICKET_STATUSES.ESPERANDO_CLIENTE]: 'secondary',
  [TICKET_STATUSES.RESUELTO]: 'success',
  [TICKET_STATUSES.CERRADO]: 'default',
  [TICKET_STATUSES.CANCELADO]: 'error',
};
