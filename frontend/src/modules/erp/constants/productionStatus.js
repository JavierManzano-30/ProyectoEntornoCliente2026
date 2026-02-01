/**
 * Estados de órdenes de producción
 */
export const PRODUCTION_ORDER_STATUS = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  RELEASED: 'released',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PRODUCTION_ORDER_STATUS_LABELS = {
  [PRODUCTION_ORDER_STATUS.DRAFT]: 'Borrador',
  [PRODUCTION_ORDER_STATUS.PLANNED]: 'Planificada',
  [PRODUCTION_ORDER_STATUS.RELEASED]: 'Liberada',
  [PRODUCTION_ORDER_STATUS.IN_PROGRESS]: 'En Proceso',
  [PRODUCTION_ORDER_STATUS.COMPLETED]: 'Completada',
  [PRODUCTION_ORDER_STATUS.CANCELLED]: 'Anulada'
};

export const PRODUCTION_ORDER_STATUS_COLORS = {
  [PRODUCTION_ORDER_STATUS.DRAFT]: 'gray',
  [PRODUCTION_ORDER_STATUS.PLANNED]: 'blue',
  [PRODUCTION_ORDER_STATUS.RELEASED]: 'yellow',
  [PRODUCTION_ORDER_STATUS.IN_PROGRESS]: 'orange',
  [PRODUCTION_ORDER_STATUS.COMPLETED]: 'green',
  [PRODUCTION_ORDER_STATUS.CANCELLED]: 'red'
};

/**
 * Tipos de componente BOM
 */
export const BOM_COMPONENT_TYPES = {
  MATERIAL: 'material',
  LABOR: 'labor',
  OVERHEAD: 'overhead',
  SUBASSEMBLY: 'subassembly'
};

export const BOM_COMPONENT_TYPE_LABELS = {
  [BOM_COMPONENT_TYPES.MATERIAL]: 'Material',
  [BOM_COMPONENT_TYPES.LABOR]: 'Mano de Obra',
  [BOM_COMPONENT_TYPES.OVERHEAD]: 'Gastos Generales',
  [BOM_COMPONENT_TYPES.SUBASSEMBLY]: 'Subensamble'
};

/**
 * Estados de operaciones de ruta
 */
export const OPERATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked'
};

export const OPERATION_STATUS_LABELS = {
  [OPERATION_STATUS.PENDING]: 'Pendiente',
  [OPERATION_STATUS.IN_PROGRESS]: 'En Proceso',
  [OPERATION_STATUS.COMPLETED]: 'Completada',
  [OPERATION_STATUS.BLOCKED]: 'Bloqueada'
};
