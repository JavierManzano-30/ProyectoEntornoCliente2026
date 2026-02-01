/**
 * Estados de facturas (ventas y compras)
 */
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  SENT: 'sent',
  PAID: 'paid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Borrador',
  [INVOICE_STATUS.PENDING]: 'Pendiente',
  [INVOICE_STATUS.SENT]: 'Enviada',
  [INVOICE_STATUS.PAID]: 'Pagada',
  [INVOICE_STATUS.PARTIAL]: 'Pago Parcial',
  [INVOICE_STATUS.OVERDUE]: 'Vencida',
  [INVOICE_STATUS.CANCELLED]: 'Anulada'
};

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: 'gray',
  [INVOICE_STATUS.PENDING]: 'yellow',
  [INVOICE_STATUS.SENT]: 'blue',
  [INVOICE_STATUS.PAID]: 'green',
  [INVOICE_STATUS.PARTIAL]: 'orange',
  [INVOICE_STATUS.OVERDUE]: 'red',
  [INVOICE_STATUS.CANCELLED]: 'gray'
};

/**
 * Tipos de factura
 */
export const INVOICE_TYPES = {
  STANDARD: 'standard',
  CREDIT_NOTE: 'credit_note',
  DEBIT_NOTE: 'debit_note',
  PROFORMA: 'proforma',
  RECURRING: 'recurring'
};

export const INVOICE_TYPE_LABELS = {
  [INVOICE_TYPES.STANDARD]: 'Factura',
  [INVOICE_TYPES.CREDIT_NOTE]: 'Nota de Crédito',
  [INVOICE_TYPES.DEBIT_NOTE]: 'Nota de Débito',
  [INVOICE_TYPES.PROFORMA]: 'Proforma',
  [INVOICE_TYPES.RECURRING]: 'Recurrente'
};
