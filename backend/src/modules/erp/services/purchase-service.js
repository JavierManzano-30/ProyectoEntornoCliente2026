const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

function pickDefined(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  );
}

async function listSuppliers(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_suppliers').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.search) query = query.or(`legal_name.ilike.%${filters.search}%,tax_id.ilike.%${filters.search}%`);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getSupplierById(companyId, id) {
  let query = supabase.from('erp_suppliers').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createSupplier(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_sup');
  const { data: row, error } = await supabase
    .from('erp_suppliers')
    .insert([{
      id,
      company_id: companyId,
      legal_name: data.legalName,
      tax_id: data.taxId || null,
      contact_email: data.contactEmail || null,
      phone: data.phone || null,
      address: data.address || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateSupplier(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    legal_name: data.legalName,
    tax_id: data.taxId,
    contact_email: data.contactEmail,
    phone: data.phone,
    address: data.address,
    updated_at: now
  });

  let query = supabase.from('erp_suppliers').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteSupplier(companyId, id) {
  let query = supabase.from('erp_suppliers').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function listPurchaseOrders(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_purchase_orders').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.supplierId) query = query.eq('supplier_id', filters.supplierId);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getPurchaseOrderById(companyId, id) {
  let query = supabase.from('erp_purchase_orders').select('*').eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function getPurchaseOrderItems(companyId, orderId) {
  let query = supabase
    .from('erp_purchase_items')
    .select('*')
    .eq('purchase_order_id', orderId)
    .order('id', { ascending: true });

  if (companyId) query = query.eq('company_id', companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function createPurchaseOrder(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_po');
  const { data: row, error } = await supabase
    .from('erp_purchase_orders')
    .insert([{
      id,
      company_id: companyId,
      supplier_id: data.supplierId,
      order_number: data.orderNumber,
      status: data.status || 'draft',
      order_date: data.orderDate,
      expected_delivery_date: data.expectedDeliveryDate || null,
      actual_delivery_date: data.actualDeliveryDate || null,
      total: data.total,
      currency: data.currency || 'EUR',
      comments: data.comments || null,
      created_by: data.createdBy || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updatePurchaseOrder(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    supplier_id: data.supplierId,
    order_number: data.orderNumber,
    status: data.status,
    order_date: data.orderDate,
    expected_delivery_date: data.expectedDeliveryDate,
    actual_delivery_date: data.actualDeliveryDate,
    total: data.total,
    currency: data.currency,
    comments: data.comments,
    updated_at: now
  });

  let query = supabase.from('erp_purchase_orders').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: rows, error } = await query.select('*');
  if (error) {
    // Algunas tablas ERP no tienen updated_at en entornos antiguos.
    if (payload.updated_at && /updated_at/i.test(error.message || '')) {
      const retryPayload = { ...payload };
      delete retryPayload.updated_at;

      let retryQuery = supabase.from('erp_purchase_orders').update(retryPayload).eq('id', id);
      if (companyId) retryQuery = retryQuery.eq('company_id', companyId);

      const { data: retryRows, error: retryError } = await retryQuery.select('*');
      if (retryError) throw retryError;
      return retryRows?.[0] || null;
    }
    throw error;
  }
  return rows?.[0] || null;
}

async function deletePurchaseOrder(companyId, id) {
  let query = supabase.from('erp_purchase_orders').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function addPurchaseItem(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_pi');
  const { data: row, error } = await supabase
    .from('erp_purchase_items')
    .insert([{
      id,
      company_id: companyId,
      purchase_order_id: data.purchaseOrderId,
      product_id: data.productId,
      quantity_ordered: data.quantityOrdered,
      quantity_received: data.quantityReceived || 0,
      unit_price: data.unitPrice,
      subtotal: data.subtotal,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updatePurchaseItem(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    product_id: data.productId,
    quantity_ordered: data.quantityOrdered,
    quantity_received: data.quantityReceived,
    unit_price: data.unitPrice,
    subtotal: data.subtotal,
    updated_at: now
  });

  let query = supabase.from('erp_purchase_items').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: row, error } = await query.select('*').maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deletePurchaseItem(companyId, id) {
  let query = supabase.from('erp_purchase_items').delete().eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data, error } = await query.select('id').maybeSingle();
  if (error) throw error;
  return data || null;
}

async function listPurchaseInvoices(companyId, { filters, limit, offset }) {
  let query = supabase.from('erp_purchase_invoices').select('*', { count: 'exact' });
  if (companyId) query = query.eq('company_id', companyId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function createPurchaseInvoice(companyId, data) {
  const now = new Date().toISOString();
  const id = data.id || generateId('erp_pinv');
  const { data: row, error } = await supabase
    .from('erp_purchase_invoices')
    .insert([{
      id,
      company_id: companyId,
      purchase_order_id: data.purchaseOrderId || null,
      supplier_id: data.supplierId || null,
      invoice_number: data.invoiceNumber,
      status: data.status || 'received',
      received_date: data.receivedDate || null,
      due_date: data.dueDate || null,
      paid_date: data.paidDate || null,
      subtotal: data.subtotal,
      tax: data.tax || 0,
      total: data.total,
      currency: data.currency || 'EUR',
      notes: data.notes || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updatePurchaseInvoice(companyId, id, data) {
  const now = new Date().toISOString();
  const payload = pickDefined({
    purchase_order_id: data.purchaseOrderId,
    supplier_id: data.supplierId,
    invoice_number: data.invoiceNumber,
    status: data.status,
    received_date: data.receivedDate,
    due_date: data.dueDate,
    paid_date: data.paidDate,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    currency: data.currency,
    notes: data.notes,
    updated_at: now
  });

  let query = supabase.from('erp_purchase_invoices').update(payload).eq('id', id);
  if (companyId) query = query.eq('company_id', companyId);

  const { data: rows, error } = await query.select('*');
  if (error) {
    if (payload.updated_at && /updated_at/i.test(error.message || '')) {
      const retryPayload = { ...payload };
      delete retryPayload.updated_at;

      let retryQuery = supabase.from('erp_purchase_invoices').update(retryPayload).eq('id', id);
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
