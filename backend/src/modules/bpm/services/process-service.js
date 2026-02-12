const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

const STATUS_FILTER_MAP = {
  published: 'active',
  draft: 'inactive',
  inactive: 'inactive',
  active: 'active',
  archived: 'archived'
};

async function listProcesses(companyId, { limit, offset, status, search }) {
  const filters = [];
  const values = [];

  values.push(companyId);
  filters.push(`p.company_id = $${values.length}`);

  if (status) {
    const normalizedStatus = STATUS_FILTER_MAP[status] || status;
    values.push(normalizedStatus);
    filters.push(`p.status = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    filters.push(`p.name ILIKE $${values.length}`);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM bpm_processes p ${whereClause}`,
      values
    );
    const totalItems = countResult.rows[0]?.total || 0;

    values.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT
         p.*,
         COALESCE(ai.active_instances, 0) AS active_instances
       FROM bpm_processes p
       LEFT JOIN (
         SELECT process_id, COUNT(*)::int AS active_instances
         FROM bpm_process_instances
         WHERE company_id = $1 AND status IN ('started', 'in_progress')
         GROUP BY process_id
       ) ai ON ai.process_id = p.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return { rows, totalItems };
  } catch (error) {
    if (['42P01', '42703', '22P02'].includes(error?.code)) {
      return { rows: [], totalItems: 0 };
    }
    throw error;
  }
}

async function getProcessById(companyId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM bpm_processes WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rows[0] || null;
}

async function createProcess(companyId, data) {
  const id = generateId('bpm_proc');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_processes (id, company_id, name, description, version, status, flow_json, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      id, companyId, data.name, data.description || null,
      data.version || 1, data.status, data.flowJson || null,
      data.createdBy || null, now, now
    ]
  );
  return rows[0];
}

async function updateProcess(companyId, id, data) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_processes
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         version = COALESCE($3, version),
         status = COALESCE($4, status),
         flow_json = COALESCE($5, flow_json),
         updated_at = $6
     WHERE id = $7 AND company_id = $8
     RETURNING *`,
    [
      data.name || null, data.description || null,
      data.version || null, data.status || null,
      data.flowJson || null, now, id, companyId
    ]
  );
  return rows[0] || null;
}

async function deleteProcess(companyId, id) {
  const { rowCount } = await pool.query(
    'DELETE FROM bpm_processes WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rowCount > 0;
}

async function listActivities(companyId, processId) {
  const { rows } = await pool.query(
    `SELECT * FROM bpm_activities
     WHERE company_id = $1 AND process_id = $2
     ORDER BY sort_order ASC`,
    [companyId, processId]
  );
  return rows;
}

async function getActivityById(companyId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM bpm_activities WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rows[0] || null;
}

async function createActivity(companyId, processId, data) {
  const id = generateId('bpm_act');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_activities (id, company_id, process_id, name, description, type, sort_order, assigned_role, time_limit_hours, required_docs, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      id, companyId, processId, data.name, data.description || null,
      data.type, data.sortOrder, data.assignedRole || null,
      data.timeLimitHours || null, data.requiredDocs || null, now, now
    ]
  );
  return rows[0];
}

async function updateActivity(companyId, id, data) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_activities
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         sort_order = COALESCE($4, sort_order),
         assigned_role = COALESCE($5, assigned_role),
         time_limit_hours = COALESCE($6, time_limit_hours),
         required_docs = COALESCE($7, required_docs),
         updated_at = $8
     WHERE id = $9 AND company_id = $10
     RETURNING *`,
    [
      data.name || null, data.description || null,
      data.type || null, data.sortOrder || null,
      data.assignedRole || null, data.timeLimitHours || null,
      data.requiredDocs || null, now, id, companyId
    ]
  );
  return rows[0] || null;
}

async function deleteActivity(companyId, id) {
  const { rowCount } = await pool.query(
    'DELETE FROM bpm_activities WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rowCount > 0;
}

module.exports = {
  listProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  listActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
