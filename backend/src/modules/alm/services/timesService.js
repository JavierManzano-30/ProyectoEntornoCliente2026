const supabase = require('../../../config/supabase');
const { validateRequiredFields } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');
const { createServiceError } = require('./serviceError');

function mapTime(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    taskId: row.task_id,
    userId: row.user_id,
    entryDate: row.entry_date,
    hours: row.hours,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function ensureCompanyId(companyId) {
  if (!companyId) {
    throw createServiceError(403, 'FORBIDDEN', 'companyId not available in token');
  }
}

async function ensureTaskInCompany(taskId, companyId) {
  const { data, error } = await supabase
    .from('alm_tasks')
    .select('id')
    .eq('id', taskId)
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function listTimes(companyId, query, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;

  let builder = supabase
    .from('alm_time_entries')
    .select('*', { count: 'exact' })
    .eq('company_id', companyId);

  if (query.taskId) builder = builder.eq('task_id', query.taskId);
  if (query.userId) builder = builder.eq('user_id', query.userId);
  if (query.entryDate) builder = builder.eq('entry_date', query.entryDate);

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapTime), totalItems: count || 0 };
}

async function validateTimePayload(body, companyId) {
  const requiredErrors = validateRequiredFields(body, ['taskId', 'userId', 'entryDate', 'hours']);
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }

  const taskExists = await ensureTaskInCompany(body.taskId, companyId);
  if (!taskExists) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', [
      { field: 'taskId', message: 'Task not found for the token company' }
    ]);
  }
}

async function createTime(companyId, body) {
  ensureCompanyId(companyId);
  await validateTimePayload(body, companyId);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('alm_time_entries')
    .insert([{
      id: generateId('time'),
      company_id: companyId,
      task_id: body.taskId,
      user_id: body.userId,
      entry_date: body.entryDate,
      hours: body.hours,
      description: body.description || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return mapTime(data);
}

async function updateTime(companyId, id, body) {
  ensureCompanyId(companyId);
  await validateTimePayload(body, companyId);

  const { data, error } = await supabase
    .from('alm_time_entries')
    .update({
      company_id: companyId,
      task_id: body.taskId,
      user_id: body.userId,
      entry_date: body.entryDate,
      hours: body.hours,
      description: body.description || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Time entry not found');
  }

  return mapTime(data);
}

async function deleteTime(companyId, id) {
  ensureCompanyId(companyId);

  const { data, error } = await supabase
    .from('alm_time_entries')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Time entry not found');
  }
}

async function getProjectTimeSummary(companyId, id) {
  ensureCompanyId(companyId);

  const { data: tasks, error: tasksError } = await supabase
    .from('alm_tasks')
    .select('id')
    .eq('project_id', id)
    .eq('company_id', companyId);
  if (tasksError) throw tasksError;

  const taskIds = (tasks || []).map((task) => task.id);
  if (!taskIds.length) {
    return { projectId: id, entries: 0, totalHours: 0 };
  }

  const { data: entries, error: entriesError } = await supabase
    .from('alm_time_entries')
    .select('hours')
    .in('task_id', taskIds);
  if (entriesError) throw entriesError;

  const list = entries || [];
  const totalHours = list.reduce((sum, row) => sum + Number(row.hours || 0), 0);
  return { projectId: id, entries: list.length, totalHours };
}

async function getUserTimes(companyId, id, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;

  const { data, error, count } = await supabase
    .from('alm_time_entries')
    .select('*', { count: 'exact' })
    .eq('user_id', id)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapTime), totalItems: count || 0 };
}

async function getTaskTimes(companyId, id, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;

  const { data, error, count } = await supabase
    .from('alm_time_entries')
    .select('*', { count: 'exact' })
    .eq('task_id', id)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapTime), totalItems: count || 0 };
}

module.exports = {
  listTimes,
  createTime,
  updateTime,
  deleteTime,
  getProjectTimeSummary,
  getUserTimes,
  getTaskTimes
};
