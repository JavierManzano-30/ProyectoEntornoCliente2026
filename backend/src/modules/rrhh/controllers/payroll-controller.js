const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const payrollService = require('../services/payroll-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId
} = require('../services/hr-shared-service');

async function listPayrolls(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;

    const { rows, totalItems } = await payrollService.listPayrolls({
      companyId,
      employee_id: req.query.employee_id,
      period: req.query.period,
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getPayroll(req, res, next) {
  try {
    const row = await payrollService.getPayrollById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Nomina no encontrada'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createPayroll(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'period',
      'gross_amount',
      'net_amount'
    ]);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id es obligatorio'));
    }

    const row = await payrollService.createPayroll({
      company_id,
      employee_id: req.body.employee_id,
      period: req.body.period,
      gross_amount: req.body.gross_amount,
      net_amount: req.body.net_amount
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPayrolls,
  getPayroll,
  createPayroll
};


