const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

const STATUS_FILTER_MAP = {
  published: 'active',
  draft: 'inactive',
  inactive: 'inactive',
  active: 'active',
  archived: 'archived'
};

function applyCompanyFilter(builder, companyId) {
  if (companyId) {
    return builder.eq('company_id', companyId);
  }
  return builder;
}

async function listProcesses(companyId, { limit, offset, status, search }) {
  let builder = supabase
    .from('bpm_processes')
    .select('*', { count: 'exact' });

  builder = applyCompanyFilter(builder, companyId);

  if (status) {
    const normalizedStatus = STATUS_FILTER_MAP[status] || status;
    builder = builder.eq('status', normalizedStatus);
  }

  if (search) {
    builder = builder.ilike('name', `%${search}%`);
  }

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const rows = data || [];
  if (!rows.length) {
    return { rows: [], totalItems: count || 0 };
  }

  const processIds = rows.map((row) => row.id);

  let instanceBuilder = supabase
    .from('bpm_process_instances')
    .select('process_id,status');

  instanceBuilder = applyCompanyFilter(instanceBuilder, companyId);
  instanceBuilder = instanceBuilder
    .in('process_id', processIds)
    .in('status', ['started', 'in_progress']);

  const { data: instanceRows, error: instanceError } = await instanceBuilder;
  if (instanceError) throw instanceError;

  const activeByProcess = (instanceRows || []).reduce((acc, row) => {
    acc[row.process_id] = (acc[row.process_id] || 0) + 1;
    return acc;
  }, {});

  return {
    rows: rows.map((row) => ({
      ...row,
      active_instances: activeByProcess[row.id] || 0
    })),
    totalItems: count || 0
  };
}

async function getProcessById(companyId, id) {
  let builder = supabase
    .from('bpm_processes')
    .select('*')
    .eq('id', id)
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createProcess(companyId, data) {
  const id = generateId('bpm_proc');
  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from('bpm_processes')
    .insert([{
      id,
      company_id: companyId,
      name: data.name,
      description: data.description || null,
      version: data.version || 1,
      status: data.status,
      flow_json: data.flowJson || null,
      created_by: data.createdBy || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateProcess(companyId, id, data) {
  const now = new Date().toISOString();
  const patch = { updated_at: now };
  if (data.name !== undefined) patch.name = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.version !== undefined) patch.version = data.version;
  if (data.status !== undefined) patch.status = data.status;
  if (data.flowJson !== undefined) patch.flow_json = data.flowJson;

  let builder = supabase
    .from('bpm_processes')
    .update(patch)
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteProcess(companyId, id) {
  let builder = supabase
    .from('bpm_processes')
    .delete()
    .eq('id', id)
    .select('id')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return !!data;
}

async function listActivities(companyId, processId) {
  let builder = supabase
    .from('bpm_activities')
    .select('*')
    .eq('process_id', processId)
    .order('sort_order', { ascending: true });

  builder = applyCompanyFilter(builder, companyId);
  const { data, error } = await builder;
  if (error) throw error;
  return data || [];
}

async function getActivityById(companyId, id) {
  let builder = supabase
    .from('bpm_activities')
    .select('*')
    .eq('id', id)
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createActivity(companyId, processId, data) {
  const id = generateId('bpm_act');
  const now = new Date().toISOString();
  const { data: row, error } = await supabase
    .from('bpm_activities')
    .insert([{
      id,
      company_id: companyId,
      process_id: processId,
      name: data.name,
      description: data.description || null,
      type: data.type,
      sort_order: data.sortOrder,
      assigned_role: data.assignedRole || null,
      time_limit_hours: data.timeLimitHours || null,
      required_docs: data.requiredDocs || null,
      created_at: now,
      updated_at: now
    }])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateActivity(companyId, id, data) {
  const now = new Date().toISOString();
  const patch = { updated_at: now };
  if (data.name !== undefined) patch.name = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.type !== undefined) patch.type = data.type;
  if (data.sortOrder !== undefined) patch.sort_order = data.sortOrder;
  if (data.assignedRole !== undefined) patch.assigned_role = data.assignedRole;
  if (data.timeLimitHours !== undefined) patch.time_limit_hours = data.timeLimitHours;
  if (data.requiredDocs !== undefined) patch.required_docs = data.requiredDocs;

  let builder = supabase
    .from('bpm_activities')
    .update(patch)
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function deleteActivity(companyId, id) {
  let builder = supabase
    .from('bpm_activities')
    .delete()
    .eq('id', id)
    .select('id')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);
  const { data, error } = await builder.maybeSingle();
  if (error) throw error;
  return !!data;
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
