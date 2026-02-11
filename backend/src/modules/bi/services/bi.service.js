const supabase = require('../../../config/supabase');

async function getKPIs(companyId) {
  const [
    { count: openTicketsCount, error: openTicketsError },
    { data: closedTickets, error: closedTicketsError }
  ] = await Promise.all([
    supabase
      .from('support_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .neq('status', 'closed'),
    supabase
      .from('support_tickets')
      .select('created_at, closed_at')
      .eq('company_id', companyId)
      .eq('status', 'closed')
      .not('closed_at', 'is', null)
  ]);

  if (openTicketsError) throw openTicketsError;
  if (closedTicketsError) throw closedTicketsError;

  const durationsInMinutes = (closedTickets || [])
    .map((ticket) => {
      const createdAt = new Date(ticket.created_at).getTime();
      const closedAt = new Date(ticket.closed_at).getTime();
      if (Number.isNaN(createdAt) || Number.isNaN(closedAt) || closedAt < createdAt) return null;
      return (closedAt - createdAt) / (1000 * 60);
    })
    .filter((value) => value !== null);

  const avgResolutionMinutes = durationsInMinutes.length
    ? durationsInMinutes.reduce((acc, value) => acc + value, 0) / durationsInMinutes.length
    : 0;

  return {
    openTickets: openTicketsCount || 0,
    avgResolutionMinutes
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

module.exports = {
  getKPIs,
  listReports,
  createReport,
  runReport
};
