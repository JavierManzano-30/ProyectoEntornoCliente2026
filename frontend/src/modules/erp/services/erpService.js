import axios from '../../../lib/axios';

/**
 * ERP Service - Servicios API para el módulo ERP
 * Incluye endpoints para: Contabilidad, Compras, Ventas, Inventario, 
 * Producción, Proyectos, Tesorería y Reporting
 */

const BASE_URL = '/erp';

// ==================== CONTABILIDAD ====================

/**
 * Obtener plan contable
 */
export const getChartOfAccounts = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/accounting/chart-of-accounts`, { params: filters });
  return response.data;
};

/**
 * Obtener cuenta contable por ID
 */
export const getAccountById = async (accountId) => {
  const response = await axios.get(`${BASE_URL}/accounting/accounts/${accountId}`);
  return response.data;
};

/**
 * Crear cuenta contable
 */
export const createAccount = async (accountData) => {
  const response = await axios.post(`${BASE_URL}/accounting/accounts`, accountData);
  return response.data;
};

/**
 * Actualizar cuenta contable
 */
export const updateAccount = async (accountId, accountData) => {
  const response = await axios.put(`${BASE_URL}/accounting/accounts/${accountId}`, accountData);
  return response.data;
};

/**
 * Obtener asientos contables
 */
export const getJournalEntries = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/accounting/journal-entries`, { params: filters });
  return response.data;
};

/**
 * Obtener asiento contable por ID
 */
export const getJournalEntryById = async (entryId) => {
  const response = await axios.get(`${BASE_URL}/accounting/journal-entries/${entryId}`);
  return response.data;
};

/**
 * Crear asiento contable
 */
export const createJournalEntry = async (entryData) => {
  const response = await axios.post(`${BASE_URL}/accounting/journal-entries`, entryData);
  return response.data;
};

/**
 * Actualizar asiento contable
 */
export const updateJournalEntry = async (entryId, entryData) => {
  const response = await axios.put(`${BASE_URL}/accounting/journal-entries/${entryId}`, entryData);
  return response.data;
};

/**
 * Contabilizar asiento
 */
export const postJournalEntry = async (entryId) => {
  const response = await axios.post(`${BASE_URL}/accounting/journal-entries/${entryId}/post`);
  return response.data;
};

/**
 * Revertir asiento
 */
export const reverseJournalEntry = async (entryId, reverseData) => {
  const response = await axios.post(`${BASE_URL}/accounting/journal-entries/${entryId}/reverse`, reverseData);
  return response.data;
};

/**
 * Obtener balance de comprobación
 */
export const getTrialBalance = async (params) => {
  const response = await axios.get(`${BASE_URL}/accounting/reports/trial-balance`, { params });
  return response.data;
};

/**
 * Obtener libro mayor
 */
export const getGeneralLedger = async (params) => {
  const response = await axios.get(`${BASE_URL}/accounting/reports/general-ledger`, { params });
  return response.data;
};

// ==================== COMPRAS ====================

/**
 * Obtener órdenes de compra
 */
export const getPurchaseOrders = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/purchases/orders`, { params: filters });
  return response.data;
};

/**
 * Obtener orden de compra por ID
 */
export const getPurchaseOrderById = async (orderId) => {
  const response = await axios.get(`${BASE_URL}/purchases/orders/${orderId}`);
  return response.data;
};

/**
 * Crear orden de compra
 */
export const createPurchaseOrder = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/purchases/orders`, orderData);
  return response.data;
};

/**
 * Actualizar orden de compra
 */
export const updatePurchaseOrder = async (orderId, orderData) => {
  const response = await axios.put(`${BASE_URL}/purchases/orders/${orderId}`, orderData);
  return response.data;
};

/**
 * Confirmar orden de compra
 */
export const confirmPurchaseOrder = async (orderId) => {
  const response = await axios.post(`${BASE_URL}/purchases/orders/${orderId}/confirm`);
  return response.data;
};

/**
 * Registrar recepción de mercancía
 */
export const createGoodsReceipt = async (receiptData) => {
  const response = await axios.post(`${BASE_URL}/purchases/goods-receipts`, receiptData);
  return response.data;
};

/**
 * Obtener proveedores
 */
export const getVendors = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/purchases/vendors`, { params: filters });
  return response.data;
};

/**
 * Obtener proveedor por ID
 */
export const getVendorById = async (vendorId) => {
  const response = await axios.get(`${BASE_URL}/purchases/vendors/${vendorId}`);
  return response.data;
};

/**
 * Crear proveedor
 */
export const createVendor = async (vendorData) => {
  const response = await axios.post(`${BASE_URL}/purchases/vendors`, vendorData);
  return response.data;
};

/**
 * Actualizar proveedor
 */
export const updateVendor = async (vendorId, vendorData) => {
  const response = await axios.put(`${BASE_URL}/purchases/vendors/${vendorId}`, vendorData);
  return response.data;
};

// ==================== VENTAS ====================

/**
 * Obtener facturas de venta
 */
export const getSalesInvoices = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/sales/invoices`, { params: filters });
  return response.data;
};

/**
 * Obtener factura de venta por ID
 */
export const getSalesInvoiceById = async (invoiceId) => {
  const response = await axios.get(`${BASE_URL}/sales/invoices/${invoiceId}`);
  return response.data;
};

/**
 * Crear factura de venta
 */
export const createSalesInvoice = async (invoiceData) => {
  const response = await axios.post(`${BASE_URL}/sales/invoices`, invoiceData);
  return response.data;
};

/**
 * Actualizar factura de venta
 */
export const updateSalesInvoice = async (invoiceId, invoiceData) => {
  const response = await axios.put(`${BASE_URL}/sales/invoices/${invoiceId}`, invoiceData);
  return response.data;
};

/**
 * Enviar factura por email
 */
export const sendInvoiceEmail = async (invoiceId, emailData) => {
  const response = await axios.post(`${BASE_URL}/sales/invoices/${invoiceId}/send`, emailData);
  return response.data;
};

/**
 * Registrar pago de factura
 */
export const recordInvoicePayment = async (invoiceId, paymentData) => {
  const response = await axios.post(`${BASE_URL}/sales/invoices/${invoiceId}/payments`, paymentData);
  return response.data;
};

/**
 * Obtener cuentas por cobrar
 */
export const getAccountsReceivable = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/sales/receivables`, { params: filters });
  return response.data;
};

/**
 * Obtener reporte de antigüedad de saldos
 */
export const getAgingReport = async (params) => {
  const response = await axios.get(`${BASE_URL}/sales/reports/aging`, { params });
  return response.data;
};

// ==================== INVENTARIO ====================

/**
 * Obtener productos
 */
export const getProducts = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/inventory/products`, { params: filters });
  return response.data;
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (productId) => {
  const response = await axios.get(`${BASE_URL}/inventory/products/${productId}`);
  return response.data;
};

/**
 * Crear producto
 */
export const createProduct = async (productData) => {
  const response = await axios.post(`${BASE_URL}/inventory/products`, productData);
  return response.data;
};

/**
 * Actualizar producto
 */
export const updateProduct = async (productId, productData) => {
  const response = await axios.put(`${BASE_URL}/inventory/products/${productId}`, productData);
  return response.data;
};

/**
 * Obtener stock actual
 */
export const getStockLevels = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/inventory/stock`, { params: filters });
  return response.data;
};

/**
 * Obtener movimientos de inventario
 */
export const getInventoryMovements = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/inventory/movements`, { params: filters });
  return response.data;
};

/**
 * Registrar movimiento de inventario
 */
export const createInventoryMovement = async (movementData) => {
  const response = await axios.post(`${BASE_URL}/inventory/movements`, movementData);
  return response.data;
};

/**
 * Obtener almacenes
 */
export const getWarehouses = async () => {
  const response = await axios.get(`${BASE_URL}/inventory/warehouses`);
  return response.data;
};

/**
 * Realizar conteo cíclico
 */
export const createCycleCount = async (countData) => {
  const response = await axios.post(`${BASE_URL}/inventory/cycle-counts`, countData);
  return response.data;
};

/**
 * Obtener reporte de valoración de inventario
 */
export const getInventoryValuation = async (params) => {
  const response = await axios.get(`${BASE_URL}/inventory/reports/valuation`, { params });
  return response.data;
};

// ==================== PRODUCCIÓN ====================

/**
 * Obtener órdenes de producción
 */
export const getProductionOrders = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/production/orders`, { params: filters });
  return response.data;
};

/**
 * Obtener orden de producción por ID
 */
export const getProductionOrderById = async (orderId) => {
  const response = await axios.get(`${BASE_URL}/production/orders/${orderId}`);
  return response.data;
};

/**
 * Crear orden de producción
 */
export const createProductionOrder = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/production/orders`, orderData);
  return response.data;
};

/**
 * Actualizar orden de producción
 */
export const updateProductionOrder = async (orderId, orderData) => {
  const response = await axios.put(`${BASE_URL}/production/orders/${orderId}`, orderData);
  return response.data;
};

/**
 * Liberar orden de producción
 */
export const releaseProductionOrder = async (orderId) => {
  const response = await axios.post(`${BASE_URL}/production/orders/${orderId}/release`);
  return response.data;
};

/**
 * Completar orden de producción
 */
export const completeProductionOrder = async (orderId, completionData) => {
  const response = await axios.post(`${BASE_URL}/production/orders/${orderId}/complete`, completionData);
  return response.data;
};

/**
 * Obtener BOMs (Bill of Materials)
 */
export const getBOMs = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/production/boms`, { params: filters });
  return response.data;
};

/**
 * Obtener BOM por ID
 */
export const getBOMById = async (bomId) => {
  const response = await axios.get(`${BASE_URL}/production/boms/${bomId}`);
  return response.data;
};

/**
 * Crear BOM
 */
export const createBOM = async (bomData) => {
  const response = await axios.post(`${BASE_URL}/production/boms`, bomData);
  return response.data;
};

/**
 * Obtener rutas de producción
 */
export const getRoutes = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/production/routes`, { params: filters });
  return response.data;
};

// ==================== PROYECTOS ====================

/**
 * Obtener proyectos de coste
 */
export const getCostProjects = async (filters = {}) => {
  const response = await axios.get(`${BASE_URL}/projects`, { params: filters });
  return response.data;
};

/**
 * Obtener proyecto por ID
 */
export const getCostProjectById = async (projectId) => {
  const response = await axios.get(`${BASE_URL}/projects/${projectId}`);
  return response.data;
};

/**
 * Crear proyecto de coste
 */
export const createCostProject = async (projectData) => {
  const response = await axios.post(`${BASE_URL}/projects`, projectData);
  return response.data;
};

/**
 * Actualizar proyecto de coste
 */
export const updateCostProject = async (projectId, projectData) => {
  const response = await axios.put(`${BASE_URL}/projects/${projectId}`, projectData);
  return response.data;
};

/**
 * Registrar imputación de tiempo/coste
 */
export const createCostAllocation = async (allocationData) => {
  const response = await axios.post(`${BASE_URL}/projects/allocations`, allocationData);
  return response.data;
};

/**
 * Obtener presupuesto vs real
 */
export const getProjectBudgetComparison = async (projectId, params) => {
  const response = await axios.get(`${BASE_URL}/projects/${projectId}/budget-comparison`, { params });
  return response.data;
};

/**
 * Obtener análisis de rentabilidad
 */
export const getProjectProfitability = async (projectId) => {
  const response = await axios.get(`${BASE_URL}/projects/${projectId}/profitability`);
  return response.data;
};

// ==================== TESORERÍA ====================

/**
 * Obtener cuentas bancarias
 */
export const getBankAccounts = async () => {
  const response = await axios.get(`${BASE_URL}/treasury/bank-accounts`);
  return response.data;
};

/**
 * Obtener cuenta bancaria por ID
 */
export const getBankAccountById = async (accountId) => {
  const response = await axios.get(`${BASE_URL}/treasury/bank-accounts/${accountId}`);
  return response.data;
};

/**
 * Crear cuenta bancaria
 */
export const createBankAccount = async (accountData) => {
  const response = await axios.post(`${BASE_URL}/treasury/bank-accounts`, accountData);
  return response.data;
};

/**
 * Obtener movimientos bancarios
 */
export const getBankMovements = async (accountId, filters = {}) => {
  const response = await axios.get(`${BASE_URL}/treasury/bank-accounts/${accountId}/movements`, { params: filters });
  return response.data;
};

/**
 * Registrar movimiento bancario
 */
export const createBankMovement = async (movementData) => {
  const response = await axios.post(`${BASE_URL}/treasury/movements`, movementData);
  return response.data;
};

/**
 * Obtener conciliaciones bancarias
 */
export const getBankReconciliations = async (accountId, filters = {}) => {
  const response = await axios.get(`${BASE_URL}/treasury/bank-accounts/${accountId}/reconciliations`, { params: filters });
  return response.data;
};

/**
 * Crear conciliación bancaria
 */
export const createBankReconciliation = async (reconciliationData) => {
  const response = await axios.post(`${BASE_URL}/treasury/reconciliations`, reconciliationData);
  return response.data;
};

/**
 * Obtener previsión de tesorería
 */
export const getCashFlowForecast = async (params) => {
  const response = await axios.get(`${BASE_URL}/treasury/reports/cash-flow-forecast`, { params });
  return response.data;
};

/**
 * Obtener posición de tesorería
 */
export const getTreasuryPosition = async (date) => {
  const response = await axios.get(`${BASE_URL}/treasury/reports/position`, { params: { date } });
  return response.data;
};

// ==================== REPORTING ====================

/**
 * Obtener balance general
 */
export const getBalanceSheet = async (params) => {
  const response = await axios.get(`${BASE_URL}/reports/balance-sheet`, { params });
  return response.data;
};

/**
 * Obtener estado de resultados
 */
export const getIncomeStatement = async (params) => {
  const response = await axios.get(`${BASE_URL}/reports/income-statement`, { params });
  return response.data;
};

/**
 * Obtener flujo de efectivo
 */
export const getCashFlowStatement = async (params) => {
  const response = await axios.get(`${BASE_URL}/reports/cash-flow-statement`, { params });
  return response.data;
};

/**
 * Obtener análisis de costes
 */
export const getCostAnalysis = async (params) => {
  const response = await axios.get(`${BASE_URL}/reports/cost-analysis`, { params });
  return response.data;
};

/**
 * Obtener KPIs financieros
 */
export const getFinancialKPIs = async (params) => {
  const response = await axios.get(`${BASE_URL}/reports/financial-kpis`, { params });
  return response.data;
};

/**
 * Exportar reporte a PDF
 */
export const exportReportPDF = async (reportType, params) => {
  const response = await axios.get(`${BASE_URL}/reports/${reportType}/export/pdf`, { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Exportar reporte a Excel
 */
export const exportReportExcel = async (reportType, params) => {
  const response = await axios.get(`${BASE_URL}/reports/${reportType}/export/excel`, { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

export default {
  // Contabilidad
  getChartOfAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  getJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  postJournalEntry,
  reverseJournalEntry,
  getTrialBalance,
  getGeneralLedger,
  
  // Compras
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  confirmPurchaseOrder,
  createGoodsReceipt,
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  
  // Ventas
  getSalesInvoices,
  getSalesInvoiceById,
  createSalesInvoice,
  updateSalesInvoice,
  sendInvoiceEmail,
  recordInvoicePayment,
  getAccountsReceivable,
  getAgingReport,
  
  // Inventario
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  getStockLevels,
  getInventoryMovements,
  createInventoryMovement,
  getWarehouses,
  createCycleCount,
  getInventoryValuation,
  
  // Producción
  getProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  releaseProductionOrder,
  completeProductionOrder,
  getBOMs,
  getBOMById,
  createBOM,
  getRoutes,
  
  // Proyectos
  getCostProjects,
  getCostProjectById,
  createCostProject,
  updateCostProject,
  createCostAllocation,
  getProjectBudgetComparison,
  getProjectProfitability,
  
  // Tesorería
  getBankAccounts,
  getBankAccountById,
  createBankAccount,
  getBankMovements,
  createBankMovement,
  getBankReconciliations,
  createBankReconciliation,
  getCashFlowForecast,
  getTreasuryPosition,
  
  // Reporting
  getBalanceSheet,
  getIncomeStatement,
  getCashFlowStatement,
  getCostAnalysis,
  getFinancialKPIs,
  exportReportPDF,
  exportReportExcel
};
