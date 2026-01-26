export const SLA_LEVELS = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const SLA_LEVEL_LABELS = {
  [SLA_LEVELS.BASIC]: 'Básico',
  [SLA_LEVELS.STANDARD]: 'Estándar',
  [SLA_LEVELS.PREMIUM]: 'Premium',
  [SLA_LEVELS.ENTERPRISE]: 'Enterprise',
};

export const SLA_RESPONSE_TIMES = {
  [SLA_LEVELS.BASIC]: {
    baja: 48,
    media: 24,
    alta: 12,
    critica: 4,
  },
  [SLA_LEVELS.STANDARD]: {
    baja: 24,
    media: 12,
    alta: 4,
    critica: 2,
  },
  [SLA_LEVELS.PREMIUM]: {
    baja: 12,
    media: 4,
    alta: 2,
    critica: 1,
  },
  [SLA_LEVELS.ENTERPRISE]: {
    baja: 8,
    media: 2,
    alta: 1,
    critica: 0.5,
  },
};

export const SLA_RESOLUTION_TIMES = {
  [SLA_LEVELS.BASIC]: {
    baja: 120,
    media: 72,
    alta: 48,
    critica: 24,
  },
  [SLA_LEVELS.STANDARD]: {
    baja: 72,
    media: 48,
    alta: 24,
    critica: 12,
  },
  [SLA_LEVELS.PREMIUM]: {
    baja: 48,
    media: 24,
    alta: 12,
    critica: 4,
  },
  [SLA_LEVELS.ENTERPRISE]: {
    baja: 24,
    media: 12,
    alta: 4,
    critica: 2,
  },
};
