const supabase = require('../../../config/supabase');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { createServiceError } = require('./serviceError');

const ACTIVITY_TYPES = ['call', 'email', 'meeting', 'note'];

function mapActivity(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    userId: row.user_id,
    clientId: row.client_id,
    opportunityId: row.opportunity_id,
    type: row.type,
    subject: row.subject,
    description: row.description,
    activityAt: row.activity_at,
    dueDate: row.due_date,
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  if (!sort) return { field: 'activity_at', ascending: false };
  const desc = sort.startsWith('-');
  const field = sort.replace('-', '');
  const map = {
    activityAt: 'activity_at',
    dueDate: 'due_date',
    type: 'type',
    completed: 'completed',
    createdAt: 'created_at'
  };
  return { field: map[field] || 'activity_at', ascending: !desc };
}

async function listActivities(query, paging, companyId) {
  const { limit, offset } = paging;
  const { field, ascending } = parseSort(query.sort);

  let builder = supabase.from('crm_activities').select('*', { count: 'exact' });
  if (companyId) builder = builder.eq('company_id', companyId);
  if (query.userId) builder = builder.eq('user_id', query.userId);
  if (query.clientId) builder = builder.eq('client_id', query.clientId);
  if (query.opportunityId) builder = builder.eq('opportunity_id', query.opportunityId);
  if (query.type) builder = builder.eq('type', query.type);

  if (query.status === 'pending') {
    builder = builder.eq('completed', false);
  } else if (query.status === 'completed') {
    builder = builder.eq('completed', true);
  }

  if (query.entityType && query.entityId) {
    if (query.entityType === 'customer') {
      builder = builder.eq('client_id', query.entityId);
    } else if (query.entityType === 'opportunity') {
      builder = builder.eq('opportunity_id', query.entityId);
    }
  }

  const { data, error, count } = await builder
    .order(field, { ascending })
    .range(offset, offset + limit - 1);

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error fetching activities');
  }

  return { rows: (data || []).map(mapActivity), totalItems: count || 0 };
}

async function getActivity(id, companyId) {
  const { data, error } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Activity not found');
  }
  return mapActivity(data);
}

function validateActivityBody(body) {
  const requiredErrors = validateRequiredFields(body, ['userId', 'type', 'subject', 'activityAt']);
  const typeError = validateEnum(body.type, ACTIVITY_TYPES);
  if (typeError) requiredErrors.push({ field: 'type', message: typeError });

  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createActivity(companyId, body) {
  validateActivityBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_activities')
    .insert([{
      company_id: companyId,
      user_id: body.userId,
      client_id: body.clientId || null,
      opportunity_id: body.opportunityId || null,
      type: body.type,
      subject: body.subject,
      description: body.description || null,
      activity_at: body.activityAt,
      due_date: body.dueDate || null,
      completed: body.completed || false,
      created_at: now,
      updated_at: now
    }])
    .select()
    .single();

  if (error) {
    throw createServiceError(500, 'INTERNAL_ERROR', 'Error creating activity');
  }
  return mapActivity(data);
}

async function updateActivity(id, body, companyId) {
  validateActivityBody(body);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('crm_activities')
    .update({
      user_id: body.userId,
      client_id: body.clientId || null,
      opportunity_id: body.opportunityId || null,
      type: body.type,
      subject: body.subject,
      description: body.description || null,
      activity_at: body.activityAt,
      due_date: body.dueDate || null,
      completed: body.completed || false,
      updated_at: now
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Activity not found');
  }
  return mapActivity(data);
}

async function deleteActivity(id, companyId) {
  const { data, error } = await supabase
    .from('crm_activities')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Activity not found');
  }
}

async function markCompleted(id, companyId) {
  const { data, error } = await supabase
    .from('crm_activities')
    .update({
      completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error || !data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Activity not found');
  }
  return mapActivity(data);
}

module.exports = {
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  markCompleted
};
