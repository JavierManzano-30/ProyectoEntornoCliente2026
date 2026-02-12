const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

// GET /api/v1/crm/dashboard - Obtener estadísticas del dashboard CRM
async function getDashboard(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    // Total de clientes
    const { count: totalClientes, error: errorClientes } = await supabase
      .from('crm_clients')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Clientes activos
    const { count: clientesActivos, error: errorActivos } = await supabase
      .from('crm_clients')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'active');

    // Total de oportunidades
    const { count: totalOportunidades, error: errorOportunidades } = await supabase
      .from('crm_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Oportunidades abiertas
    const { count: oportunidadesAbiertas, error: errorAbiertas } = await supabase
      .from('crm_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('stage', 'open');

    // Total de contactos
    const { count: totalContactos, error: errorContactos } = await supabase
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Total de actividades
    const { count: totalActividades, error: errorActividades } = await supabase
      .from('crm_activities')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Log errors but don't fail the request - return 0 for missing tables
    if (errorClientes) console.error('[CRM Dashboard] Error clientes:', errorClientes);
    if (errorActivos) console.error('[CRM Dashboard] Error activos:', errorActivos);
    if (errorOportunidades) console.error('[CRM Dashboard] Error oportunidades:', errorOportunidades);
    if (errorAbiertas) console.error('[CRM Dashboard] Error abiertas:', errorAbiertas);
    if (errorContactos) console.error('[CRM Dashboard] Error contactos:', errorContactos);
    if (errorActividades) console.error('[CRM Dashboard] Error actividades:', errorActividades);

    const dashboardData = {
      totalClientes: totalClientes || 0,
      clientesActivos: clientesActivos || 0,
      totalOportunidades: totalOportunidades || 0,
      oportunidadesAbiertas: oportunidadesAbiertas || 0,
      totalContactos: totalContactos || 0,
      totalActividades: totalActividades || 0
    };

    return res.json(envelopeSuccess(dashboardData));
  } catch (err) {
    console.error('[CRM Dashboard] Unexpected error:', err);
    return next(err);
  }
}

module.exports = {
  getDashboard
};
