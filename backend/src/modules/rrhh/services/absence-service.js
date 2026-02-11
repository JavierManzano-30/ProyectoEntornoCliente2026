const { supabase, applyEquals, listWithCount, isOverlapping } = require('./supabase-service-utils');

async function listAbsences({
  companyId,
  employee_id,
  status,
  type,
  start_date_from,
  end_date_to,
  limit,
  offset
}) {
  return listWithCount({
    table: 'hr_absences',
    filters: (q) => {
      q = applyEquals(q, 'company_id', companyId);
      q = applyEquals(q, 'employee_id', employee_id);
      q = applyEquals(q, 'status', status);
      q = applyEquals(q, 'type', type);
      if (start_date_from) q = q.gte('start_date', start_date_from);
      if (end_date_to) q = q.lte('end_date', end_date_to);
      return q;
    },
    limit,
    offset
  });
}

async function getAbsenceById({ id, companyId }) {
  let query = supabase.from('hr_absences').select('*').eq('id', id);
  query = applyEquals(query, 'company_id', companyId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function hasOverlappingAbsence({ employee_id, start_date, end_date, exclude_id }) {
  let query = supabase
    .from('hr_absences')
    .select('id, start_date, end_date')
    .eq('employee_id', employee_id)
    .in('status', ['pending', 'approved']);

  if (exclude_id) query = query.neq('id', exclude_id);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).some((row) => isOverlapping(start_date, end_date, row.start_date, row.end_date));
}

async function createAbsence({ company_id, employee_id, type, start_date, end_date, status, notes }) {
  const { data, error } = await supabase
    .from('hr_absences')
    .insert([{ company_id, employee_id, type, start_date, end_date, status: status || 'pending', notes }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateAbsence({
  id,
  company_id,
  employee_id,
  type,
  start_date,
  end_date,
  status,
  notes
}) {
  const { data, error } = await supabase
    .from('hr_absences')
    .update({ company_id, employee_id, type, start_date, end_date, status: status || 'pending', notes })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function rejectAbsence({ id, companyId }) {
  let query = supabase
    .from('hr_absences')
    .update({ status: 'rejected' })
    .eq('id', id)
    .select('*');

  query = applyEquals(query, 'company_id', companyId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

async function updateAbsenceStatus({ id, companyId, status }) {
  let query = supabase.from('hr_absences').update({ status }).eq('id', id).select('*');
  query = applyEquals(query, 'company_id', companyId);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data || null;
}

module.exports = {
  listAbsences,
  getAbsenceById,
  hasOverlappingAbsence,
  createAbsence,
  updateAbsence,
  rejectAbsence,
  updateAbsenceStatus
};
