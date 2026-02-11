const supabase = require('../../../config/supabase');
const { validateRequiredFields } = require('../../../utils/validation');
const { createServiceError } = require('./serviceError');

function mapContact(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    name: row.name,
    lastName: row.last_name,
    jobTitle: row.job_title,
    email: row.email,
    phone: row.phone,
    isDecisionMaker: row.is_decision_maker,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listContacts(query, paging) {
  const { limit, offset } = paging;
  let builder = supabase.from('crm_contacts').select('*', { count: 'exact' });

  if (query.clientId) builder = builder.eq('client_id', query.clientId);
  if (query.companyId) builder = builder.eq('company_id', query.companyId);

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapContact), totalItems: count || 0 };
}

async function getContact(id) {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Contact not found');
  }
  return mapContact(data);
}

function validateContactBody(body) {
  const requiredErrors = validateRequiredFields(body, ['clientId', 'name']);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createContact(companyId, body) {
  validateContactBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_contacts')
    .insert([{
      company_id: companyId,
      client_id: body.clientId,
      name: body.name,
      last_name: body.lastName || null,
      job_title: body.jobTitle || null,
      email: body.email || null,
      phone: body.phone || null,
      is_decision_maker: body.isDecisionMaker || false,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) throw error;
  return mapContact(data);
}

async function updateContact(id, body) {
  validateContactBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_contacts')
    .update({
      client_id: body.clientId,
      name: body.name,
      last_name: body.lastName || null,
      job_title: body.jobTitle || null,
      email: body.email || null,
      phone: body.phone || null,
      is_decision_maker: body.isDecisionMaker || false,
      updated_at: now
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Contact not found');
  }
  return mapContact(data);
}

async function deleteContact(id) {
  const { data, error } = await supabase
    .from('crm_contacts')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Contact not found');
  }
}

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
