export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  ON_LEAVE: 'on_leave',
};

export const EMPLOYEE_STATUS_LABELS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'Activo',
  [EMPLOYEE_STATUS.INACTIVE]: 'Inactivo',
  [EMPLOYEE_STATUS.SUSPENDED]: 'Suspendido',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'De Baja',
};

export const EMPLOYEE_STATUS_COLORS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'success',
  [EMPLOYEE_STATUS.INACTIVE]: 'error',
  [EMPLOYEE_STATUS.SUSPENDED]: 'warning',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'info',
};

export const EMPLOYEE_STATUS_OPTIONS = Object.entries(EMPLOYEE_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
