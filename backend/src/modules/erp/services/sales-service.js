const supabase = require('../../../config/supabase');
const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listSalesOrders(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_sales_orders').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.clientId) query = query.eq('client_id', filters.clientId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getSalesOrderById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_sales_orders WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function getSalesOrderItems(companyId, orderId) {
  let query = supabase
    .from('erp_sales_items')
    .select('*')
    .eq('sales_order_id', orderId)
    .order('id', { ascending: true });

  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function createSalesOrder(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_so');
  const result = await pool.query(
    `INSERT INTO erp_sales_orders
      (id, company_id, client_id, order_number, status, order_date, expected_delivery_date, actual_delivery_date, subtotal, tax, total, currency, payment_terms, created_by, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [id, companyId, data.clientId, data.orderNumber,
     data.status || 'quote', data.orderDate,
     data.expectedDeliveryDate || null, data.actualDeliveryDate || null,
     data.subtotal, data.tax, data.total,
     data.currency || 'COP', data.paymentTerms || null,
     data.createdBy || null, now, now]
  );
  return result.rows[0];
}

async function updateSalesOrder(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.clientId, data.orderNumber, data.status || 'quote',
    data.orderDate, data.expectedDeliveryDate || null,
    data.actualDeliveryDate || null, data.subtotal, data.tax, data.total,
    data.currency || 'COP', data.paymentTerms || null, now, id
  ];
  let query = `UPDATE erp_sales_orders SET
    client_id=$1, order_number=$2, status=$3, order_date=$4,
    expected_delivery_date=$5, actual_delivery_date=$6, subtotal=$7,
    tax=$8, total=$9, currency=$10, payment_terms=$11, updated_at=$12
    WHERE id=$13`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteSalesOrder(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_sales_orders WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function addSalesItem(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_si');
  const result = await pool.query(
    `INSERT INTO erp_sales_items
      (id, company_id, sales_order_id, product_id, quantity, unit_price, discount_percentage, subtotal, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [id, companyId, data.salesOrderId, data.productId,
     data.quantity, data.unitPrice, data.discountPercentage || 0,
     data.subtotal, now, now]
  );
  return result.rows[0];
}

async function updateSalesItem(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.productId, data.quantity, data.unitPrice,
    data.discountPercentage || 0, data.subtotal, now, id
  ];
  let query = `UPDATE erp_sales_items SET
    product_id=$1, quantity=$2, unit_price=$3,
    discount_percentage=$4, subtotal=$5, updated_at=$6
    WHERE id=$7`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteSalesItem(companyId, id) {
  const values = [id];
  let query = 'DELETE FROM erp_sales_items WHERE id=$1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$2`;
  }
  query += ' RETURNING id';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function listInvoices(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_invoices').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.clientId) query = query.eq('client_id', filters.clientId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getInvoiceById(companyId, id) {
  const values = [id];
  let query = 'SELECT * FROM erp_invoices WHERE id = $1';
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id = $2`;
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function createInvoice(companyId, data) {
  const now = new Date().toISOString();
  const id = generateId('erp_inv');
  const result = await pool.query(
    `INSERT INTO erp_invoices
      (id, company_id, sales_order_id, client_id, invoice_number, status, issue_date, due_date, paid_date, subtotal, tax_percent, tax_amount, total, currency, notes, created_by, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
    [id, companyId, data.salesOrderId || null, data.clientId,
     data.invoiceNumber, data.status || 'draft',
     data.issueDate, data.dueDate || null, data.paidDate || null,
     data.subtotal, data.taxPercent || null, data.taxAmount || null,
     data.total, data.currency || 'COP', data.notes || null,
     data.createdBy || null, now, now]
  );
  return result.rows[0];
}

async function updateInvoice(companyId, id, data) {
  const now = new Date().toISOString();
  const values = [
    data.salesOrderId || null, data.clientId,
    data.invoiceNumber, data.status || 'draft',
    data.issueDate, data.dueDate || null, data.paidDate || null,
    data.subtotal, data.taxPercent || null, data.taxAmount || null,
    data.total, data.currency || 'COP', data.notes || null, now, id
  ];
  let query = `UPDATE erp_invoices SET
    sales_order_id=$1, client_id=$2, invoice_number=$3, status=$4,
    issue_date=$5, due_date=$6, paid_date=$7, subtotal=$8,
    tax_percent=$9, tax_amount=$10, total=$11, currency=$12,
    notes=$13, updated_at=$14
    WHERE id=$15`;
  if (companyId) {
    values.push(companyId);
    query += ` AND company_id=$${values.length}`;
  }
  query += ' RETURNING *';
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

module.exports = {
  listSalesOrders,
  getSalesOrderById,
  getSalesOrderItems,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  addSalesItem,
  updateSalesItem,
  deleteSalesItem,
  listInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice
};
