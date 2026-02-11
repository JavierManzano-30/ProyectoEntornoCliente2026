/**
 * Métodos de pago
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  CHECK: 'check',
  PROMISSORY_NOTE: 'promissory_note',
  DIRECT_DEBIT: 'direct_debit',
  MOBILE_PAYMENT: 'mobile_payment'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Efectivo',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Transferencia Bancaria',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Tarjeta de Crédito',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Tarjeta de Débito',
  [PAYMENT_METHODS.CHECK]: 'Cheque',
  [PAYMENT_METHODS.PROMISSORY_NOTE]: 'Pagaré',
  [PAYMENT_METHODS.DIRECT_DEBIT]: 'Domiciliación Bancaria',
  [PAYMENT_METHODS.MOBILE_PAYMENT]: 'Pago Móvil'
};

/**
 * Estados de pagos
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pendiente',
  [PAYMENT_STATUS.PROCESSING]: 'Procesando',
  [PAYMENT_STATUS.COMPLETED]: 'Completado',
  [PAYMENT_STATUS.FAILED]: 'Fallido',
  [PAYMENT_STATUS.CANCELLED]: 'Anulado',
  [PAYMENT_STATUS.REFUNDED]: 'Reembolsado'
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'yellow',
  [PAYMENT_STATUS.PROCESSING]: 'blue',
  [PAYMENT_STATUS.COMPLETED]: 'green',
  [PAYMENT_STATUS.FAILED]: 'red',
  [PAYMENT_STATUS.CANCELLED]: 'gray',
  [PAYMENT_STATUS.REFUNDED]: 'orange'
};

/**
 * Términos de pago
 */
export const PAYMENT_TERMS = {
  IMMEDIATE: 'immediate',
  NET_15: 'net_15',
  NET_30: 'net_30',
  NET_60: 'net_60',
  NET_90: 'net_90',
  END_OF_MONTH: 'end_of_month',
  CUSTOM: 'custom'
};

export const PAYMENT_TERM_LABELS = {
  [PAYMENT_TERMS.IMMEDIATE]: 'Inmediato',
  [PAYMENT_TERMS.NET_15]: 'Neto 15 días',
  [PAYMENT_TERMS.NET_30]: 'Neto 30 días',
  [PAYMENT_TERMS.NET_60]: 'Neto 60 días',
  [PAYMENT_TERMS.NET_90]: 'Neto 90 días',
  [PAYMENT_TERMS.END_OF_MONTH]: 'Fin de mes',
  [PAYMENT_TERMS.CUSTOM]: 'Personalizado'
};
