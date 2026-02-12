const { pool } = require('../../../config/db');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

function isRecoverableSchemaError(error) {
  return ['42P01', '42703', '22P02'].includes(error?.code);
}

async function safeCount(query, params, label) {
  try {
    const result = await pool.query(query, params);
    return result.rows[0]?.total || 0;
  } catch (error) {
    console.error(`[BPM Metrics] ${label} count failed:`, error);
    return 0;
  }
}

// GET /api/v1/bpm/metricas - Metricas del dashboard BPM
async function getMetrics(req, res, next) {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    const [activeProcesses, activeInstances, pendingTasks, pendingApprovals] = await Promise.all([
      safeCount(
        `SELECT COUNT(*)::int AS total
         FROM bpm_processes
         WHERE company_id = $1 AND status = 'published'`,
        [companyId],
        'processes'
      ),
      safeCount(
        `SELECT COUNT(*)::int AS total
         FROM bpm_process_instances
         WHERE company_id = $1 AND status = 'active'`,
        [companyId],
        'instances'
      ),
      safeCount(
        `SELECT COUNT(*)::int AS total
         FROM bpm_process_tasks
         WHERE company_id = $1 AND status = 'pending'`,
        [companyId],
        'tasks'
      ),
      safeCount(
        `SELECT COUNT(*)::int AS total
         FROM bpm_approval_requests
         WHERE company_id = $1 AND status = 'pending'`,
        [companyId],
        'approvals'
      )
    ]);

    const metrics = {
      procesosActivos: activeProcesses,
      instanciasActivas: activeInstances,
      tareasPendientes: pendingTasks,
      aprobacionesPendientes: pendingApprovals
    };

    return res.json(envelopeSuccess(metrics));
  } catch (err) {
    if (isRecoverableSchemaError(err)) {
      return res.json(
        envelopeSuccess({
          procesosActivos: 0,
          instanciasActivas: 0,
          tareasPendientes: 0,
          aprobacionesPendientes: 0
        })
      );
    }

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
    const companyId = req.user?.companyId;
    const userId = req.user?.userId;

    if (!companyId || !userId) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid user context'));
    }

    const { rows } = await pool.query(
      `SELECT
         t.id,
         t.instance_id,
         t.activity_id,
         t.assigned_to,
         t.status,
         t.due_date,
         t.start_date,
         t.completed_at,
         t.result_json,
         t.created_at,
         t.updated_at,
         COALESCE(a.name, 'Tarea') AS title,
         a.description,
         'media'::text AS priority,
         i.process_id,
         p.name AS process_name
       FROM bpm_process_tasks t
       LEFT JOIN bpm_activities a
         ON a.id = t.activity_id AND a.company_id = t.company_id
       LEFT JOIN bpm_process_instances i
         ON i.id = t.instance_id AND i.company_id = t.company_id
       LEFT JOIN bpm_processes p
         ON p.id = i.process_id AND p.company_id = t.company_id
       WHERE t.company_id = $1
         AND t.assigned_to = $2
         AND t.status IN ('pending', 'in_progress')
       ORDER BY t.due_date ASC NULLS LAST, t.updated_at DESC
       LIMIT 50`,
      [companyId, userId]
    );

    return res.json(envelopeSuccess(rows || []));
  } catch (err) {
    if (isRecoverableSchemaError(err)) {
      return res.json(envelopeSuccess([]));
    }

    console.error('[BPM Task Inbox] Error:', err);
    return next(err);
  }
}

module.exports = {
  getMetrics,
  getTaskInbox
};
