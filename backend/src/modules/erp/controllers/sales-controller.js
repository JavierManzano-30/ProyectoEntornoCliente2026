const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const salesService = require('../services/sales-service');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.companyId || req.user?.company_id || null;
}

function mapSalesOrder(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    orderNumber: row.order_number,
    status: row.status,
    orderDate: row.order_date,
    expectedDeliveryDate: row.expected_delivery_date,
    actualDeliveryDate: row.actual_delivery_date,
    subtotal: row.subtotal,
    tax: row.tax,
    total: row.total,
    currency: row.currency,
    paymentTerms: row.payment_terms,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSalesItem(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    salesOrderId: row.sales_order_id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    discountPercentage: row.discount_percentage,
    subtotal: row.subtotal,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapInvoice(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    salesOrderId: row.sales_order_id,
    clientId: row.client_id,
    invoiceNumber: row.invoice_number,
    status: row.status,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    paidDate: row.paid_date,
    subtotal: row.subtotal,
    taxPercent: row.tax_percent,
    taxAmount: row.tax_amount,
    total: row.total,
    currency: row.currency,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listSalesOrders(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      status: req.query.status,
      clientId: req.query.clientId
    };
    const { rows, totalItems } = await salesService.listSalesOrders(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapSalesOrder), meta));
  } catch (err) {
    return next(err);
  }
}

async function getSalesOrder(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await salesService.getSalesOrderById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de venta no encontrada'));
    }
    const items = await salesService.getSalesOrderItems(companyId, req.params.id);
    const data = mapSalesOrder(row);
    data.items = items.map(mapSalesItem);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createSalesOrder(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['clientId', 'orderNumber', 'orderDate', 'subtotal', 'tax', 'total']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const statusErr = validateEnum(req.body.status, ['quote', 'confirmed', 'packed', 'shipped', 'delivered', 'canceled']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await salesService.createSalesOrder(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapSalesOrder(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateSalesOrder(req, res, next) {
  try {
    const statusErr = validateEnum(req.body.status, ['quote', 'confirmed', 'packed', 'shipped', 'delivered', 'canceled']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await salesService.updateSalesOrder(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de venta no encontrada'));
    }
    return res.json(envelopeSuccess(mapSalesOrder(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteSalesOrder(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await salesService.deleteSalesOrder(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Orden de venta no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function addSalesItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const data = { ...req.body, salesOrderId: req.params.orderId };
    const row = await salesService.addSalesItem(companyId, data);
    return res.status(201).json(envelopeSuccess(mapSalesItem(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateSalesItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await salesService.updateSalesItem(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Sales item not found'));
    }
    return res.json(envelopeSuccess(mapSalesItem(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteSalesItem(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await salesService.deleteSalesItem(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Sales item not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listInvoices(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req);
    const filters = {
      status: req.query.status,
      clientId: req.query.clientId
    };
    const { rows, totalItems } = await salesService.listInvoices(companyId, { filters, limit, offset });
    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(rows.map(mapInvoice), meta));
  } catch (err) {
    return next(err);
  }
}

async function getInvoice(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const row = await salesService.getInvoiceById(companyId, req.params.id);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Factura no encontrada'));
    }
    return res.json(envelopeSuccess(mapInvoice(row)));
  } catch (err) {
    return next(err);
  }
}

async function createInvoice(req, res, next) {
  try {
    const errors = validateRequiredFields(req.body, ['clientId', 'invoiceNumber', 'issueDate', 'subtotal', 'total']);
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }
    const statusErr = validateEnum(req.body.status, ['draft', 'issued', 'voided', 'paid']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await salesService.createInvoice(companyId, req.body);
    return res.status(201).json(envelopeSuccess(mapInvoice(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateInvoice(req, res, next) {
  try {
    const statusErr = validateEnum(req.body.status, ['draft', 'issued', 'voided', 'paid']);
    if (statusErr) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', statusErr));
    }
    const companyId = resolveCompanyId(req);
    const row = await salesService.updateInvoice(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Factura no encontrada'));
    }
    return res.json(envelopeSuccess(mapInvoice(row)));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  addSalesItem,
  updateSalesItem,
  deleteSalesItem,
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice
};
