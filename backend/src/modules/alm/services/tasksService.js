const supabase = require('../../../config/supabase');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');
const { createServiceError } = require('./serviceError');

const TASK_STATES = ['pending', 'in_progress', 'completed'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

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
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    createdAt: 'created_at'
  };
  return { column: map[field] || 'created_at', ascending };
}

function ensureCompanyId(companyId) {
  if (!companyId) {
    throw createServiceError(403, 'FORBIDDEN', 'companyId no disponible en token');
  }
}

async function ensureProjectInCompany(projectId, companyId) {
  const { data, error } = await supabase
    .from('alm_projects')
    .select('id')
    .eq('id', projectId)
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function listTasks(companyId, query, paging) {
  ensureCompanyId(companyId);
  const { limit, offset } = paging;
  const { column, ascending } = parseSort(query.sort);

  let builder = supabase
    .from('alm_tasks')
    .select('*', { count: 'exact' })
    .eq('company_id', companyId);

  if (query.status) builder = builder.eq('status', query.status);
  if (query.priority) builder = builder.eq('priority', query.priority);
  if (query.projectId) builder = builder.eq('project_id', query.projectId);
  if (query.assignedTo) builder = builder.eq('assigned_to', query.assignedTo);
  if (query.dueDate) builder = builder.lte('due_date', query.dueDate);

  const { data, error, count } = await builder
    .order(column, { ascending })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data || []).map(mapTask), totalItems: count || 0 };
}

async function getTask(companyId, id) {
  ensureCompanyId(companyId);

  const { data, error } = await supabase
    .from('alm_tasks')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Tarea no encontrada');
  }

  return mapTask(data);
}

async function ensureValidTaskBody(body, companyId) {
  const requiredErrors = validateRequiredFields(body, ['projectId', 'title', 'status', 'priority']);
  const statusError = validateEnum(body.status, TASK_STATES);
  const priorityError = validateEnum(body.priority, TASK_PRIORITIES);
  if (statusError) requiredErrors.push({ field: 'status', message: statusError });
  if (priorityError) requiredErrors.push({ field: 'priority', message: priorityError });

  if (requiredErrors.length) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Datos invalidos', requiredErrors);
  }

  const projectExists = await ensureProjectInCompany(body.projectId, companyId);
  if (!projectExists) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Datos invalidos', [
      { field: 'projectId', message: 'Proyecto no encontrado para la empresa del token' }
    ]);
  }
}

async function createTask(companyId, body) {
  ensureCompanyId(companyId);
  await ensureValidTaskBody(body, companyId);

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('alm_tasks')
    .insert([{
      id: generateId('task'),
      company_id: companyId,
      project_id: body.projectId,
      title: body.title,
      description: body.description || null,
      status: body.status,
      priority: body.priority,
      assigned_to: body.assignedTo || null,
      due_date: body.dueDate || null,
      estimated_time: body.estimatedTime ?? null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return mapTask(data);
}

async function updateTask(companyId, id, body) {
  ensureCompanyId(companyId);
  await ensureValidTaskBody(body, companyId);

  const { data, error } = await supabase
    .from('alm_tasks')
    .update({
      company_id: companyId,
      project_id: body.projectId,
      title: body.title,
      description: body.description || null,
      status: body.status,
      priority: body.priority,
      assigned_to: body.assignedTo || null,
      due_date: body.dueDate || null,
      estimated_time: body.estimatedTime ?? null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Tarea no encontrada');
  }

  return mapTask(data);
}

async function deleteTask(companyId, id) {
  ensureCompanyId(companyId);

  const { data, error } = await supabase
    .from('alm_tasks')
    .delete()
    .eq('id', id)
    .eq('company_id', companyId)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Tarea no encontrada');
  }
}

async function updateTaskStatus(companyId, id, body) {
  ensureCompanyId(companyId);
  const statusError = validateEnum(body.status, TASK_STATES);
  if (statusError) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Datos invalidos', [
      { field: 'status', message: statusError }
    ]);
  }

  const { data, error } = await supabase
    .from('alm_tasks')
    .update({
      status: body.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Tarea no encontrada');
  }

  return mapTask(data);
}

async function assignTask(companyId, id, body) {
  ensureCompanyId(companyId);
  if (!body.assignedTo) {
    throw createServiceError(400, 'VALIDATION_ERROR', 'Datos invalidos', [
      { field: 'assignedTo', message: 'Requerido' }
    ]);
  }

  const { data, error } = await supabase
    .from('alm_tasks')
    .update({
      assigned_to: body.assignedTo,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('company_id', companyId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw createServiceError(404, 'RESOURCE_NOT_FOUND', 'Tarea no encontrada');
  }

  return mapTask(data);
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask
};
