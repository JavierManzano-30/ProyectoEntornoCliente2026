const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');

const PROJECT_STATES = ['planned', 'in_progress', 'paused', 'completed'];

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

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

async function listProjects(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { page, limit, offset } = getPaginationParams(req.query);
    const { column, ascending } = parseSort(req.query.sort);

    let query = supabase
      .from('alm_projects')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    if (req.query.status) query = query.eq('status', req.query.status);
    if (req.query.clientId) query = query.eq('client_id', req.query.clientId);
    if (req.query.responsibleId) query = query.eq('responsible_id', req.query.responsibleId);
    if (req.query.startDate) query = query.gte('start_date', req.query.startDate);
    if (req.query.endDate) query = query.lte('end_date', req.query.endDate);

    const { data, error, count } = await query
      .order(column, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json(envelopeSuccess((data || []).map(mapProject), buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('alm_projects')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    return res.json(envelopeSuccess(mapProject(data)));
  } catch (err) {
    return next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const requiredErrors = validateRequiredFields(req.body, [
      'name',
      'startDate',
      'responsibleId',
      'status'
    ]);
    const enumError = validateEnum(req.body.status, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'status', message: enumError });

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const now = new Date().toISOString();
    const payload = {
      id: generateId('proj'),
      company_id: companyId,
      name: req.body.name,
      description: req.body.description || null,
      start_date: req.body.startDate,
      end_date: req.body.endDate || null,
      responsible_id: req.body.responsibleId,
      status: req.body.status,
      budget: req.body.budget ?? null,
      client_id: req.body.clientId || null,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase.from('alm_projects').insert([payload]).select('*').single();
    if (error) throw error;

    return res.status(201).json(envelopeSuccess(mapProject(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'name',
      'startDate',
      'responsibleId',
      'status'
    ]);
    const enumError = validateEnum(req.body.status, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'status', message: enumError });

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const { data, error } = await supabase
      .from('alm_projects')
      .update({
        company_id: companyId,
        name: req.body.name,
        description: req.body.description || null,
        start_date: req.body.startDate,
        end_date: req.body.endDate || null,
        responsible_id: req.body.responsibleId,
        status: req.body.status,
        budget: req.body.budget ?? null,
        client_id: req.body.clientId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    return res.json(envelopeSuccess(mapProject(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('alm_projects')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listProjectTasks(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);
    const { data, error, count } = await supabase
      .from('alm_tasks')
      .select('*', { count: 'exact' })
      .eq('project_id', id)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const mapped = (data || []).map((row) => ({
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
    }));

    return res.json(envelopeSuccess(mapped, buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
}

async function getProjectStats(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data: project, error: projectError } = await supabase
      .from('alm_projects')
      .select('id')
      .eq('id', id)
      .eq('company_id', companyId)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
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

    return res.json(envelopeSuccess({
      totalTasks: total,
      pending,
      inProgress,
      completed,
      completionPercent,
      estimatedHours,
      realHours: totalRealHours
    }));
  } catch (err) {
    return next(err);
  }
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
