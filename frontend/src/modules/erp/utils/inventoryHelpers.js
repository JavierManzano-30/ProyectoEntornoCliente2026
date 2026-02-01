/**
 * Calcular stock disponible
 */
export const calculateAvailableStock = (onHand, reserved = 0) => {
  return Math.max(0, onHand - reserved);
};

/**
 * Calcular valor de stock
 */
export const calculateStockValue = (quantity, unitCost) => {
  return quantity * unitCost;
};

/**
 * Calcular costo promedio ponderado
 */
export const calculateWeightedAverageCost = (movements) => {
  let totalQuantity = 0;
  let totalCost = 0;
  
  movements.forEach(mov => {
    if (mov.type === 'in') {
      totalQuantity += mov.quantity;
      totalCost += mov.quantity * mov.unitCost;
    }
  });
  
  return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

/**
 * Calcular rotación de inventario
 */
export const calculateInventoryTurnover = (costOfGoodsSold, averageInventoryValue) => {
  if (averageInventoryValue === 0) return 0;
  return costOfGoodsSold / averageInventoryValue;
};

/**
 * Calcular días de inventario
 */
export const calculateDaysInventory = (averageInventoryValue, costOfGoodsSold, days = 365) => {
  if (costOfGoodsSold === 0) return 0;
  return (averageInventoryValue / costOfGoodsSold) * days;
};

/**
 * Determinar nivel de stock (bajo, normal, alto)
 */
export const getStockLevel = (currentStock, minStock, maxStock) => {
  if (currentStock <= minStock) return 'low';
  if (currentStock >= maxStock) return 'high';
  return 'normal';
};

/**
 * Calcular punto de reorden
 */
export const calculateReorderPoint = (leadTimeDays, dailyUsage, safetyStock = 0) => {
  return (leadTimeDays * dailyUsage) + safetyStock;
};

/**
 * Calcular cantidad económica de pedido (EOQ)
 */
export const calculateEOQ = (annualDemand, orderingCost, holdingCost) => {
  if (holdingCost === 0) return 0;
  return Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
};

/**
 * Validar movimiento de inventario
 */
export const isValidMovement = (movementType, quantity, currentStock) => {
  if (quantity <= 0) return false;
  
  const outTypes = ['out_sale', 'out_return', 'out_adjustment', 'out_production'];
  
  if (outTypes.includes(movementType)) {
    return currentStock >= quantity;
  }
  
  return true;
};

/**
 * Agrupar productos por categoría
 */
export const groupProductsByCategory = (products) => {
  return products.reduce((groups, product) => {
    const category = product.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});
};

/**
 * Calcular margen de beneficio
 */
export const calculateProfitMargin = (sellingPrice, cost) => {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - cost) / sellingPrice) * 100;
};

/**
 * Calcular markup
 */
export const calculateMarkup = (sellingPrice, cost) => {
  if (cost === 0) return 0;
  return ((sellingPrice - cost) / cost) * 100;
};

/**
 * Generar código de producto (SKU)
 */
export const generateSKU = (category, sequence) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const sequenceStr = sequence.toString().padStart(6, '0');
  return `${categoryCode}-${sequenceStr}`;
};

/**
 * Validar código de lote
 */
export const isValidBatchCode = (code) => {
  // Patrón: LOT-YYYYMMDD-XXX
  const pattern = /^LOT-\d{8}-\d{3}$/;
  return pattern.test(code);
};
