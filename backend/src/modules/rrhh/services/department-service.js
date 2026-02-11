const { supabase, applyEquals, listWithCount } = require('./supabase-service-utils');

async function listDepartments({ companyId, active, limit, offset }) {
  return listWithCount({
    table: 'hr_departments',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      if (active !== null && active !== undefined) q = q.eq('active', active);
      return q;
    },
    limit,
    offset
  });
}

async function getDepartmentById({ id, companyId }) {
  let query = supabase.from('hr_departments').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function createDepartment({ company_id, name, parent_department_id, active }) {
  const { data, error } = await supabase
    .from('hr_departments')
    .insert([{ company_id, name, parent_department_id: parent_department_id || null, active }])
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function updateDepartment({ id, company_id, name, parent_department_id, active }) {
  const { data, error } = await supabase
    .from('hr_departments')
    .update({ company_id, name, parent_department_id: parent_department_id || null, active })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function deleteDepartment({ id, companyId }) {
  let query = supabase.from('hr_departments').delete().eq('id', id).select('id');
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).length > 0;
}

module.exports = {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
