const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const { generateId } = require('../../../utils/id');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

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

async function listTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { page, limit, offset } = getPaginationParams(req.query);
    let query = supabase
      .from('alm_time_entries')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    if (req.query.taskId) query = query.eq('task_id', req.query.taskId);
    if (req.query.userId) query = query.eq('user_id', req.query.userId);
    if (req.query.entryDate) query = query.eq('entry_date', req.query.entryDate);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json(envelopeSuccess((data || []).map(mapTime), buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
}

async function createTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const requiredErrors = validateRequiredFields(req.body, ['taskId', 'userId', 'entryDate', 'hours']);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const taskExists = await ensureTaskInCompany(req.body.taskId, companyId);
    if (!taskExists) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'taskId', message: 'Tarea no encontrada para la empresa del token' }
      ]));
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('alm_time_entries')
      .insert([{
        id: generateId('time'),
        company_id: companyId,
        task_id: req.body.taskId,
        user_id: req.body.userId,
        entry_date: req.body.entryDate,
        hours: req.body.hours,
        description: req.body.description || null,
        created_at: now,
        updated_at: now
      }])
      .select('*')
      .single();

    if (error) throw error;
    return res.status(201).json(envelopeSuccess(mapTime(data)));
  } catch (err) {
    return next(err);
  }
}

async function updateTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, ['taskId', 'userId', 'entryDate', 'hours']);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const taskExists = await ensureTaskInCompany(req.body.taskId, companyId);
    if (!taskExists) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
        { field: 'taskId', message: 'Tarea no encontrada para la empresa del token' }
      ]));
    }

    const { data, error } = await supabase
      .from('alm_time_entries')
      .update({
        company_id: companyId,
        task_id: req.body.taskId,
        user_id: req.body.userId,
        entry_date: req.body.entryDate,
        hours: req.body.hours,
        description: req.body.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }

    return res.json(envelopeSuccess(mapTime(data)));
  } catch (err) {
    return next(err);
  }
}

async function deleteTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('alm_time_entries')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function getProjectTimeSummary(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { data: tasks, error: tasksError } = await supabase
      .from('alm_tasks')
      .select('id')
      .eq('project_id', id)
      .eq('company_id', companyId);
    if (tasksError) throw tasksError;

    const taskIds = (tasks || []).map((task) => task.id);
    if (!taskIds.length) {
      return res.json(envelopeSuccess({ projectId: id, entries: 0, totalHours: 0 }));
    }

    const { data: entries, error: entriesError } = await supabase
      .from('alm_time_entries')
      .select('hours')
      .in('task_id', taskIds);
    if (entriesError) throw entriesError;

    const list = entries || [];
    const totalHours = list.reduce((sum, row) => sum + Number(row.hours || 0), 0);

    return res.json(envelopeSuccess({ projectId: id, entries: list.length, totalHours }));
  } catch (err) {
    return next(err);
  }
}

async function getUserTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);
    const { data, error, count } = await supabase
      .from('alm_time_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', id)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json(envelopeSuccess((data || []).map(mapTime), buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
}

async function getTaskTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'companyId no disponible en token'));
    }

    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);
    const { data, error, count } = await supabase
      .from('alm_time_entries')
      .select('*', { count: 'exact' })
      .eq('task_id', id)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json(envelopeSuccess((data || []).map(mapTime), buildPaginationMeta(page, limit, count || 0)));
  } catch (err) {
    return next(err);
  }
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
