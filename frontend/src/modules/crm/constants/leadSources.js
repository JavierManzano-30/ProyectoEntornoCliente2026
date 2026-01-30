export const LEAD_SOURCES = {
  WEB: 'web',
  TELEFONO: 'telefono',
  EMAIL: 'email',
  REDES_SOCIALES: 'redes_sociales',
  REFERIDO: 'referido',
  EVENTO: 'evento',
  PUBLICIDAD: 'publicidad',
  OTRO: 'otro',
};

export const LEAD_SOURCE_LABELS = {
  [LEAD_SOURCES.WEB]: 'Sitio Web',
  [LEAD_SOURCES.TELEFONO]: 'Teléfono',
  [LEAD_SOURCES.EMAIL]: 'Email',
  [LEAD_SOURCES.REDES_SOCIALES]: 'Redes Sociales',
  [LEAD_SOURCES.REFERIDO]: 'Referido',
  [LEAD_SOURCES.EVENTO]: 'Evento',
  [LEAD_SOURCES.PUBLICIDAD]: 'Publicidad',
  [LEAD_SOURCES.OTRO]: 'Otro',
};

export const LEAD_STATUS = {
  NUEVO: 'nuevo',
  CONTACTADO: 'contactado',
  CALIFICADO: 'calificado',
  DESCALIFICADO: 'descalificado',
  CONVERTIDO: 'convertido',
};

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NUEVO]: 'Nuevo',
  [LEAD_STATUS.CONTACTADO]: 'Contactado',
  [LEAD_STATUS.CALIFICADO]: 'Calificado',
  [LEAD_STATUS.DESCALIFICADO]: 'Descalificado',
  [LEAD_STATUS.CONVERTIDO]: 'Convertido',
};

export const LEAD_STATUS_COLORS = {
  [LEAD_STATUS.NUEVO]: 'info',
  [LEAD_STATUS.CONTACTADO]: 'warning',
  [LEAD_STATUS.CALIFICADO]: 'success',
  [LEAD_STATUS.DESCALIFICADO]: 'error',
  [LEAD_STATUS.CONVERTIDO]: 'primary',
};
