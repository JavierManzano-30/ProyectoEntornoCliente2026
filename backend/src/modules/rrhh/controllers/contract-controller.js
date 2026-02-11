const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const contractService = require('../services/contract-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId,
  parseBoolean,
  validateDateRange
} = require('../services/hr-shared-service');

async function listContracts(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;

    const { rows, totalItems } = await contractService.listContracts({
      companyId,
      employee_id: req.query.employee_id,
      active: parseBoolean(req.query.active),
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getContract(req, res, next) {
  try {
    const row = await contractService.getContractById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createContract(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'start_date',
      'contract_type',
      'salary'
    ]);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    const dateError = validateDateRange(req.body.start_date, req.body.end_date);
    if (dateError) requiredErrors.push(dateError);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id es obligatorio'));
    }

    const active = req.body.active !== undefined ? !!req.body.active : true;
    if (active) {
      const hasOverlap = await contractService.hasOverlappingActiveContract({
        employee_id: req.body.employee_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date || null
      });
      if (hasOverlap) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
    }

    const row = await contractService.createContract({
      company_id,
      employee_id: req.body.employee_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      contract_type: req.body.contract_type,
      salary: req.body.salary,
      active
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function updateContract(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'start_date',
      'contract_type',
      'salary'
    ]);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    const dateError = validateDateRange(req.body.start_date, req.body.end_date);
    if (dateError) requiredErrors.push(dateError);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id es obligatorio'));
    }

    const active = req.body.active !== undefined ? !!req.body.active : true;
    if (active) {
      const hasOverlap = await contractService.hasOverlappingActiveContract({
        employee_id: req.body.employee_id,
        start_date: req.body.start_date,
        end_date: req.body.end_date || null,
        exclude_id: req.params.id
      });
      if (hasOverlap) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Contrato activo solapado'));
      }
    }

    const row = await contractService.updateContract({
      id: req.params.id,
      company_id,
      employee_id: req.body.employee_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      contract_type: req.body.contract_type,
      salary: req.body.salary,
      active
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function deleteContract(req, res, next) {
  try {
    const row = await contractService.deactivateContract({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Contrato no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract
};


