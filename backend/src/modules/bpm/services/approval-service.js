const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

function applyCompanyFilter(builder, companyId) {
  if (companyId) {
    return builder.eq('company_id', companyId);
  }
  return builder;
}

async function listApprovals(companyId, { limit, offset, processId }) {
  let builder = supabase
    .from('bpm_approvals')
    .select('*', { count: 'exact' });

  builder = applyCompanyFilter(builder, companyId);

  if (processId) {
    builder = builder.eq('process_id', processId);
  }

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function createApproval(companyId, data) {
  const id = generateId('bpm_appr');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_approvals')
    .insert([
      {
        id,
        company_id: companyId,
        process_id: data.processId,
        name: data.name,
        document_type: data.documentType || null,
        level: data.level,
        required_approvers: data.requiredApprovers,
        sla_hours: data.slaHours || null,
        created_at: now,
        updated_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function getApprovalById(companyId, id) {
  let builder = supabase
    .from('bpm_approvals')
    .select('*')
    .eq('id', id)
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function updateApproval(companyId, id, data) {
  const now = new Date().toISOString();

  const patch = {
    updated_at: now
  };

  if (data.name !== undefined) patch.name = data.name;
  if (data.documentType !== undefined) patch.document_type = data.documentType;
  if (data.level !== undefined) patch.level = data.level;
  if (data.requiredApprovers !== undefined) patch.required_approvers = data.requiredApprovers;
  if (data.slaHours !== undefined) patch.sla_hours = data.slaHours;

  let builder = supabase
    .from('bpm_approvals')
    .update(patch)
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteApproval(companyId, id) {
  let builder = supabase
    .from('bpm_approvals')
    .delete()
    .eq('id', id)
    .select('id')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return !!data;
}

async function listRequests(companyId, { limit, offset, approvalId, status }) {
  let builder = supabase
    .from('bpm_approval_requests')
    .select('*', { count: 'exact' });

  builder = applyCompanyFilter(builder, companyId);

  if (approvalId) {
    builder = builder.eq('approval_id', approvalId);
  }

  if (status) {
    builder = builder.eq('status', status);
  }

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: data || [], totalItems: count || 0 };
}

async function getRequestById(companyId, id) {
  let builder = supabase
    .from('bpm_approval_requests')
    .select('*')
    .eq('id', id)
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createRequest(companyId, data) {
  const id = generateId('bpm_areq');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_approval_requests')
    .insert([
      {
        id,
        company_id: companyId,
        approval_id: data.approvalId,
        reference_id: data.referenceId || null,
        reference_type: data.referenceType || null,
        requester_id: data.requesterId,
        status: 'pending',
        priority: data.priority,
        due_date: data.dueDate || null,
        start_date: now,
        created_at: now,
        updated_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateRequestStatus(companyId, id, status) {
  const now = new Date().toISOString();

  let builder = supabase
    .from('bpm_approval_requests')
    .update({ status, updated_at: now })
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function listResponses(companyId, requestId) {
  let builder = supabase
    .from('bpm_approval_responses')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder;
  if (error) throw error;
  return data || [];
}

async function addResponse(companyId, requestId, data) {
  const id = generateId('bpm_ares');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_approval_responses')
    .insert([
      {
        id,
        company_id: companyId,
        request_id: requestId,
        approver_id: data.approverId,
        decision: data.decision,
        comments: data.comments || null,
        created_at: now,
        updated_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
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
