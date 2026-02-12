const supabase = require('../../../config/supabase');
const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

// GET /api/v1/core/dashboard - Obtener estadísticas del dashboard
async function getDashboard(req, res, next) {
  try {
    const companyId = req.user?.companyId;
    if (!companyId || !isUuid(companyId)) {
      return res.status(403).json(envelopeError('FORBIDDEN', 'Invalid company context'));
    }

    // Total de usuarios de la empresa
    const { count: totalUsuarios, error: errorTotal } = await supabase
      .from('core_users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Usuarios activos
    const { count: usuariosActivos, error: errorActivos } = await supabase
      .from('core_users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_active', true);

    // Usuarios creados en los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: usuariosNuevos, error: errorNuevos } = await supabase
      .from('core_users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Total de roles
    const { count: totalRoles, error: errorRoles } = await supabase
      .from('core_roles')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (errorTotal || errorActivos || errorNuevos || errorRoles) {
      return res.status(500).json(
        envelopeError('DATABASE_ERROR', 'Error fetching dashboard stats')
      );
    }

    const dashboardData = {
      totalUsuarios: totalUsuarios || 0,
      usuariosActivos: usuariosActivos || 0,
      usuariosNuevos: usuariosNuevos || 0,
      totalRoles: totalRoles || 0
    };

    return res.json(envelopeSuccess(dashboardData));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDashboard
};
