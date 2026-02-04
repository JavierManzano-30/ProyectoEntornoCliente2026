const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

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
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    title: 'title',
    status: 'status',
    priority: 'priority',
    dueDate: 'due_date',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listTasks(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.companyId) {
      values.push(req.query.companyId);
      filters.push(`company_id = $${values.length}`);
    }
    if (req.query.status) {
      values.push(req.query.status);
      filters.push(`status = $${values.length}`);
    }
    if (req.query.priority) {
      values.push(req.query.priority);
      filters.push(`priority = $${values.length}`);
    }
    if (req.query.projectId) {
      values.push(req.query.projectId);
      filters.push(`project_id = $${values.length}`);
    }
    if (req.query.assignedTo) {
      values.push(req.query.assignedTo);
      filters.push(`assigned_to = $${values.length}`);
    }
    if (req.query.dueDate) {
      values.push(req.query.dueDate);
      filters.push(`due_date <= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_tasks ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM alm_tasks
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;
    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapTask);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM alm_tasks WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }
    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'projectId',
      'title',
      'status',
      'priority'
    ]);
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    const prioridadError = validateEnum(req.body.priority, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'status', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'priority', message: prioridadError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO alm_tasks
        (id, company_id, project_id, title, description, status, priority, assigned_to, due_date, estimated_time, created_at, updated_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const id = generateId('task');
    const now = new Date().toISOString();
    const result = await pool.query(insertQuery, [
      id,
      req.body.companyId,
      req.body.projectId,
      req.body.title,
      req.body.description || null,
      req.body.status,
      req.body.priority,
      req.body.assignedTo || null,
      req.body.dueDate || null,
      req.body.estimatedTime ?? null,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'projectId',
      'title',
      'status',
      'priority'
    ]);
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    const prioridadError = validateEnum(req.body.priority, TASK_PRIORITIES);
    if (estadoError) requiredErrors.push({ field: 'status', message: estadoError });
    if (prioridadError) requiredErrors.push({ field: 'priority', message: prioridadError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE alm_tasks
      SET company_id = $1,
          project_id = $2,
          title = $3,
          description = $4,
          status = $5,
          priority = $6,
          assigned_to = $7,
          due_date = $8,
          estimated_time = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const now = new Date().toISOString();
    const result = await pool.query(updateQuery, [
      req.body.companyId,
      req.body.projectId,
      req.body.title,
      req.body.description || null,
      req.body.status,
      req.body.priority,
      req.body.assignedTo || null,
      req.body.dueDate || null,
      req.body.estimatedTime ?? null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_tasks WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const estadoError = validateEnum(req.body.status, TASK_STATES);
    if (estadoError) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
          { field: 'status', message: estadoError }
        ]));
    }

    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE alm_tasks SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [req.body.status, now, id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function assignTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!req.body.assignedTo) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', [
          { field: 'assignedTo', message: 'Requerido' }
        ]));
    }

    const now = new Date().toISOString();
    const result = await pool.query(
      'UPDATE alm_tasks SET assigned_to = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [req.body.assignedTo, now, id]
    );

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Tarea no encontrada'));
    }

    return res.json(envelopeSuccess(mapTask(result.rows[0])));
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
