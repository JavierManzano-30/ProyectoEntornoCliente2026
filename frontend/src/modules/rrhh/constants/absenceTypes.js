export const ABSENCE_TYPES = {
  VACATION: 'vacation',
  SICK_LEAVE: 'sick_leave',
  PERSONAL: 'personal',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid',
  TRAINING: 'training',
  OTHER: 'other',
};

export const ABSENCE_TYPE_LABELS = {
  [ABSENCE_TYPES.VACATION]: 'Vacaciones',
  [ABSENCE_TYPES.SICK_LEAVE]: 'Baja por Enfermedad',
  [ABSENCE_TYPES.PERSONAL]: 'Asunto Personal',
  [ABSENCE_TYPES.MATERNITY]: 'Baja Maternal',
  [ABSENCE_TYPES.PATERNITY]: 'Baja Paternal',
  [ABSENCE_TYPES.UNPAID]: 'Sin Sueldo',
  [ABSENCE_TYPES.TRAINING]: 'Formación',
  [ABSENCE_TYPES.OTHER]: 'Otro',
};

export const ABSENCE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const ABSENCE_STATUS_LABELS = {
  [ABSENCE_STATUS.PENDING]: 'Pendiente',
  [ABSENCE_STATUS.APPROVED]: 'Aprobada',
  [ABSENCE_STATUS.REJECTED]: 'Rechazada',
  [ABSENCE_STATUS.CANCELLED]: 'Cancelada',
};

export const ABSENCE_STATUS_COLORS = {
  [ABSENCE_STATUS.PENDING]: 'warning',
  [ABSENCE_STATUS.APPROVED]: 'success',
  [ABSENCE_STATUS.REJECTED]: 'error',
  [ABSENCE_STATUS.CANCELLED]: 'default',
};

export const ABSENCE_TYPE_OPTIONS = Object.entries(ABSENCE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const ABSENCE_STATUS_OPTIONS = Object.entries(ABSENCE_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
