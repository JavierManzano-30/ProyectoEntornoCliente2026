const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// GET /api/v1/bpm/metricas - Métricas del dashboard BPM
async function getMetrics(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    // Contar procesos activos
    const { count: activeProcesses, error: errorProcesses } = await supabase
      .from('bpm_processes')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'published');

    // Contar instancias activas
    const { count: activeInstances, error: errorInstances } = await supabase
      .from('bpm_instances')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'active');

    // Contar tareas pendientes
    const { count: pendingTasks, error: errorTasks } = await supabase
      .from('bpm_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'pending');

    // Contar aprobaciones pendientes
    const { count: pendingApprovals, error: errorApprovals } = await supabase
      .from('bpm_approval_requests')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'pending');

    if (errorProcesses || errorInstances || errorTasks || errorApprovals) {
      console.error('[BPM Metrics] Database error:', 
        errorProcesses || errorInstances || errorTasks || errorApprovals);
    }

    const metrics = {
      procesosActivos: activeProcesses || 0,
      instanciasActivas: activeInstances || 0,
      tareasPendientes: pendingTasks || 0,
      aprobacionesPendientes: pendingApprovals || 0
    };

    return res.json(envelopeSuccess(metrics));
  } catch (err) {
    console.error('[BPM Metrics] Error:', err);
    return next(err);
  }
}

// GET /api/v1/bpm/tareas/bandeja - Bandeja de tareas del usuario
async function getTaskInbox(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    const userId = req.user?.userId;
    
    if (!companyId || !userId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid user context'));
    }

    // Obtener tareas asignadas al usuario
    const { data, error } = await supabase
      .from('bpm_tasks')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        created_at,
        updated_at,
        instance_id,
        bpm_instances!inner (
          id,
          title,
          status,
          process_id,
          bpm_processes!inner (
            id,
            name
          )
        )
      `)
      .eq('company_id', companyId)
      .eq('assigned_to', userId)
      .in('status', ['pending', 'in_progress'])
      .order('due_date', { ascending: true })
      .order('priority', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[BPM Task Inbox] Database error:', error);
      return res.status(500).json(
        envelopeError('DATABASE_ERROR', 'Error fetching task inbox', error.message)
      );
    }

    return res.json(envelopeSuccess(data || []));
  } catch (err) {
    console.error('[BPM Task Inbox] Error:', err);
    return next(err);
  }
}

module.exports = {
  getMetrics,
  getTaskInbox
};
