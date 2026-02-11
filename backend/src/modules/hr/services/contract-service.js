const { supabase, applyEquals, listWithCount, isOverlapping } = require('./supabase-service-utils');

async function listContracts({ companyId, employee_id, active, limit, offset }) {
  return listWithCount({
    table: 'hr_contracts',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      q = applyEquals(q, 'employee_id', employee_id);
      if (active !== null && active !== undefined) q = q.eq('active', active);
      return q;
    },
    limit,
    offset
  });
}

async function getContractById({ id, companyId }) {
  let query = supabase.from('hr_contracts').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function hasOverlappingActiveContract({ employee_id, start_date, end_date, exclude_id }) {
  let query = supabase
    .from('hr_contracts')
    .select('id, start_date, end_date')
    .eq('employee_id', employee_id)
    .eq('active', true);

  if (exclude_id) query = query.neq('id', exclude_id);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).some((row) => isOverlapping(start_date, end_date, row.start_date, row.end_date));
}

async function createContract({
  company_id,
  employee_id,
  start_date,
  end_date,
  contract_type,
  salary,
  active
}) {
  const { data, error } = await supabase
    .from('hr_contracts')
    .insert([{ company_id, employee_id, start_date, end_date: end_date || null, contract_type, salary, active }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateContract({
  id,
  company_id,
  employee_id,
  start_date,
  end_date,
  contract_type,
  salary,
  active
}) {
  const { data, error } = await supabase
    .from('hr_contracts')
    .update({ company_id, employee_id, start_date, end_date: end_date || null, contract_type, salary, active })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function deactivateContract({ id, companyId }) {
  const existing = await getContractById({ id, companyId });
  if (!existing) return null;

  let query = supabase
    .from('hr_contracts')
    .update({ active: false, end_date: existing.end_date || new Date().toISOString().slice(0, 10) })
    .eq('id', id)
    .select('*');

  query = applyEquals(query, 'company_id', companyId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

module.exports = {
  listContracts,
  getContractById,
  hasOverlappingActiveContract,
  createContract,
  updateContract,
  deactivateContract
};
