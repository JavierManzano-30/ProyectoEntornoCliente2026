export const CUSTOMER_STATUSES = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido',
  PROSPECTO: 'prospecto',
};

export const CUSTOMER_STATUS_LABELS = {
  [CUSTOMER_STATUSES.ACTIVO]: 'Activo',
  [CUSTOMER_STATUSES.INACTIVO]: 'Inactivo',
  [CUSTOMER_STATUSES.SUSPENDIDO]: 'Suspendido',
  [CUSTOMER_STATUSES.PROSPECTO]: 'Prospecto',
};

export const CUSTOMER_STATUS_COLORS = {
  [CUSTOMER_STATUSES.ACTIVO]: 'success',
  [CUSTOMER_STATUSES.INACTIVO]: 'default',
  [CUSTOMER_STATUSES.SUSPENDIDO]: 'warning',
  [CUSTOMER_STATUSES.PROSPECTO]: 'info',
};

export const CUSTOMER_TYPES = {
  LEAD: 'lead',
  CLIENTE: 'cliente',
};

export const CUSTOMER_TYPE_LABELS = {
  [CUSTOMER_TYPES.LEAD]: 'Lead',
  [CUSTOMER_TYPES.CLIENTE]: 'Cliente',
};

export const CUSTOMER_TYPE_COLORS = {
  [CUSTOMER_TYPES.LEAD]: 'warning',
  [CUSTOMER_TYPES.CLIENTE]: 'success',
};
