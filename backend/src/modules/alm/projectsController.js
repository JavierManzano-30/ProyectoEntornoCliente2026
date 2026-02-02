const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

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

function parseSort(sort) {
  if (!sort) return 'created_at DESC';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');
  const map = {
    name: 'name',
    startDate: 'start_date',
    endDate: 'end_date',
    status: 'status',
    createdAt: 'created_at'
  };
  if (!map[field]) return 'created_at DESC';
  return `${map[field]} ${direction}`;
}

async function listProjects(req, res, next) {
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
    if (req.query.clientId) {
      values.push(req.query.clientId);
      filters.push(`client_id = $${values.length}`);
    }
    if (req.query.responsibleId) {
      values.push(req.query.responsibleId);
      filters.push(`responsible_id = $${values.length}`);
    }
    if (req.query.startDate) {
      values.push(req.query.startDate);
      filters.push(`start_date >= $${values.length}`);
    }
    if (req.query.endDate) {
      values.push(req.query.endDate);
      filters.push(`end_date <= $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const orderBy = parseSort(req.query.sort);

    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_projects ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit);
    values.push(offset);
    const listQuery = `
      SELECT *
      FROM alm_projects
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapProject);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM alm_projects WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }
    return res.json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'name',
      'startDate',
      'responsibleId',
      'status'
    ]);
    const enumError = validateEnum(req.body.status, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'status', message: enumError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const payload = {
      companyId: req.body.companyId,
      name: req.body.name,
      description: req.body.description || null,
      startDate: req.body.startDate,
      endDate: req.body.endDate || null,
      responsibleId: req.body.responsibleId,
      status: req.body.status,
      budget: req.body.budget ?? null,
      clientId: req.body.clientId || null
    };

    const insertQuery = `
      INSERT INTO alm_projects
        (id, company_id, name, description, start_date, end_date, responsible_id, status, budget, client_id, created_at, updated_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const id = generateId('proj');
    const now = new Date().toISOString();
    const result = await pool.query(insertQuery, [
      id,
      payload.companyId,
      payload.name,
      payload.description,
      payload.startDate,
      payload.endDate,
      payload.responsibleId,
      payload.status,
      payload.budget,
      payload.clientId,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'name',
      'startDate',
      'responsibleId',
      'status'
    ]);
    const enumError = validateEnum(req.body.status, PROJECT_STATES);
    if (enumError) requiredErrors.push({ field: 'status', message: enumError });

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE alm_projects
      SET company_id = $1,
          name = $2,
          description = $3,
          start_date = $4,
          end_date = $5,
          responsible_id = $6,
          status = $7,
          budget = $8,
          client_id = $9,
          updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const now = new Date().toISOString();
    const result = await pool.query(updateQuery, [
      req.body.companyId,
      req.body.name,
      req.body.description || null,
      req.body.startDate,
      req.body.endDate || null,
      req.body.responsibleId,
      req.body.status,
      req.body.budget ?? null,
      req.body.clientId || null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    return res.json(envelopeSuccess(mapProject(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_projects WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listProjectTasks(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);
    const values = [id];

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_tasks WHERE project_id = $1';
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM alm_tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, values);

    const data = result.rows.map((row) => ({
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

    const meta = buildPaginationMeta(page, limit, totalItems);
    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getProjectStats(req, res, next) {
  try {
    const { id } = req.params;

    const projectResult = await pool.query('SELECT id FROM alm_projects WHERE id = $1', [id]);
    if (!projectResult.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Proyecto no encontrado'));
    }

    const countsQuery = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
        COALESCE(SUM(estimated_time), 0)::int AS estimated_hours
      FROM alm_tasks
      WHERE project_id = $1
    `;

    const timesQuery = `
      SELECT COALESCE(SUM(r.hours), 0)::numeric AS real_hours
      FROM alm_time_entries r
      JOIN alm_tasks t ON t.id = r.task_id
      WHERE t.project_id = $1
    `;

    const counts = await pool.query(countsQuery, [id]);
    const times = await pool.query(timesQuery, [id]);
    const statsRow = counts.rows[0];
    const realHours = Number(times.rows[0]?.real_hours || 0);
    const completion = statsRow.total ? Math.round((statsRow.completed / statsRow.total) * 100) : 0;

    const data = {
      totalTasks: statsRow.total,
      pending: statsRow.pending,
      inProgress: statsRow.in_progress,
      completed: statsRow.completed,
      completionPercent: completion,
      estimatedHours: statsRow.estimated_hours,
      realHours
    };

    return res.json(envelopeSuccess(data));
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
