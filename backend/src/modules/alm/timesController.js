const { pool } = require('../../config/db');
const { envelopeSuccess, envelopeError } = require('../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../utils/pagination');
const { validateRequiredFields } = require('../../utils/validation');
const { generateId } = require('../../utils/id');

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

async function listTimes(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const filters = [];
    const values = [];

    if (req.query.companyId) {
      values.push(req.query.companyId);
      filters.push(`company_id = $${values.length}`);
    }
    if (req.query.taskId) {
      values.push(req.query.taskId);
      filters.push(`task_id = $${values.length}`);
    }
    if (req.query.userId) {
      values.push(req.query.userId);
      filters.push(`user_id = $${values.length}`);
    }
    if (req.query.entryDate) {
      values.push(req.query.entryDate);
      filters.push(`entry_date = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int AS total FROM alm_time_entries ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const listQuery = `
      SELECT *
      FROM alm_time_entries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `;

    const result = await pool.query(listQuery, values);
    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function createTime(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'taskId',
      'userId',
      'entryDate',
      'hours'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const insertQuery = `
      INSERT INTO alm_time_entries
        (id, company_id, task_id, user_id, entry_date, hours, description, created_at, updated_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `;

    const id = generateId('time');
    const now = new Date().toISOString();
    const result = await pool.query(insertQuery, [
      id,
      req.body.companyId,
      req.body.taskId,
      req.body.userId,
      req.body.entryDate,
      req.body.hours,
      req.body.description || null,
      now,
      now
    ]);

    return res.status(201).json(envelopeSuccess(mapTime(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function updateTime(req, res, next) {
  try {
    const { id } = req.params;
    const requiredErrors = validateRequiredFields(req.body, [
      'companyId',
      'taskId',
      'userId',
      'entryDate',
      'hours'
    ]);

    if (requiredErrors.length) {
      return res
        .status(400)
        .json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const updateQuery = `
      UPDATE alm_time_entries
      SET company_id = $1,
          task_id = $2,
          user_id = $3,
          entry_date = $4,
          hours = $5,
          description = $6,
          updated_at = $7
      WHERE id = $8
      RETURNING *
    `;

    const now = new Date().toISOString();
    const result = await pool.query(updateQuery, [
      req.body.companyId,
      req.body.taskId,
      req.body.userId,
      req.body.entryDate,
      req.body.hours,
      req.body.description || null,
      now,
      id
    ]);

    if (!result.rows.length) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }

    return res.json(envelopeSuccess(mapTime(result.rows[0])));
  } catch (err) {
    return next(err);
  }
}

async function deleteTime(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM alm_time_entries WHERE id = $1', [id]);
    if (!result.rowCount) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Registro de tiempo no encontrado'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function getProjectTimeSummary(req, res, next) {
  try {
    const { id } = req.params;
    const summaryQuery = `
      SELECT
        t.project_id,
        COUNT(r.id)::int AS registros,
        COALESCE(SUM(r.hours), 0)::numeric AS total_hours
      FROM alm_time_entries r
      JOIN alm_tasks t ON t.id = r.task_id
      WHERE t.project_id = $1
      GROUP BY t.project_id
    `;

    const result = await pool.query(summaryQuery, [id]);
    const row = result.rows[0];
    if (!row) {
      return res.json(envelopeSuccess({ projectId: id, entries: 0, totalHours: 0 }));
    }

    return res.json(envelopeSuccess({
      projectId: row.project_id,
      entries: row.registros,
      totalHours: Number(row.total_hours)
    }));
  } catch (err) {
    return next(err);
  }
}

async function getUserTimes(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_time_entries WHERE user_id = $1';
    const countResult = await pool.query(countQuery, [id]);
    const totalItems = countResult.rows[0]?.total || 0;

    const listQuery = `
      SELECT *
      FROM alm_time_entries
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, [id, limit, offset]);

    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getTaskTimes(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const countQuery = 'SELECT COUNT(*)::int AS total FROM alm_time_entries WHERE task_id = $1';
    const countResult = await pool.query(countQuery, [id]);
    const totalItems = countResult.rows[0]?.total || 0;

    const listQuery = `
      SELECT *
      FROM alm_time_entries
      WHERE task_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(listQuery, [id, limit, offset]);

    const data = result.rows.map(mapTime);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
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
