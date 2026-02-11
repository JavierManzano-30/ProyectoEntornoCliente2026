const supabase = require('../../../config/supabase');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');
const { createServiceError } = require('./serviceError');

const PROJECT_STATES = ['planned', 'in_progress', 'paused', 'completed'];

function mapProject(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    responsibleId: row.responsible_id,
    status: row.status,
    budget: row.budget,
    clientId: row.client_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTask(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    assignedTo: row.assigned_to,
    dueDate: row.due_date,
    estimatedTime: row.estimated_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseSort(sort) {
  const raw = sort || '-createdAt';
  const ascending = !raw.startsWith('-');
  const field = raw.replace('-', '');
  const map = {
    name: 'name',
    startDate: 'start_date',
    endDate: 'end_date',
    status: 'status',
    createdAt: 'created_at'
  };
  return { column: map[field] || 'created_at', ascending };
}

function ensureCompanyId(companyId) {
  if (!companyId) {
    throw createServiceError(403, 'FORBIDDEN', 'companyId not available in token');
  }
}

async function listProjects(companyId, query, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;
  const { column, ascending } = parseSort(query.sort);

  let builder = supabase
    .from('alm_projects')
    .select('*', { count: 'exact' })
    .eq('company_id', companyId);

  if (query.status) builder = builder.eq('status', query.status);
  if (query.clientId) builder = builder.eq('client_id', query.clientId);
  if (query.responsibleId) builder = builder.eq('responsible_id', query.responsibleId);
  if (query.startDate) builder = builder.gte('start_date', query.startDate);
  if (query.endDate) builder = builder.lte('end_date', query.endDate);

  const { data, error, count } = await builder
    .order(column, { ascending })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapProject), totalItems: count || 0 };
}

async function getProject(companyId, id) {
  ensureCompanyId(companyId);

  const { data, error } = await supabase
    .from('alm_projects')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Project not found');
  }

  return mapProject(data);
}

function validateProjectPayload(body) {
  const requiredErrors = validateRequiredFields(body, [
    'name',
    'startDate',
    'responsibleId',
    'status'
  ]);
  const enumError = validateEnum(body.status, PROJECT_STATES);
  if (enumError) requiredErrors.push({ field: 'status', message: enumError });
  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Invalid data', requiredErrors);
  }
}

async function createProject(companyId, body) {
  ensureCompanyId(companyId);
  validateProjectPayload(body);

  const now = new Date().toISOString();
  const payload = {
    id: generateId('proj'),
    company_id: companyId,
    name: body.name,
    description: body.description || null,
    start_date: body.startDate,
    end_date: body.endDate || null,
    responsible_id: body.responsibleId,
    status: body.status,
    budget: body.budget ?? null,
    client_id: body.clientId || null,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from('alm_projects')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return mapProject(data);
}

async function updateProject(companyId, id, body) {
  ensureCompanyId(companyId);
  validateProjectPayload(body);

  const { data, error } = await supabase
    .from('alm_projects')
    .update({
      company_id: companyId,
      name: body.name,
      description: body.description || null,
      start_date: body.startDate,
      end_date: body.endDate || null,
      responsible_id: body.responsibleId,
      status: body.status,
      budget: body.budget ?? null,
      client_id: body.clientId || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Project not found');
  }

  return mapProject(data);
}

async function deleteProject(companyId, id) {
  ensureCompanyId(companyId);

  const { data, error } = await supabase
    .from('alm_projects')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Project not found');
  }
}

async function listProjectTasks(companyId, projectId, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;

  const { data, error, count } = await supabase
    .from('alm_tasks')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapTask), totalItems: count || 0 };
}

async function getProjectStats(companyId, id) {
  ensureCompanyId(companyId);

  const { data: project, error: projectError } = await supabase
    .from('alm_projects')
    .select('id')
    .eq('id', id)
    .eq('company_id', companyId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Project not found');
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('alm_tasks')
    .select('id, status, estimated_time')
    .eq('project_id', id)
    .eq('company_id', companyId);
  if (tasksError) throw tasksError;

  const taskRows = tasks || [];
  const taskIds = taskRows.map((task) => task.id);

  let totalRealHours = 0;
  if (taskIds.length) {
    const { data: timeRows, error: timeError } = await supabase
      .from('alm_time_entries')
      .select('hours')
      .in('task_id', taskIds);
    if (timeError) throw timeError;
    totalRealHours = (timeRows || []).reduce((sum, row) => sum + Number(row.hours || 0), 0);
  }

  const total = taskRows.length;
  const pending = taskRows.filter((row) => row.status === 'pending').length;
  const inProgress = taskRows.filter((row) => row.status === 'in_progress').length;
  const completed = taskRows.filter((row) => row.status === 'completed').length;
  const estimatedHours = taskRows.reduce((sum, row) => sum + Number(row.estimated_time || 0), 0);
  const completionPercent = total ? Math.round((completed / total) * 100) : 0;

  return {
    totalTasks: total,
    pending,
    inProgress,
    completed,
    completionPercent,
    estimatedHours,
    realHours: totalRealHours
  };
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjectTasks,
  getProjectStats
};
