const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listSuppliers(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.search) {
    values.push(`%${filters.search}%`);
    clauses.push(`(legal_name ILIKE $${values.length} OR tax_id ILIKE $${values.length})`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_suppliers ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_suppliers ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function getSupplierById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_suppliers WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createSupplier(companyId, data) {
  const now = new Date().toISOString();
  const result = await pool.query(
    `INSERT INTO erp_suppliers (company_id, legal_name, tax_id, contact_email, phone, address, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [companyId, data.legalName, data.taxId || null, data.contactEmail || null,
     data.phone || null, data.address || null, now, now]
  );
  return result.rows[0];
}

async function updateSupplier(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.legalName, data.taxId || null, data.contactEmail || null,
    data.phone || null, data.address || null, now, id
  ];
  let query = `UPDATE erp_suppliers SET legal_name=$1, tax_id=$2, contact_email=$3, phone=$4, address=$5, updated_at=$6 WHERE id=$7`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteSupplier(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_suppliers WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listPurchaseOrders(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    clauses.push(`status = $${values.length}`);
  }
  if (filters.supplierId) {
    values.push(filters.supplierId);
    clauses.push(`supplier_id = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_purchase_orders ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_purchase_orders ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function getPurchaseOrderById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_purchase_orders WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function getPurchaseOrderItems(companyId, orderId) {
  const values = [orderId];
  let query = 'SELECT * FROM erp_purchase_items WHERE purchase_order_id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  query += ' ORDER BY created_at ASC';
  const result = await pool.query(query, values);
  return result.rows;
}

async function createPurchaseOrder(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_po');
  const result = await pool.query(
    `INSERT INTO erp_purchase_orders
      (id, company_id, supplier_id, order_number, status, order_date, expected_delivery_date, actual_delivery_date, total, currency, comments, created_by, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [id, companyId, data.supplierId, data.orderNumber,
     data.status || 'draft', data.orderDate, data.expectedDeliveryDate || null,
     data.actualDeliveryDate || null, data.total, data.currency || 'COP',
     data.comments || null, data.createdBy || null, now, now]
  );
  return result.rows[0];
}

async function updatePurchaseOrder(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.supplierId, data.orderNumber, data.status || 'draft',
    data.orderDate, data.expectedDeliveryDate || null,
    data.actualDeliveryDate || null, data.total, data.currency || 'COP',
    data.comments || null, now, id
  ];
  let query = `UPDATE erp_purchase_orders SET
    supplier_id=$1, order_number=$2, status=$3, order_date=$4,
    expected_delivery_date=$5, actual_delivery_date=$6, total=$7,
    currency=$8, comments=$9, updated_at=$10
    WHERE id=$11`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deletePurchaseOrder(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_purchase_orders WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function addPurchaseItem(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_pi');
  const result = await pool.query(
    `INSERT INTO erp_purchase_items
      (id, company_id, purchase_order_id, product_id, quantity_ordered, quantity_received, unit_price, subtotal, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [id, companyId, data.purchaseOrderId, data.productId,
     data.quantityOrdered, data.quantityReceived || 0,
     data.unitPrice, data.subtotal, now, now]
  );
  return result.rows[0];
}

async function updatePurchaseItem(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.productId, data.quantityOrdered, data.quantityReceived || 0,
    data.unitPrice, data.subtotal, now, id
  ];
  let query = `UPDATE erp_purchase_items SET
    product_id=$1, quantity_ordered=$2, quantity_received=$3,
    unit_price=$4, subtotal=$5, updated_at=$6
    WHERE id=$7`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deletePurchaseItem(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_purchase_items WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listPurchaseInvoices(companyId, { filters, limit, offset }) {
  const values = [];
  const clauses = [];
  if (companyId) {
    values.push(companyId);
    clauses.push(`company_id = $${values.length}`);
  }
  if (filters.status) {
    values.push(filters.status);
    clauses.push(`status = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM erp_purchase_invoices ${where}`, values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT * FROM erp_purchase_invoices ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return { rows: rows.rows, totalItems };
}

async function createPurchaseInvoice(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_pinv');
  const result = await pool.query(
    `INSERT INTO erp_purchase_invoices
      (id, company_id, purchase_order_id, supplier_id, invoice_number, status, received_date, due_date, paid_date, subtotal, tax, total, currency, notes, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [id, companyId, data.purchaseOrderId || null, data.supplierId || null,
     data.invoiceNumber, data.status || 'received',
     data.receivedDate || null, data.dueDate || null, data.paidDate || null,
     data.subtotal, data.tax || 0, data.total,
     data.currency || 'COP', data.notes || null, now, now]
  );
  return result.rows[0];
}

async function updatePurchaseInvoice(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.purchaseOrderId || null, data.supplierId || null,
    data.invoiceNumber, data.status || 'received',
    data.receivedDate || null, data.dueDate || null, data.paidDate || null,
    data.subtotal, data.tax || 0, data.total,
    data.currency || 'COP', data.notes || null, now, id
  ];
  let query = `UPDATE erp_purchase_invoices SET
    purchase_order_id=$1, supplier_id=$2, invoice_number=$3, status=$4,
    received_date=$5, due_date=$6, paid_date=$7, subtotal=$8,
    tax=$9, total=$10, currency=$11, notes=$12, updated_at=$13
    WHERE id=$14`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

module.exports = {
  listSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  listPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrderItems,
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
