export const USER_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  PENDING: 'pendiente',
  SUSPENDED: 'suspendido',
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Activo',
  [USER_STATUS.INACTIVE]: 'Inactivo',
  [USER_STATUS.PENDING]: 'Pendiente',
  [USER_STATUS.SUSPENDED]: 'Suspendido',
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'green',
  [USER_STATUS.INACTIVE]: 'gray',
  [USER_STATUS.PENDING]: 'yellow',
  [USER_STATUS.SUSPENDED]: 'red',
};
