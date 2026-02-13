const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

function pickDefined(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  );
}

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
  let query = supabase.from('erp_sales_orders').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
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
  const id = data.id || generateId('erp_so');
  const { data: row, error } = await supabase
    .from('erp_sales_orders')
    .insert([{
      id,
      company_id: companyId,
      client_id: data.clientId,
      order_number: data.orderNumber,
      status: data.status || 'quote',
      order_date: data.orderDate,
      expected_delivery_date: data.expectedDeliveryDate || null,
      actual_delivery_date: data.actualDeliveryDate || null,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      currency: data.currency || 'EUR',
      payment_terms: data.paymentTerms || null,
      created_by: data.createdBy || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateSalesOrder(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    client_id: data.clientId,
    order_number: data.orderNumber,
    status: data.status,
    order_date: data.orderDate,
    expected_delivery_date: data.expectedDeliveryDate,
    actual_delivery_date: data.actualDeliveryDate,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    currency: data.currency,
    payment_terms: data.paymentTerms,
    updated_at: now
  });

  let query = supabase.from('erp_sales_orders').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: rows, error } = await query.select('*');
  if (error) {
    if (payload.updated_at && /updated_at/i.test(error.message || '')) {
      const retryPayload = { ...payload };
      delete retryPayload.updated_at;

      let retryQuery = supabase.from('erp_sales_orders').update(retryPayload).eq('id', id);
      if (companyId) retryQuery = retryQuery.eq('company_id', companyId);

      const { data: retryRows, error: retryError } = await retryQuery.select('*');
      if (retryError) throw retryError;
      return retryRows?.[0] || null;
    }
    throw error;
  }
  return rows?.[0] || null;
}

async function deleteSalesOrder(companyId, id) {
  let query = supabase.from('erp_sales_orders').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function addSalesItem(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_si');
  const { data: row, error } = await supabase
    .from('erp_sales_items')
    .insert([{
      id,
      company_id: companyId,
      sales_order_id: data.salesOrderId,
      product_id: data.productId,
      quantity: data.quantity,
      unit_price: data.unitPrice,
      discount_percentage: data.discountPercentage || 0,
      subtotal: data.subtotal,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateSalesItem(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    product_id: data.productId,
    quantity: data.quantity,
    unit_price: data.unitPrice,
    discount_percentage: data.discountPercentage,
    subtotal: data.subtotal,
    updated_at: now
  });

  let query = supabase.from('erp_sales_items').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteSalesItem(companyId, id) {
  let query = supabase.from('erp_sales_items').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
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
  let query = supabase.from('erp_invoices').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createInvoice(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_inv');
  const { data: row, error } = await supabase
    .from('erp_invoices')
    .insert([{
      id,
      company_id: companyId,
      sales_order_id: data.salesOrderId || null,
      client_id: data.clientId,
      invoice_number: data.invoiceNumber,
      status: data.status || 'draft',
      issue_date: data.issueDate,
      due_date: data.dueDate || null,
      paid_date: data.paidDate || null,
      subtotal: data.subtotal,
      tax_percent: data.taxPercent || null,
      tax_amount: data.taxAmount || null,
      total: data.total,
      currency: data.currency || 'EUR',
      notes: data.notes || null,
      created_by: data.createdBy || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateInvoice(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    sales_order_id: data.salesOrderId,
    client_id: data.clientId,
    invoice_number: data.invoiceNumber,
    status: data.status,
    issue_date: data.issueDate,
    due_date: data.dueDate,
    paid_date: data.paidDate,
    subtotal: data.subtotal,
    tax_percent: data.taxPercent,
    tax_amount: data.taxAmount,
    total: data.total,
    currency: data.currency,
    notes: data.notes,
    updated_at: now
  });

  let query = supabase.from('erp_invoices').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: rows, error } = await query.select('*');
  if (error) {
    if (payload.updated_at && /updated_at/i.test(error.message || '')) {
      const retryPayload = { ...payload };
      delete retryPayload.updated_at;

      let retryQuery = supabase.from('erp_invoices').update(retryPayload).eq('id', id);
      if (companyId) retryQuery = retryQuery.eq('company_id', companyId);

      const { data: retryRows, error: retryError } = await retryQuery.select('*');
      if (retryError) throw retryError;
      return retryRows?.[0] || null;
    }
    throw error;
  }
  return rows?.[0] || null;
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
