const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

function resolveCompanyId(req) {
  return (
    req.user?.companyId ||
    req.user?.company_id ||
    req.headers['x-company-id'] ||
    req.query.companyId ||
    null
  );
}

function resolveUserId(req) {
  return req.user?.userId || req.user?.user_id || req.headers['x-user-id'] || req.query.userId || null;
}

async function safeCount(table, companyId, extraFilter) {
  try {
    let builder = supabase.from(table).select('*', { count: 'exact', head: true });

    if (companyId) {
      builder = builder.eq('company_id', companyId);
    }

    if (extraFilter) {
      builder = extraFilter(builder);
    }

    const { count, error } = await builder;
    if (error) {
      console.error(`[BPM Metrics] ${table} count failed:`, error.message || error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error(`[BPM Metrics] ${table} count failed:`, error.message || error);
    return 0;
  }
}

// GET /api/v1/bpm/metricas - Metricas del dashboard BPM
async function getMetrics(req, res) {
  try {
    const companyId = resolveCompanyId(req);

    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const [activeProcesses, activeInstances, pendingTasks, pendingApprovals] = await Promise.all([
      safeCount('bpm_processes', companyId, (builder) => builder.eq('status', 'active')),
      safeCount('bpm_process_instances', companyId, (builder) =>
        builder.in('status', ['started', 'in_progress'])
      ),
      safeCount('bpm_process_tasks', companyId, (builder) => builder.eq('status', 'pending')),
      safeCount('bpm_approval_requests', companyId, (builder) => builder.eq('status', 'pending'))
    ]);

    const metrics = {
      procesosActivos: activeProcesses,
      instanciasActivas: activeInstances,
      tareasPendientes: pendingTasks,
      aprobacionesPendientes: pendingApprovals
    };

    return res.json(envelopeSuccess(metrics));
  } catch (err) {
    console.error('[BPM Metrics] Error:', err);
    return res.json(
      envelopeSuccess({
        procesosActivos: 0,
        instanciasActivas: 0,
        tareasPendientes: 0,
        aprobacionesPendientes: 0
      })
    );
  }
}

// GET /api/v1/bpm/tareas/bandeja - Bandeja de tareas del usuario
async function getTaskInbox(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    const userId = resolveUserId(req);

    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    let taskBuilder = supabase
      .from('bpm_process_tasks')
      .select('*')
      .eq('company_id', companyId)
      .in('status', ['pending', 'in_progress'])
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('updated_at', { ascending: false })
      .limit(50);

    if (userId) {
      taskBuilder = taskBuilder.eq('assigned_to', userId);
    }

    let { data: tasks, error } = await taskBuilder;
    if (error) {
      console.error('[BPM Task Inbox] list tasks failed:', error.message || error);
      return res.json(envelopeSuccess([]));
    }

    // Fallback para entorno demo: si no hay coincidencias por assigned_to, devolver tareas de la empresa.
    if ((!tasks || !tasks.length) && userId) {
      const fallback = await supabase
        .from('bpm_process_tasks')
        .select('*')
        .eq('company_id', companyId)
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('updated_at', { ascending: false })
        .limit(50);

      if (!fallback.error) {
        tasks = fallback.data || [];
      }
    }

    const taskRows = tasks || [];
    if (!taskRows.length) {
      return res.json(envelopeSuccess([]));
    }

    const activityIds = [...new Set(taskRows.map((task) => task.activity_id).filter(Boolean))];
    const instanceIds = [...new Set(taskRows.map((task) => task.instance_id).filter(Boolean))];

    const [activitiesRes, instancesRes] = await Promise.all([
      activityIds.length
        ? supabase
            .from('bpm_activities')
            .select('id,name,description')
            .eq('company_id', companyId)
            .in('id', activityIds)
        : Promise.resolve({ data: [], error: null }),
      instanceIds.length
        ? supabase
            .from('bpm_process_instances')
            .select('id,process_id')
            .eq('company_id', companyId)
            .in('id', instanceIds)
        : Promise.resolve({ data: [], error: null })
    ]);

    if (activitiesRes.error) {
      console.error('[BPM Task Inbox] list activities failed:', activitiesRes.error.message || activitiesRes.error);
    }

    if (instancesRes.error) {
      console.error('[BPM Task Inbox] list instances failed:', instancesRes.error.message || instancesRes.error);
    }

    const instances = instancesRes.data || [];
    const processIds = [...new Set(instances.map((instance) => instance.process_id).filter(Boolean))];

    const processesRes = processIds.length
      ? await supabase
          .from('bpm_processes')
          .select('id,name')
          .eq('company_id', companyId)
          .in('id', processIds)
      : { data: [], error: null };

    if (processesRes.error) {
      console.error('[BPM Task Inbox] list processes failed:', processesRes.error.message || processesRes.error);
    }

    const activityById = (activitiesRes.data || []).reduce((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});

    const instanceById = instances.reduce((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});

    const processById = (processesRes.data || []).reduce((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});

    const rows = taskRows.map((task) => {
      const activity = activityById[task.activity_id] || {};
      const instance = instanceById[task.instance_id] || {};
      const process = processById[instance.process_id] || {};

      return {
        ...task,
        title: activity.name || 'Tarea',
        description: activity.description || '',
        priority: 'normal',
        process_id: instance.process_id || null,
        process_name: process.name || ''
      };
    });

    return res.json(envelopeSuccess(rows));
  } catch (err) {
    console.error('[BPM Task Inbox] Error:', err);
    return next(err);
  }
}

module.exports = {
  getMetrics,
  getTaskInbox
};
