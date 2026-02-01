/**
 * Estados de productos
 */
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued',
  OUT_OF_STOCK: 'out_of_stock'
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.ACTIVE]: 'Activo',
  [PRODUCT_STATUS.INACTIVE]: 'Inactivo',
  [PRODUCT_STATUS.DISCONTINUED]: 'Descontinuado',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'Agotado'
};

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUS.ACTIVE]: 'green',
  [PRODUCT_STATUS.INACTIVE]: 'gray',
  [PRODUCT_STATUS.DISCONTINUED]: 'red',
  [PRODUCT_STATUS.OUT_OF_STOCK]: 'orange'
};

/**
 * Tipos de movimiento de inventario
 */
export const MOVEMENT_TYPES = {
  IN_PURCHASE: 'in_purchase',
  IN_RETURN: 'in_return',
  IN_ADJUSTMENT: 'in_adjustment',
  IN_PRODUCTION: 'in_production',
  OUT_SALE: 'out_sale',
  OUT_RETURN: 'out_return',
  OUT_ADJUSTMENT: 'out_adjustment',
  OUT_PRODUCTION: 'out_production',
  TRANSFER: 'transfer'
};

export const MOVEMENT_TYPE_LABELS = {
  [MOVEMENT_TYPES.IN_PURCHASE]: 'Entrada por Compra',
  [MOVEMENT_TYPES.IN_RETURN]: 'Entrada por Devolución',
  [MOVEMENT_TYPES.IN_ADJUSTMENT]: 'Entrada por Ajuste',
  [MOVEMENT_TYPES.IN_PRODUCTION]: 'Entrada por Producción',
  [MOVEMENT_TYPES.OUT_SALE]: 'Salida por Venta',
  [MOVEMENT_TYPES.OUT_RETURN]: 'Salida por Devolución',
  [MOVEMENT_TYPES.OUT_ADJUSTMENT]: 'Salida por Ajuste',
  [MOVEMENT_TYPES.OUT_PRODUCTION]: 'Salida por Producción',
  [MOVEMENT_TYPES.TRANSFER]: 'Transferencia'
};

/**
 * Estados de órdenes de compra
 */
export const PURCHASE_ORDER_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  CONFIRMED: 'confirmed',
  RECEIVED: 'received',
  PARTIAL: 'partial',
  CANCELLED: 'cancelled'
};

export const PURCHASE_ORDER_STATUS_LABELS = {
  [PURCHASE_ORDER_STATUS.DRAFT]: 'Borrador',
  [PURCHASE_ORDER_STATUS.SENT]: 'Enviada',
  [PURCHASE_ORDER_STATUS.CONFIRMED]: 'Confirmada',
  [PURCHASE_ORDER_STATUS.RECEIVED]: 'Recibida',
  [PURCHASE_ORDER_STATUS.PARTIAL]: 'Recepción Parcial',
  [PURCHASE_ORDER_STATUS.CANCELLED]: 'Anulada'
};

export const PURCHASE_ORDER_STATUS_COLORS = {
  [PURCHASE_ORDER_STATUS.DRAFT]: 'gray',
  [PURCHASE_ORDER_STATUS.SENT]: 'blue',
  [PURCHASE_ORDER_STATUS.CONFIRMED]: 'yellow',
  [PURCHASE_ORDER_STATUS.RECEIVED]: 'green',
  [PURCHASE_ORDER_STATUS.PARTIAL]: 'orange',
  [PURCHASE_ORDER_STATUS.CANCELLED]: 'red'
};

/**
 * Métodos de valoración de inventario
 */
export const VALUATION_METHODS = {
  FIFO: 'fifo',
  LIFO: 'lifo',
  AVERAGE: 'average',
  STANDARD: 'standard'
};

export const VALUATION_METHOD_LABELS = {
  [VALUATION_METHODS.FIFO]: 'FIFO (Primero en Entrar, Primero en Salir)',
  [VALUATION_METHODS.LIFO]: 'LIFO (Último en Entrar, Primero en Salir)',
  [VALUATION_METHODS.AVERAGE]: 'Costo Promedio',
  [VALUATION_METHODS.STANDARD]: 'Costo Estándar'
};
