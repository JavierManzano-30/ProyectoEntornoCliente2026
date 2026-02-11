/**
 * Calcular costo total de BOM
 */
export const calculateBOMCost = (components) => {
  return components.reduce((total, comp) => {
    return total + (comp.quantity * comp.unitCost);
  }, 0);
};

/**
 * Calcular tiempo total de producción
 */
export const calculateProductionTime = (operations) => {
  return operations.reduce((total, op) => {
    return total + (op.setupTime || 0) + (op.runTime || 0);
  }, 0);
};

/**
 * Calcular costo de mano de obra
 */
export const calculateLaborCost = (operations) => {
  return operations.reduce((total, op) => {
    const time = (op.setupTime || 0) + (op.runTime || 0);
    return total + (time * (op.laborRate || 0));
  }, 0);
};

/**
 * Calcular costo total de producción
 */
export const calculateProductionCost = (materialCost, laborCost, overheadRate = 0) => {
  const directCost = materialCost + laborCost;
  const overhead = directCost * (overheadRate / 100);
  return directCost + overhead;
};

/**
 * Calcular utilización de capacidad
 */
export const calculateCapacityUtilization = (actualHours, availableHours) => {
  if (availableHours === 0) return 0;
  return (actualHours / availableHours) * 100;
};

/**
 * Calcular eficiencia de producción
 */
export const calculateProductionEfficiency = (standardHours, actualHours) => {
  if (actualHours === 0) return 0;
  return (standardHours / actualHours) * 100;
};

/**
 * Calcular cantidad a producir según demanda
 */
export const calculateProductionQuantity = (demand, currentStock, safetyStock = 0) => {
  const required = demand + safetyStock;
  return Math.max(0, required - currentStock);
};

/**
 * Validar que todos los materiales están disponibles
 */
export const areMaterialsAvailable = (bomComponents, inventory) => {
  return bomComponents.every(comp => {
    const item = inventory.find(inv => inv.productId === comp.productId);
    return item && item.availableStock >= comp.quantity;
  });
};

/**
 * Calcular fecha de finalización estimada
 */
export const estimateCompletionDate = (startDate, totalHours, hoursPerDay = 8) => {
  const days = Math.ceil(totalHours / hoursPerDay);
  const completion = new Date(startDate);
  completion.setDate(completion.getDate() + days);
  return completion;
};

/**
 * Calcular progreso de orden de producción
 */
export const calculateOrderProgress = (completedOperations, totalOperations) => {
  if (totalOperations === 0) return 0;
  return (completedOperations / totalOperations) * 100;
};

/**
 * Calcular varianza de costo
 */
export const calculateCostVariance = (standardCost, actualCost) => {
  return actualCost - standardCost;
};

/**
 * Calcular varianza de costo porcentual
 */
export const calculateCostVariancePercentage = (standardCost, actualCost) => {
  if (standardCost === 0) return 0;
  return ((actualCost - standardCost) / standardCost) * 100;
};

/**
 * Generar número de orden de producción
 */
export const generateProductionOrderNumber = (prefix = 'PRD', year, sequence) => {
  const yearShort = year.toString().slice(-2);
  const sequenceStr = sequence.toString().padStart(6, '0');
  return `${prefix}-${yearShort}-${sequenceStr}`;
};

/**
 * Agrupar operaciones por centro de trabajo
 */
export const groupOperationsByWorkCenter = (operations) => {
  return operations.reduce((groups, op) => {
    const workCenter = op.workCenter || 'Unassigned';
    if (!groups[workCenter]) {
      groups[workCenter] = [];
    }
    groups[workCenter].push(op);
    return groups;
  }, {});
};

/**
 * Calcular scrap rate (tasa de desperdicio)
 */
export const calculateScrapRate = (totalProduced, goodUnits) => {
  if (totalProduced === 0) return 0;
  const scrap = totalProduced - goodUnits;
  return (scrap / totalProduced) * 100;
};
