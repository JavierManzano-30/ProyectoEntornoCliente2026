const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listInstances(companyId, { limit, offset, processId, status }) {
  const filters = [];
  const values = [];

  values.push(companyId);
  filters.push(`company_id = $${values.length}`);

  if (processId) {
    values.push(processId);
    filters.push(`process_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    filters.push(`status = $${values.length}`);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM bpm_process_instances ${whereClause}`,
    values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM bpm_process_instances ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return { rows, totalItems };
}

async function getInstanceById(companyId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM bpm_process_instances WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rows[0] || null;
}

async function createInstance(companyId, data) {
  const id = generateId('bpm_inst');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_process_instances
       (id, company_id, process_id, reference_id, reference_type, alm_project_id, alm_task_id, status, progress_percent, started_by, start_date, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      id, companyId, data.processId,
      data.referenceId || null, data.referenceType || null,
      data.almProjectId || null, data.almTaskId || null,
      'started', 0, data.startedBy, now, now, now
    ]
  );
  return rows[0];
}

async function updateInstance(companyId, id, data) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_process_instances
     SET status = COALESCE($1, status),
         progress_percent = COALESCE($2, progress_percent),
         end_date = COALESCE($3, end_date),
         updated_at = $4
     WHERE id = $5 AND company_id = $6
     RETURNING *`,
    [
      data.status || null, data.progressPercent ?? null,
      data.endDate || null, now, id, companyId
    ]
  );
  return rows[0] || null;
}

async function cancelInstance(companyId, id) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_process_instances
     SET status = 'canceled', end_date = $1, updated_at = $1
     WHERE id = $2 AND company_id = $3
     RETURNING *`,
    [now, id, companyId]
  );
  return rows[0] || null;
}

async function listTasks(companyId, instanceId) {
  const { rows } = await pool.query(
    `SELECT * FROM bpm_process_tasks
     WHERE company_id = $1 AND instance_id = $2
     ORDER BY created_at ASC`,
    [companyId, instanceId]
  );
  return rows;
}

async function updateTask(companyId, id, data) {
  const now = new Date().toISOString();
  const completedAt = data.status === 'completed' ? now : null;
  const startDate = data.status === 'in_progress' ? now : null;
  const { rows } = await pool.query(
    `UPDATE bpm_process_tasks
     SET status = COALESCE($1, status),
         assigned_to = COALESCE($2, assigned_to),
         result_json = COALESCE($3, result_json),
         start_date = COALESCE($4, start_date),
         completed_at = COALESCE($5, completed_at),
         updated_at = $6
     WHERE id = $7 AND company_id = $8
     RETURNING *`,
    [
      data.status || null, data.assignedTo || null,
      data.resultJson || null, startDate, completedAt,
      now, id, companyId
    ]
  );
  return rows[0] || null;
}

async function addDocument(companyId, instanceId, data) {
  const id = generateId('bpm_doc');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_documents (id, company_id, instance_id, file_name, document_type, size, storage_url, user_id, classification, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      id, companyId, instanceId, data.fileName,
      data.documentType || null, data.size || null,
      data.storageUrl || null, data.userId || null,
      data.classification || null, now
    ]
  );
  return rows[0];
}

async function listDocuments(companyId, instanceId) {
  const { rows } = await pool.query(
    `SELECT * FROM bpm_documents
     WHERE company_id = $1 AND instance_id = $2
     ORDER BY created_at DESC`,
    [companyId, instanceId]
  );
  return rows;
}

async function addComment(companyId, instanceId, data) {
  const id = generateId('bpm_com');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_comments (id, company_id, instance_id, user_id, content, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [id, companyId, instanceId, data.userId, data.content, now, now]
  );
  return rows[0];
}

async function listComments(companyId, instanceId) {
  const { rows } = await pool.query(
    `SELECT * FROM bpm_comments
     WHERE company_id = $1 AND instance_id = $2
     ORDER BY created_at ASC`,
    [companyId, instanceId]
  );
  return rows;
}

async function addAuditLog(companyId, data) {
  const id = generateId('bpm_log');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_audit_log (id, company_id, process_id, instance_id, user_id, action, details, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      id, companyId, data.processId, data.instanceId || null,
      data.userId, data.action, data.details || null, now
    ]
  );
  return rows[0];
}

async function getAuditLog(companyId, processId, { limit, offset }) {
  const countResult = await pool.query(
    'SELECT COUNT(*)::int AS total FROM bpm_audit_log WHERE company_id = $1 AND process_id = $2',
    [companyId, processId]
  );
  const totalItems = countResult.rows[0]?.total || 0;

  const { rows } = await pool.query(
    `SELECT * FROM bpm_audit_log
     WHERE company_id = $1 AND process_id = $2
     ORDER BY created_at DESC
     LIMIT $3 OFFSET $4`,
    [companyId, processId, limit, offset]
  );

  return { rows, totalItems };
}

module.exports = {
  listInstances,
  getInstanceById,
  createInstance,
  updateInstance,
  cancelInstance,
  listTasks,
  updateTask,
  addDocument,
  listDocuments,
  addComment,
  listComments,
  addAuditLog,
  getAuditLog
};
