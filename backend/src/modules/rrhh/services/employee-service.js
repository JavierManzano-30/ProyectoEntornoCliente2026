const { supabase, applyEquals, listWithCount } = require('./supabase-service-utils');

async function listEmployees({ companyId, department_id, status, search, limit, offset }) {
  return listWithCount({
    table: 'hr_employees',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      q = applyEquals(q, 'department_id', department_id);
      q = applyEquals(q, 'status', status);
      if (search) {
        q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      return q;
    },
    limit,
    offset
  });
}

async function getEmployeeById({ id, companyId }) {
  let query = supabase.from('hr_employees').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function departmentExists({ id, companyId }) {
  let query = supabase.from('hr_departments').select('id').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return !!data;
}

async function createEmployee({
  company_id,
  first_name,
  last_name,
  email,
  status,
  hire_date,
  department_id,
  user_id
}) {
  const { data, error } = await supabase
    .from('hr_employees')
    .insert([
      { company_id, first_name, last_name, email, status, hire_date, department_id, user_id: user_id || null }
    ])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateEmployee({
  id,
  company_id,
  first_name,
  last_name,
  email,
  status,
  hire_date,
  department_id,
  user_id
}) {
  const { data, error } = await supabase
    .from('hr_employees')
    .update({
      company_id,
      first_name,
      last_name,
      email,
      status,
      hire_date,
      department_id,
      user_id: user_id || null
    })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function deactivateEmployee({ id, companyId }) {
  let query = supabase
    .from('hr_employees')
    .update({ status: 'inactive' })
    .eq('id', id)
    .select('*');

  query = applyEquals(query, 'company_id', companyId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function getEmployeeSummary({ id, companyId }) {
  let employeeQuery = supabase
    .from('hr_employees')
    .select('id, first_name, last_name, status, department_id')
    .eq('id', id);

  employeeQuery = applyEquals(employeeQuery, 'company_id', companyId);

  const { data: employee, error: employeeError } = await employeeQuery.maybeSingle();
  if (employeeError) throw employeeError;
  if (!employee) return null;

  const { data: department, error: deptError } = await supabase
    .from('hr_departments')
    .select('name')
    .eq('id', employee.department_id)
    .maybeSingle();

  if (deptError) throw deptError;

  return {
    id: employee.id,
    full_name: `${employee.first_name} ${employee.last_name}`.trim(),
    department_name: department?.name || null,
    status: employee.status
  };
}

module.exports = {
  listEmployees,
  getEmployeeById,
  departmentExists,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
  getEmployeeSummary
};
