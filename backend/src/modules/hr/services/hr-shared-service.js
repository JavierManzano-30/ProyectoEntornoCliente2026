const { envelopeError } = require('../../../utils/envelope');

function resolveCompanyId(req) {
  return req.user?.companyId || req.user?.companyId || req.user?.company_id || null;
}

function ensureCompanyMatch(req, providedCompanyId) {
  const tokenCompanyId = resolveCompanyId(req);
  if (tokenCompanyId && providedCompanyId && providedCompanyId !== tokenCompanyId) {
    return envelopeError('FORBIDDEN', 'Empresa no autorizada');
  }
  return null;
}

function ensureCompanyId(req, providedCompanyId) {
  return resolveCompanyId(req) || providedCompanyId || null;
}

function parseBoolean(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function validateDateRange(startDate, endDate, startField = 'start_date', endField = 'end_date') {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) {
    return { field: startField, message: `${startField} is invalid` };
  }
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return { field: endField, message: `${endField} is invalid` };
  }
  if (start > end) {
    return { field: endField, message: `${endField} debe ser igual o posterior a ${startField}` };
  }
  return null;
}

module.exports = {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId,
  parseBoolean,
  validateDateRange
};
