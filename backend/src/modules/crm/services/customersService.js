const supabase = require('../../../config/supabase');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { createServiceError } = require('./serviceError');

const CUSTOMER_TYPES = ['lead', 'customer'];

function mapCustomer(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    taxId: row.tax_id,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    responsibleId: row.responsible_id,
    type: row.type,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  const raw = sort || '-createdAt';
  const desc = raw.startsWith('-');
  const field = raw.replace('-', '');
  const fieldMap = {
    name: 'name',
    type: 'type',
    city: 'city',
    createdAt: 'created_at'
  };
  return { field: fieldMap[field] || 'created_at', ascending: !desc };
}

async function listCustomers(query, paging, companyId) {
  const { limit, offset } = paging;
  const { field, ascending } = parseSort(query.sort);

  let builder = supabase.from('crm_clients').select('*', { count: 'exact' });
  if (companyId) builder = builder.eq('company_id', companyId);
  if (query.type) builder = builder.eq('type', query.type);
  if (query.responsibleId) builder = builder.eq('responsible_id', query.responsibleId);
  if (query.search) {
    builder = builder.or(`name.ilike.%${query.search}%,tax_id.ilike.%${query.search}%`);
  }

  const { data, error, count } = await builder
    .order(field, { ascending })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapCustomer), totalItems: count || 0 };
}

async function getCustomer(id, companyId) {
  const { data: customer, error: customerError } = await supabase
    .from('crm_clients')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (customerError || !customer) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Customer not found');
  }

  const mappedCustomer = mapCustomer(customer);

  const { data: contacts } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('company_id', companyId)
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  mappedCustomer.contacts = (contacts || []).map((row) => ({
    id: row.id,
    name: row.name,
    lastName: row.last_name,
    jobTitle: row.job_title,
    email: row.email,
    phone: row.phone,
    isDecisionMaker: row.is_decision_maker
  }));

  const { data: closedStages } = await supabase
    .from('crm_stages')
    .select('id')
    .eq('company_id', companyId)
    .in('name', ['Won', 'Lost']);
  const closedStageIds = (closedStages || []).map((stage) => stage.id);

  let opportunities = [];
  if (closedStageIds.length) {
    const { data } = await supabase
      .from('crm_opportunities')
      .select('id, estimated_value')
      .eq('company_id', companyId)
      .eq('client_id', id)
      .not('stage_id', 'in', `(${closedStageIds.join(',')})`);
    opportunities = data || [];
  } else {
    const { data } = await supabase
      .from('crm_opportunities')
      .select('id, estimated_value')
      .eq('company_id', companyId)
      .eq('client_id', id);
    opportunities = data || [];
  }

  mappedCustomer.openOpportunities = opportunities.length;
  mappedCustomer.totalPipelineValue = opportunities.reduce(
    (sum, opp) => sum + (parseFloat(opp.estimated_value) || 0),
    0
  );

  return mappedCustomer;
}

function validateCustomerBody(body) {
  const requiredErrors = validateRequiredFields(body, ['name', 'type']);
  const typeError = validateEnum(body.type, CUSTOMER_TYPES);
  if (typeError) requiredErrors.push({ field: 'type', message: typeError });

  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createCustomer(companyId, body) {
  validateCustomerBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_clients')
    .insert([{
      company_id: companyId,
      name: body.name,
      tax_id: body.taxId || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      responsible_id: body.responsibleId || null,
      type: body.type,
      notes: body.notes || null,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) throw error;
  return mapCustomer(data);
}

async function updateCustomer(id, body, companyId) {
  validateCustomerBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_clients')
    .update({
      name: body.name,
      tax_id: body.taxId || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      city: body.city || null,
      responsible_id: body.responsibleId || null,
      type: body.type,
      notes: body.notes || null,
      updated_at: now
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Customer not found');
  }
  return mapCustomer(data);
}

async function deleteCustomer(id, companyId) {
  const { data, error } = await supabase
    .from('crm_clients')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select('id')
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Customer not found');
  }
}

async function convertCustomer(id, companyId) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('crm_clients')
    .update({
      type: 'customer',
      updated_at: now
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .eq('type', 'lead')
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Lead not found or already a customer');
  }

  const customer = mapCustomer(data);
  customer.syncedWithErp = true;
  return customer;
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  convertCustomer
};
