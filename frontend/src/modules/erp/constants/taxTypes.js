/**
 * Tipos de impuestos
 */
export const TAX_TYPES = {
  VAT: 'vat',
  SALES_TAX: 'sales_tax',
  WITHHOLDING: 'withholding',
  EXCISE: 'excise',
  CUSTOMS: 'customs'
};

export const TAX_TYPE_LABELS = {
  [TAX_TYPES.VAT]: 'IVA',
  [TAX_TYPES.SALES_TAX]: 'Impuesto de Ventas',
  [TAX_TYPES.WITHHOLDING]: 'Retención',
  [TAX_TYPES.EXCISE]: 'Impuesto Especial',
  [TAX_TYPES.CUSTOMS]: 'Arancel'
};

/**
 * Tasas de IVA estándar (España - ajustar según país)
 */
export const VAT_RATES = {
  EXEMPT: 0,
  SUPER_REDUCED: 4,
  REDUCED: 10,
  STANDARD: 21
};

export const VAT_RATE_LABELS = {
  [VAT_RATES.EXEMPT]: 'Exento',
  [VAT_RATES.SUPER_REDUCED]: 'Superreducido (4%)',
  [VAT_RATES.REDUCED]: 'Reducido (10%)',
  [VAT_RATES.STANDARD]: 'General (21%)'
};

/**
 * Estados de declaración de impuestos
 */
export const TAX_DECLARATION_STATUS = {
  DRAFT: 'draft',
  CALCULATED: 'calculated',
  FILED: 'filed',
  PAID: 'paid',
  AMENDED: 'amended'
};

export const TAX_DECLARATION_STATUS_LABELS = {
  [TAX_DECLARATION_STATUS.DRAFT]: 'Borrador',
  [TAX_DECLARATION_STATUS.CALCULATED]: 'Calculada',
  [TAX_DECLARATION_STATUS.FILED]: 'Presentada',
  [TAX_DECLARATION_STATUS.PAID]: 'Pagada',
  [TAX_DECLARATION_STATUS.AMENDED]: 'Rectificada'
};
