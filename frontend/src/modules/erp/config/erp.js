/**
 * ERP Module Configuration
 */

// API Base URL
export const ERP_API_BASE = '/api/erp';

// Módulos del ERP
export const ERP_MODULES = {
  ACCOUNTING: 'accounting',
  PURCHASES: 'purchases',
  SALES: 'sales',
  INVENTORY: 'inventory',
  PRODUCTION: 'production',
  PROJECTS: 'projects',
  TREASURY: 'treasury',
  REPORTING: 'reporting'
};

// Labels de módulos
export const ERP_MODULE_LABELS = {
  [ERP_MODULES.ACCOUNTING]: 'Contabilidad',
  [ERP_MODULES.PURCHASES]: 'Compras',
  [ERP_MODULES.SALES]: 'Ventas',
  [ERP_MODULES.INVENTORY]: 'Inventario',
  [ERP_MODULES.PRODUCTION]: 'Producción',
  [ERP_MODULES.PROJECTS]: 'Proyectos',
  [ERP_MODULES.TREASURY]: 'Tesorería',
  [ERP_MODULES.REPORTING]: 'Reportes'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Configuración de fechas
export const DATE_CONFIG = {
  DEFAULT_DATE_FORMAT: 'DD/MM/YYYY',
  API_DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm'
};

// Configuración de monedas
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: 'EUR',
  DECIMAL_PLACES: 2,
  THOUSAND_SEPARATOR: '.',
  DECIMAL_SEPARATOR: ','
};

// Configuración de exportación
export const EXPORT_CONFIG = {
  MAX_ROWS_EXCEL: 10000,
  MAX_ROWS_PDF: 1000,
  SUPPORTED_FORMATS: ['pdf', 'excel', 'csv']
};

// Períodos fiscales comunes
export const FISCAL_PERIODS = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

export const FISCAL_PERIOD_LABELS = {
  [FISCAL_PERIODS.MONTHLY]: 'Mensual',
  [FISCAL_PERIODS.QUARTERLY]: 'Trimestral',
  [FISCAL_PERIODS.YEARLY]: 'Anual'
};

// Configuración de reportes
export const REPORT_CONFIG = {
  DEFAULT_PERIOD: FISCAL_PERIODS.MONTHLY,
  MAX_COMPARISON_PERIODS: 5,
  CHART_COLORS: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
};
