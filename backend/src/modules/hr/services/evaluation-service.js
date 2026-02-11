const { supabase, applyEquals, listWithCount } = require('./supabase-service-utils');

async function listEvaluations({ companyId, employee_id, date_from, date_to, limit, offset }) {
  return listWithCount({
    table: 'hr_evaluations',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      q = applyEquals(q, 'employee_id', employee_id);
      if (date_from) q = q.gte('review_date', date_from);
      if (date_to) q = q.lte('review_date', date_to);
      return q;
    },
    limit,
    offset
  });
}

async function getEvaluationById({ id, companyId }) {
  let query = supabase.from('hr_evaluations').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createEvaluation({ company_id, employee_id, score, review_date, notes }) {
  const { data, error } = await supabase
    .from('hr_evaluations')
    .insert([{ company_id, employee_id, score, review_date, notes }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  listEvaluations,
  getEvaluationById,
  createEvaluation
};
