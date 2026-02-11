const supabase = require('../../../config/supabase');

function applyEquals(query, field, value) {
  if (value === undefined || value === null || value === '') return query;
  return query.eq(field, value);
}

async function listWithCount({ table, select = '*', filters, orderBy = 'created_at', limit, offset }) {
  let countQuery = supabase.from(table).select('*', { count: 'exact', head: true });
  if (typeof filters === 'function') {
    countQuery = filters(countQuery);
  }
  const { count, error: countError } = await countQuery;
  if (countError) throw countError;

  let dataQuery = supabase
    .from(table)
    .select(select)
    .order(orderBy, { ascending: false })
    .range(offset, offset + limit - 1);
  if (typeof filters === 'function') {
    dataQuery = filters(dataQuery);
  }
  const { data, error } = await dataQuery;
  if (error) throw error;

  return { rows: data || [], totalItems: count || 0 };
}

function isOverlapping(startA, endA, startB, endB) {
  const aStart = new Date(startA);
  const aEnd = endA ? new Date(endA) : null;
  const bStart = new Date(startB);
  const bEnd = endB ? new Date(endB) : null;

  const maxStart = aStart > bStart ? aStart : bStart;
  const minEnd = !aEnd ? bEnd : !bEnd ? aEnd : aEnd < bEnd ? aEnd : bEnd;
  return !minEnd || maxStart <= minEnd;
}

module.exports = {
  supabase,
  applyEquals,
  listWithCount,
  isOverlapping
};
