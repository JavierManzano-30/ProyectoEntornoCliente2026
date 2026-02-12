const supabase = require('../../../config/supabase');
const { generateId } = require('../../../utils/id');

function applyCompanyFilter(builder, companyId) {
  if (companyId) {
    return builder.eq('company_id', companyId);
  }
  return builder;
}

async function listInstances(companyId, { limit, offset, processId, status }) {
  let builder = supabase
    .from('bpm_process_instances')
    .select('*', { count: 'exact' });

  builder = applyCompanyFilter(builder, companyId);

  if (processId) {
    builder = builder.eq('process_id', processId);
  }

  if (status) {
    if (status === 'active') {
      builder = builder.in('status', ['started', 'in_progress']);
    } else if (status === 'cancelled') {
      builder = builder.eq('status', 'canceled');
    } else if (status === 'pending') {
      builder = builder.eq('status', 'started');
    } else {
      builder = builder.eq('status', status);
    }
  }

  const { data, error, count } = await builder
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const rows = data || [];
  if (!rows.length) {
    return { rows: [], totalItems: count || 0 };
  }

  const processIds = [...new Set(rows.map((row) => row.process_id).filter(Boolean))];

  let processBuilder = supabase
    .from('bpm_processes')
    .select('id,name');

  processBuilder = applyCompanyFilter(processBuilder, companyId);
  if (processIds.length) {
    processBuilder = processBuilder.in('id', processIds);
  }

  const { data: processRows, error: processError } = await processBuilder;
  if (processError) throw processError;

  const processNameById = (processRows || []).reduce((acc, row) => {
    acc[row.id] = row.name;
    return acc;
  }, {});

  return {
    rows: rows.map((row) => ({
      ...row,
      process_name: processNameById[row.process_id] || null
    })),
    totalItems: count || 0
  };
}

async function getInstanceById(companyId, id) {
  let builder = supabase
    .from('bpm_process_instances')
    .select('*')
    .eq('id', id)
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: instance, error } = await builder.maybeSingle();
  if (error) throw error;
  if (!instance) return null;

  let processBuilder = supabase
    .from('bpm_processes')
    .select('name')
    .eq('id', instance.process_id)
    .limit(1);

  processBuilder = applyCompanyFilter(processBuilder, companyId);

  const { data: processRow } = await processBuilder.maybeSingle();

  return {
    ...instance,
    process_name: processRow?.name || null
  };
}

async function createInstance(companyId, data) {
  const id = generateId('bpm_inst');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_process_instances')
    .insert([
      {
        id,
        company_id: companyId,
        process_id: data.processId,
        reference_id: data.referenceId || null,
        reference_type: data.referenceType || null,
        alm_project_id: data.almProjectId || null,
        alm_task_id: data.almTaskId || null,
        status: 'started',
        progress_percent: 0,
        started_by: data.startedBy,
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

async function updateInstance(companyId, id, data) {
  const now = new Date().toISOString();

  const patch = {
    updated_at: now
  };

  if (data.status !== undefined) patch.status = data.status;
  if (data.progressPercent !== undefined) patch.progress_percent = data.progressPercent;
  if (data.endDate !== undefined) patch.end_date = data.endDate;

  let builder = supabase
    .from('bpm_process_instances')
    .update(patch)
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function cancelInstance(companyId, id) {
  const now = new Date().toISOString();

  let builder = supabase
    .from('bpm_process_instances')
    .update({
      status: 'canceled',
      end_date: now,
      updated_at: now
    })
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function listTasks(companyId, instanceId) {
  let builder = supabase
    .from('bpm_process_tasks')
    .select('*')
    .eq('instance_id', instanceId)
    .order('created_at', { ascending: true });

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder;
  if (error) throw error;
  return data || [];
}

async function createTask(companyId, data) {
  const now = new Date().toISOString();
  const taskId = generateId('bpm_task');

  let instanceId = data.instanceId || null;
  let processId = data.processId || null;

  if (instanceId) {
    let instanceBuilder = supabase
      .from('bpm_process_instances')
      .select('id,process_id')
      .eq('id', instanceId)
      .limit(1);

    instanceBuilder = applyCompanyFilter(instanceBuilder, companyId);
    const { data: instanceRow, error: instanceError } = await instanceBuilder.maybeSingle();
    if (instanceError) throw instanceError;
    if (!instanceRow) {
      throw new Error('Instance not found');
    }
    processId = instanceRow.process_id;
  }

  if (!processId) {
    throw new Error('processId is required');
  }

  let activityBuilder = supabase
    .from('bpm_activities')
    .select('id,process_id')
    .eq('id', data.activityId)
    .limit(1);

  activityBuilder = applyCompanyFilter(activityBuilder, companyId);
  const { data: activityRow, error: activityError } = await activityBuilder.maybeSingle();
  if (activityError) throw activityError;
  if (!activityRow) {
    throw new Error('Activity not found');
  }

  if (activityRow.process_id !== processId) {
    throw new Error('Activity does not belong to process');
  }

  if (!instanceId) {
    const createdInstanceId = generateId('bpm_inst');
    const { data: instanceCreated, error: createInstanceError } = await supabase
      .from('bpm_process_instances')
      .insert([
        {
          id: createdInstanceId,
          company_id: companyId,
          process_id: processId,
          reference_id: null,
          reference_type: null,
          alm_project_id: null,
          alm_task_id: null,
          status: 'started',
          progress_percent: 0,
          started_by: data.startedBy || data.assignedTo || 'system',
          start_date: now,
          end_date: null,
          created_at: now,
          updated_at: now
        }
      ])
      .select('id')
      .single();

    if (createInstanceError) throw createInstanceError;
    instanceId = instanceCreated.id;
  }

  const { data: row, error } = await supabase
    .from('bpm_process_tasks')
    .insert([
      {
        id: taskId,
        company_id: companyId,
        instance_id: instanceId,
        activity_id: data.activityId,
        alm_task_id: data.almTaskId || null,
        assigned_to: data.assignedTo || null,
        status: data.status || 'pending',
        due_date: data.dueDate || null,
        start_date: data.status === 'in_progress' ? now : null,
        completed_at: data.status === 'completed' ? now : null,
        result_json: data.resultJson || null,
        created_at: now,
        updated_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function updateTask(companyId, id, data) {
  const now = new Date().toISOString();

  const patch = {
    updated_at: now
  };

  if (data.status !== undefined) patch.status = data.status;
  if (data.assignedTo !== undefined) patch.assigned_to = data.assignedTo;
  if (data.dueDate !== undefined) patch.due_date = data.dueDate;
  if (data.resultJson !== undefined) patch.result_json = data.resultJson;
  if (data.status === 'in_progress') patch.start_date = now;
  if (data.status === 'completed') patch.completed_at = now;

  let builder = supabase
    .from('bpm_process_tasks')
    .update(patch)
    .eq('id', id)
    .select('*')
    .limit(1);

  builder = applyCompanyFilter(builder, companyId);

  const { data: row, error } = await builder.maybeSingle();
  if (error) throw error;
  return row || null;
}

async function addDocument(companyId, instanceId, data) {
  const id = generateId('bpm_doc');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_documents')
    .insert([
      {
        id,
        company_id: companyId,
        instance_id: instanceId,
        file_name: data.fileName,
        document_type: data.documentType || null,
        size: data.size || null,
        storage_url: data.storageUrl || null,
        user_id: data.userId || null,
        classification: data.classification || null,
        created_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function listDocuments(companyId, instanceId) {
  let builder = supabase
    .from('bpm_documents')
    .select('*')
    .eq('instance_id', instanceId)
    .order('created_at', { ascending: false });

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder;
  if (error) throw error;
  return data || [];
}

async function addComment(companyId, instanceId, data) {
  const id = generateId('bpm_com');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_comments')
    .insert([
      {
        id,
        company_id: companyId,
        instance_id: instanceId,
        user_id: data.userId,
        content: data.content,
        created_at: now,
        updated_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function listComments(companyId, instanceId) {
  let builder = supabase
    .from('bpm_comments')
    .select('*')
    .eq('instance_id', instanceId)
    .order('created_at', { ascending: true });

  builder = applyCompanyFilter(builder, companyId);

  const { data, error } = await builder;
  if (error) throw error;
  return data || [];
}

async function addAuditLog(companyId, data) {
  const id = generateId('bpm_log');
  const now = new Date().toISOString();

  const { data: row, error } = await supabase
    .from('bpm_audit_log')
    .insert([
      {
        id,
        company_id: companyId,
        process_id: data.processId,
        instance_id: data.instanceId || null,
        user_id: data.userId,
        action: data.action,
        details: data.details || null,
        created_at: now
      }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return row;
}

async function getAuditLog(companyId, processId, { limit, offset }) {
  let builder = supabase
    .from('bpm_audit_log')
    .select('*', { count: 'exact' })
    .eq('process_id', processId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  builder = applyCompanyFilter(builder, companyId);

  const { data, error, count } = await builder;
  if (error) throw error;

  return {
    rows: data || [],
    totalItems: count || 0
  };
}

module.exports = {
  listInstances,
  getInstanceById,
  createInstance,
  updateInstance,
  cancelInstance,
  listTasks,
  createTask,
  updateTask,
  addDocument,
  listDocuments,
  addComment,
  listComments,
  addAuditLog,
  getAuditLog
};
