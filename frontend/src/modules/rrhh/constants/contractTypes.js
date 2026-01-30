export const CONTRACT_TYPES = {
  INDEFINITE: 'indefinite',
  TEMPORARY: 'temporary',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance',
  PART_TIME: 'part_time',
};

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.INDEFINITE]: 'Indefinido',
  [CONTRACT_TYPES.TEMPORARY]: 'Temporal',
  [CONTRACT_TYPES.INTERNSHIP]: 'Prácticas',
  [CONTRACT_TYPES.FREELANCE]: 'Autónomo',
  [CONTRACT_TYPES.PART_TIME]: 'Tiempo Parcial',
};

export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  SUSPENDED: 'suspended',
};

export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.ACTIVE]: 'Activo',
  [CONTRACT_STATUS.EXPIRED]: 'Expirado',
  [CONTRACT_STATUS.TERMINATED]: 'Terminado',
  [CONTRACT_STATUS.SUSPENDED]: 'Suspendido',
};

export const CONTRACT_STATUS_COLORS = {
  [CONTRACT_STATUS.ACTIVE]: 'success',
  [CONTRACT_STATUS.EXPIRED]: 'warning',
  [CONTRACT_STATUS.TERMINATED]: 'error',
  [CONTRACT_STATUS.SUSPENDED]: 'default',
};

export const CONTRACT_TYPE_OPTIONS = Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
