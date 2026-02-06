const { pool } = require('../../../config/db');
const { generateId } = require('../../../utils/id');

async function listApprovals(companyId, { limit, offset, processId }) {
  const filters = [];
  const values = [];

  values.push(companyId);
  filters.push(`company_id = $${values.length}`);

  if (processId) {
    values.push(processId);
    filters.push(`process_id = $${values.length}`);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM bpm_approvals ${whereClause}`,
    values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM bpm_approvals ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return { rows, totalItems };
}

async function createApproval(companyId, data) {
  const id = generateId('bpm_appr');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_approvals (id, company_id, process_id, name, document_type, level, required_approvers, sla_hours, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      id, companyId, data.processId, data.name,
      data.documentType || null, data.level, data.requiredApprovers,
      data.slaHours || null, now, now
    ]
  );
  return rows[0];
}

async function getApprovalById(companyId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM bpm_approvals WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rows[0] || null;
}

async function updateApproval(companyId, id, data) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_approvals
     SET name = COALESCE($1, name),
         document_type = COALESCE($2, document_type),
         level = COALESCE($3, level),
         required_approvers = COALESCE($4, required_approvers),
         sla_hours = COALESCE($5, sla_hours),
         updated_at = $6
     WHERE id = $7 AND company_id = $8
     RETURNING *`,
    [
      data.name || null, data.documentType || null,
      data.level || null, data.requiredApprovers || null,
      data.slaHours || null, now, id, companyId
    ]
  );
  return rows[0] || null;
}

async function deleteApproval(companyId, id) {
  const { rowCount } = await pool.query(
    'DELETE FROM bpm_approvals WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rowCount > 0;
}

async function listRequests(companyId, { limit, offset, approvalId, status }) {
  const filters = [];
  const values = [];

  values.push(companyId);
  filters.push(`company_id = $${values.length}`);

  if (approvalId) {
    values.push(approvalId);
    filters.push(`approval_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    filters.push(`status = $${values.length}`);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM bpm_approval_requests ${whereClause}`,
    values
  );
  const totalItems = countResult.rows[0]?.total || 0;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM bpm_approval_requests ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return { rows, totalItems };
}

async function getRequestById(companyId, id) {
  const { rows } = await pool.query(
    'SELECT * FROM bpm_approval_requests WHERE id = $1 AND company_id = $2',
    [id, companyId]
  );
  return rows[0] || null;
}

async function createRequest(companyId, data) {
  const id = generateId('bpm_areq');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_approval_requests
       (id, company_id, approval_id, reference_id, reference_type, requester_id, status, priority, due_date, start_date, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      id, companyId, data.approvalId,
      data.referenceId || null, data.referenceType || null,
      data.requesterId, 'pending', data.priority,
      data.dueDate || null, now, now, now
    ]
  );
  return rows[0];
}

async function updateRequestStatus(companyId, id, status) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `UPDATE bpm_approval_requests
     SET status = $1, updated_at = $2
     WHERE id = $3 AND company_id = $4
     RETURNING *`,
    [status, now, id, companyId]
  );
  return rows[0] || null;
}

async function listResponses(companyId, requestId) {
  const { rows } = await pool.query(
    `SELECT * FROM bpm_approval_responses
     WHERE company_id = $1 AND request_id = $2
     ORDER BY created_at ASC`,
    [companyId, requestId]
  );
  return rows;
}

async function addResponse(companyId, requestId, data) {
  const id = generateId('bpm_ares');
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `INSERT INTO bpm_approval_responses (id, company_id, request_id, approver_id, decision, comments, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      id, companyId, requestId, data.approverId,
      data.decision, data.comments || null, now, now
    ]
  );
  return rows[0];
}

module.exports = {
  listApprovals,
  createApproval,
  getApprovalById,
  updateApproval,
  deleteApproval,
  listRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  listResponses,
  addResponse
};
