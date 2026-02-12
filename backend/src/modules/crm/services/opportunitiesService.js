const supabase = require('../../../config/supabase');
const { validateRequiredFields } = require('../../../utils/validation');
const { createServiceError } = require('./serviceError');

function mapOpportunity(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    clientId: row.client_id,
    pipelineId: row.pipeline_id,
    stageId: row.stage_id,
    title: row.title,
    description: row.description,
    estimatedValue: parseFloat(row.estimated_value || 0),
    currency: row.currency,
    probability: row.probability,
    expectedCloseDate: row.expected_close_date,
    responsibleId: row.responsible_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return { field: 'created_at', ascending: false };
  const desc = sort.startsWith('-');
  const field = sort.replace('-', '');
  const map = {
    title: 'title',
    estimatedValue: 'estimated_value',
    probability: 'probability',
    expectedCloseDate: 'expected_close_date',
    createdAt: 'created_at'
  };
  return { field: map[field] || 'created_at', ascending: !desc };
}

async function listOpportunities(query, paging, companyId) {
  const { limit, offset } = paging;
  const { field, ascending } = parseSort(query.sort);

  let builder = supabase.from('crm_opportunities').select('*', { count: 'exact' });
  if (companyId) builder = builder.eq('company_id', companyId);
  if (query.pipelineId) builder = builder.eq('pipeline_id', query.pipelineId);
  if (query.stageId) builder = builder.eq('stage_id', query.stageId);
  if (query.responsibleId) builder = builder.eq('responsible_id', query.responsibleId);
  if (query.clientId) builder = builder.eq('client_id', query.clientId);

  const { data, error, count } = await builder
    .order(field, { ascending })
    .range(offset, offset + limit - 1);

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error fetching opportunities');
  }

  return { rows: (data || []).map(mapOpportunity), totalItems: count || 0 };
}

async function getOpportunity(id, companyId) {
  const { data, error } = await supabase
    .from('crm_opportunities')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Opportunity not found');
  }
  return mapOpportunity(data);
}

function validateOpportunityBody(body) {
  const requiredErrors = validateRequiredFields(body, ['clientId', 'pipelineId', 'stageId', 'title']);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createOpportunity(companyId, body) {
  validateOpportunityBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_opportunities')
    .insert([{
      company_id: companyId,
      client_id: body.clientId,
      pipeline_id: body.pipelineId,
      stage_id: body.stageId,
      title: body.title,
      description: body.description || null,
      estimated_value: body.estimatedValue || 0,
      currency: body.currency || 'EUR',
      probability: body.probability || 0,
      expected_close_date: body.expectedCloseDate || null,
      responsible_id: body.responsibleId || null,
      sort_order: body.sortOrder || 0,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error creating opportunity');
  }
  return mapOpportunity(data);
}

async function updateOpportunity(id, body, companyId) {
  validateOpportunityBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_opportunities')
    .update({
      client_id: body.clientId,
      pipeline_id: body.pipelineId,
      stage_id: body.stageId,
      title: body.title,
      description: body.description || null,
      estimated_value: body.estimatedValue || 0,
      currency: body.currency || 'EUR',
      probability: body.probability || 0,
      expected_close_date: body.expectedCloseDate || null,
      responsible_id: body.responsibleId || null,
      sort_order: body.sortOrder || 0,
      updated_at: now
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Opportunity not found');
  }
  return mapOpportunity(data);
}

async function deleteOpportunity(id, companyId) {
  const { data, error } = await supabase
    .from('crm_opportunities')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Opportunity not found');
  }
}

async function updateStage(id, body, companyId) {
  const requiredErrors = validateRequiredFields(body, ['stageId']);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('crm_opportunities')
    .update({
      stage_id: body.stageId,
      sort_order: body.sortOrder || 0,
      updated_at: now
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Opportunity not found');
  }
  return mapOpportunity(data);
}

module.exports = {
  listOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  updateStage
};
