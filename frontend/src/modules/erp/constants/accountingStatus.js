/**
 * Estados de los asientos contables
 */
export const ACCOUNTING_ENTRY_STATUS = {
  DRAFT: 'draft',
  POSTED: 'posted',
  APPROVED: 'approved',
  REVERSED: 'reversed',
  CLOSED: 'closed'
};

export const ACCOUNTING_ENTRY_STATUS_LABELS = {
  [ACCOUNTING_ENTRY_STATUS.DRAFT]: 'Borrador',
  [ACCOUNTING_ENTRY_STATUS.POSTED]: 'Contabilizado',
  [ACCOUNTING_ENTRY_STATUS.APPROVED]: 'Aprobado',
  [ACCOUNTING_ENTRY_STATUS.REVERSED]: 'Revertido',
  [ACCOUNTING_ENTRY_STATUS.CLOSED]: 'Cerrado'
};

export const ACCOUNTING_ENTRY_STATUS_COLORS = {
  [ACCOUNTING_ENTRY_STATUS.DRAFT]: 'gray',
  [ACCOUNTING_ENTRY_STATUS.POSTED]: 'blue',
  [ACCOUNTING_ENTRY_STATUS.APPROVED]: 'green',
  [ACCOUNTING_ENTRY_STATUS.REVERSED]: 'orange',
  [ACCOUNTING_ENTRY_STATUS.CLOSED]: 'red'
};

/**
 * Tipos de asiento contable
 */
export const ENTRY_TYPES = {
  OPENING: 'opening',
  STANDARD: 'standard',
  ADJUSTMENT: 'adjustment',
  CLOSING: 'closing',
  REVERSAL: 'reversal'
};

export const ENTRY_TYPE_LABELS = {
  [ENTRY_TYPES.OPENING]: 'Apertura',
  [ENTRY_TYPES.STANDARD]: 'Estándar',
  [ENTRY_TYPES.ADJUSTMENT]: 'Ajuste',
  [ENTRY_TYPES.CLOSING]: 'Cierre',
  [ENTRY_TYPES.REVERSAL]: 'Reversión'
};

/**
 * Estados de periodos contables
 */
export const PERIOD_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  LOCKED: 'locked'
};

export const PERIOD_STATUS_LABELS = {
  [PERIOD_STATUS.OPEN]: 'Abierto',
  [PERIOD_STATUS.CLOSED]: 'Cerrado',
  [PERIOD_STATUS.LOCKED]: 'Bloqueado'
};

/**
 * Tipos de cuenta contable
 */
export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense'
};

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.ASSET]: 'Activo',
  [ACCOUNT_TYPES.LIABILITY]: 'Pasivo',
  [ACCOUNT_TYPES.EQUITY]: 'Patrimonio',
  [ACCOUNT_TYPES.REVENUE]: 'Ingreso',
  [ACCOUNT_TYPES.EXPENSE]: 'Gasto'
};
