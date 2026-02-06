const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');

const TASK_STATES = ['pending', 'in_progress', 'completed'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
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
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    createdAt: 'created_at'
  };
  return { column: map[field] || 'created_at', ascending };
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

async function listTasks(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { page, limit, offset } = getPaginationParams(req.query);
    const { column, ascending } = parseSort(req.query.sort);

    let query = supabase
      .from('alm_tasks')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    if (req.query.status) query = query.eq('status', req.query.status);
    if (req.query.priority) query = query.eq('priority', req.query.priority);
    if (req.query.projectId) query = query.eq('project_id', req.query.projectId);
    if (req.query.assignedTo) query = query.eq('assigned_to', req.query.assignedTo);
    if (req.query.dueDate) query = query.lte('due_date', req.query.dueDate);

    const { data, error, count } = await query
      .order(column, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json(envelopeSuccess((data || []).map(mapTask), buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('alm_tasks')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(data)));
  } catch (err) {
    return next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const requiredErrors = validateRequiredFields(req.body, ['projectId', 'title', 'status', 'priority']);
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    const prioridadError = validateEnum(req.body.priority, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'status', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'priority', message: prioridadError });

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const projectExists = await ensureProjectInCompany(req.body.projectId, companyId);
    if (!projectExists) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'projectId', message: 'Proyecto no encontrado para la empresa del token' }
      ]));
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('alm_tasks')
      .insert([{
        id: generateId('task'),
        company_id: companyId,
        project_id: req.body.projectId,
        title: req.body.title,
        description: req.body.description || null,
        status: req.body.status,
        priority: req.body.priority,
        assigned_to: req.body.assignedTo || null,
        due_date: req.body.dueDate || null,
        estimated_time: req.body.estimatedTime ?? null,
        created_at: now,
        updated_at: now
      }])
      .select('*')
      .single();

    if (error) throw error;
    return res.status(201).json(envelopeSuccess(mapTask(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['projectId', 'title', 'status', 'priority']);
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    const prioridadError = validateEnum(req.body.priority, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'status', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'priority', message: prioridadError });

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const projectExists = await ensureProjectInCompany(req.body.projectId, companyId);
    if (!projectExists) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'projectId', message: 'Proyecto no encontrado para la empresa del token' }
      ]));
    }

    const { data, error } = await supabase
      .from('alm_tasks')
      .update({
        company_id: companyId,
        project_id: req.body.projectId,
        title: req.body.title,
        description: req.body.description || null,
        status: req.body.status,
        priority: req.body.priority,
        assigned_to: req.body.assignedTo || null,
        due_date: req.body.dueDate || null,
        estimated_time: req.body.estimatedTime ?? null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('alm_tasks')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    if (estadoError) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'status', message: estadoError }
      ]));
    }

    const { data, error } = await supabase
      .from('alm_tasks')
      .update({
        status: req.body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(data)));
  } catch (err) {
    return next(err);
  }
}

async function assignTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    if (!req.body.assignedTo) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'assignedTo', message: 'Requerido' }
      ]));
    }

    const { data, error } = await supabase
      .from('alm_tasks')
      .update({
        assigned_to: req.body.assignedTo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(data)));
  } catch (err) {
    return next(err);
  }
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
