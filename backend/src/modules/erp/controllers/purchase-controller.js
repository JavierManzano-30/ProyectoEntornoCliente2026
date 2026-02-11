const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const purchaseService = require('../services/purchase-service');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.companyId || req.user?.company_id || null;
}

function mapSupplier(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    legalName: row.legal_name,
    taxId: row.tax_id,
    contactEmail: row.contact_email,
    phone: row.phone,
    address: row.address,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPurchaseOrder(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    supplierId: row.supplier_id,
    orderNumber: row.order_number,
    status: row.status,
    orderDate: row.order_date,
    expectedDeliveryDate: row.expected_delivery_date,
    actualDeliveryDate: row.actual_delivery_date,
    total: row.total,
    currency: row.currency,
    comments: row.comments,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPurchaseItem(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    purchaseOrderId: row.purchase_order_id,
    productId: row.product_id,
    quantityOrdered: row.quantity_ordered,
    quantityReceived: row.quantity_received,
    unitPrice: row.unit_price,
    subtotal: row.subtotal,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPurchaseInvoice(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    purchaseOrderId: row.purchase_order_id,
    supplierId: row.supplier_id,
    invoiceNumber: row.invoice_number,
    status: row.status,
    receivedDate: row.received_date,
    dueDate: row.due_date,
    paidDate: row.paid_date,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    currency: row.currency,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listSuppliers(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = { search: req.query.search };
    const { rows, totalItems } = await purchaseService.listSuppliers(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapSupplier), meta));
  } catch (err) {
    return next(err);
  }
}

async function getSupplier(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.getSupplierById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Supplier not found'));
    }
    return res.json(envelopeSuccess(mapSupplier(row)));
  } catch (err) {
    return next(err);
  }
}

async function createSupplier(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['legalName']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.createSupplier(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapSupplier(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateSupplier(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.updateSupplier(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Supplier not found'));
    }
    return res.json(envelopeSuccess(mapSupplier(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteSupplier(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.deleteSupplier(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Supplier not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listPurchaseOrders(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      status: req.query.status,
      supplierId: req.query.supplierId
    };
    const { rows, totalItems } = await purchaseService.listPurchaseOrders(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapPurchaseOrder), meta));
  } catch (err) {
    return next(err);
  }
}

async function getPurchaseOrder(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.getPurchaseOrderById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de compra no encontrada'));
    }
    const items = await purchaseService.getPurchaseOrderItems(companyId, req.params.id);
    const data = mapPurchaseOrder(row);
    data.items = items.map(mapPurchaseItem);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createPurchaseOrder(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['supplierId', 'orderNumber', 'orderDate', 'total']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const statusErr = validateEnum(req.body.status, ['draft', 'confirmed', 'partially_received', 'received', 'canceled']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.createPurchaseOrder(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapPurchaseOrder(row)));
  } catch (err) {
    return next(err);
  }
}

async function updatePurchaseOrder(req, res, next) {
  try {
    const statusErr = validateEnum(req.body.status, ['draft', 'confirmed', 'partially_received', 'received', 'canceled']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.updatePurchaseOrder(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de compra no encontrada'));
    }
    return res.json(envelopeSuccess(mapPurchaseOrder(row)));
  } catch (err) {
    return next(err);
  }
}

async function deletePurchaseOrder(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.deletePurchaseOrder(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de compra no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function addPurchaseItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const data = { ...req.body, purchaseOrderId: req.params.orderId };
    const row = await purchaseService.addPurchaseItem(companyId, data);
    return res.status(201).json(envelopeSuccess(mapPurchaseItem(row)));
  } catch (err) {
    return next(err);
  }
}

async function updatePurchaseItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.updatePurchaseItem(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Purchase item not found'));
    }
    return res.json(envelopeSuccess(mapPurchaseItem(row)));
  } catch (err) {
    return next(err);
  }
}

async function deletePurchaseItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.deletePurchaseItem(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Purchase item not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listPurchaseInvoices(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = { status: req.query.status };
    const { rows, totalItems } = await purchaseService.listPurchaseInvoices(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapPurchaseInvoice), meta));
  } catch (err) {
    return next(err);
  }
}

async function createPurchaseInvoice(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.createPurchaseInvoice(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapPurchaseInvoice(row)));
  } catch (err) {
    return next(err);
  }
}

async function updatePurchaseInvoice(req, res, next) {
  try {
    const statusErr = validateEnum(req.body.status, ['received', 'validated', 'paid', 'voided']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await purchaseService.updatePurchaseInvoice(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Factura de compra no encontrada'));
    }
    return res.json(envelopeSuccess(mapPurchaseInvoice(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  listPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  addPurchaseItem,
  updatePurchaseItem,
  deletePurchaseItem,
  listPurchaseInvoices,
  createPurchaseInvoice,
  updatePurchaseInvoice
};
