const supabase = require('../../../config/supabase');

async function getKPIs(companyId) {
  // Calcular KPIs desde datos reales o retornar demo con 0s
  // En producción real, estos cálculos vendrían de tablas de métricas agregadas
  
  const [{ count: totalClients }, { count: totalEmployees }] = await Promise.all([
    supabase.from('crm_clients').select('*', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('hr_employees').select('*', { count: 'exact', head: true }).eq('company_id', companyId)
  ]);

  // Retornar estructura esperada por el frontend
  return {
    ingresosTotales: { value: 0, change: 0, trend: 'up' },
    costesOperativos: { value: 0, change: 0, trend: 'down' },
    beneficioNeto: { value: 0, change: 0, trend: 'up' },
    clientesActivos: { value: totalClients || 0, change: 0, trend: 'up' },
    tasaConversion: { value: 0, change: 0, trend: 'up' },
    ticketMedio: { value: 0, change: 0, trend: 'up' }
  };
}

async function listReports(companyId) {
  const { data, error } = await supabase
    .from('bi_reports')
    .select('id, name, description, module, owner_id, company_id, created_at')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function createReport(companyId, ownerId, payload) {
  const { name, description, module, queryDefinition } = payload;
  const { data, error } = await supabase
    .from('bi_reports')
    .insert([
      {
        name,
        description: description || null,
        module: module || null,
        query_definition: queryDefinition,
        owner_id: ownerId,
        company_id: companyId
      }
    ])
    .select('id, name, description, module, owner_id, company_id, created_at')
    .single();

  if (error) throw error;
  return data;
}

async function runReport(companyId, reportId) {
  const { data: report, error: reportError } = await supabase
    .from('bi_reports')
    .select('id, name, query_definition')
    .eq('id', reportId)
    .eq('company_id', companyId)
    .maybeSingle();

  if (reportError) throw reportError;
  if (!report) return null;

  const startedAt = new Date();
  const { data: run, error: runError } = await supabase
    .from('bi_report_runs')
    .insert([
      {
        report_id: reportId,
        status: 'completed',
        started_at: startedAt.toISOString(),
        finished_at: new Date().toISOString()
      }
    ])
    .select('id, report_id, status, started_at, finished_at')
    .single();

  if (runError) throw runError;

  return {
    report,
    run
  };
}

async function getDashboard(companyId) {
  // Retornar estructura esperada por el frontend con datos de ejemplo
  // En producción real, estos datos vendrían de agregaciones en la BD
  
  return {
    ingresosPorMes: [
      { mes: 'Ago', ingresos: 0, costes: 0 },
      { mes: 'Sep', ingresos: 0, costes: 0 },
      { mes: 'Oct', ingresos: 0, costes: 0 },
      { mes: 'Nov', ingresos: 0, costes: 0 },
      { mes: 'Dic', ingresos: 0, costes: 0 },
      { mes: 'Ene', ingresos: 0, costes: 0 }
    ],
    ventasPorCategoria: [],
    clientesPorRegion: [],
    topProductos: []
  };
}

async function listAlerts(companyId) {
  const { data, error } = await supabase
    .from('bi_alerts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[BI Alerts] Database error:', error);
    return [];
  }
  return data || [];
}

async function listDatasets(companyId) {
  const { data, error } = await supabase
    .from('bi_datasets')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[BI Datasets] Database error:', error);
    return [];
  }
  return data || [];
}

module.exports = {
  getKPIs,
  listReports,
  createReport,
  runReport,
  getDashboard,
  listAlerts,
  listDatasets
};
