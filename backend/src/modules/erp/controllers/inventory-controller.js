const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const inventoryService = require('../services/inventory-service');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.empresaId || req.user?.company_id || null;
}

function mapWarehouse(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    location: row.location,
    totalCapacity: row.total_capacity,
    responsibleId: row.responsible_id,
    type: row.type,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapInventory(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    productId: row.product_id,
    warehouseId: row.warehouse_id,
    quantityAvailable: row.quantity_available,
    quantityReserved: row.quantity_reserved,
    minimumQuantity: row.minimum_quantity,
    maximumQuantity: row.maximum_quantity,
    lastMovementAt: row.last_movement_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapMovement(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    productId: row.product_id,
    warehouseId: row.warehouse_id,
    movementType: row.movement_type,
    quantity: row.quantity,
    referenceType: row.reference_type,
    referenceId: row.reference_id,
    description: row.description,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listWarehouses(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const { rows, totalItems } = await inventoryService.listWarehouses(companyId, { limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapWarehouse), meta));
  } catch (err) {
    return next(err);
  }
}

async function createWarehouse(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['name']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', errors));
    }
    const typeErr = validateEnum(req.body.type, ['main', 'secondary', 'transit']);
    if (typeErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', typeErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.createWarehouse(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapWarehouse(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateWarehouse(req, res, next) {
  try {
    const typeErr = validateEnum(req.body.type, ['main', 'secondary', 'transit']);
    if (typeErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', typeErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.updateWarehouse(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Almacen no encontrado'));
    }
    return res.json(envelopeSuccess(mapWarehouse(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteWarehouse(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.deleteWarehouse(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Almacen no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listInventory(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      warehouseId: req.query.warehouseId,
      productId: req.query.productId
    };
    const { rows, totalItems } = await inventoryService.listInventory(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapInventory), meta));
  } catch (err) {
    return next(err);
  }
}

async function getInventoryItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.getInventoryById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de inventario no encontrado'));
    }
    return res.json(envelopeSuccess(mapInventory(row)));
  } catch (err) {
    return next(err);
  }
}

async function createInventoryItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.createInventoryItem(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapInventory(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateInventoryItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.updateInventoryItem(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de inventario no encontrado'));
    }
    return res.json(envelopeSuccess(mapInventory(row)));
  } catch (err) {
    return next(err);
  }
}

async function listMovements(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      productId: req.query.productId,
      warehouseId: req.query.warehouseId,
      movementType: req.query.movementType
    };
    const { rows, totalItems } = await inventoryService.listMovements(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapMovement), meta));
  } catch (err) {
    return next(err);
  }
}

async function createMovement(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['productId', 'warehouseId', 'movementType', 'quantity', 'userId']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', errors));
    }
    const typeErr = validateEnum(req.body.movementType, ['in', 'out', 'adjustment', 'return', 'transfer']);
    if (typeErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', typeErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await inventoryService.createMovement(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapMovement(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  listInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  listMovements,
  createMovement
};
