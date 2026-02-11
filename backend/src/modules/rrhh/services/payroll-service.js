const { supabase, applyEquals, listWithCount } = require('./supabase-service-utils');

async function listPayrolls({ companyId, employee_id, period, limit, offset }) {
  return listWithCount({
    table: 'hr_payrolls',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      q = applyEquals(q, 'employee_id', employee_id);
      q = applyEquals(q, 'period', period);
      return q;
    },
    limit,
    offset
  });
}

async function getPayrollById({ id, companyId }) {
  let query = supabase.from('hr_payrolls').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createPayroll({ company_id, employee_id, period, gross_amount, net_amount }) {
  const { data, error } = await supabase
    .from('hr_payrolls')
    .insert([{ company_id, employee_id, period, gross_amount, net_amount }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  listPayrolls,
  getPayrollById,
  createPayroll
};
