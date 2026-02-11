const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const departmentService = require('../services/department-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId,
  parseBoolean
} = require('../services/hr-shared-service');

async function listDepartments(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;
    const active = parseBoolean(req.query.active);

    const { rows, totalItems } = await departmentService.listDepartments({
      companyId,
      active,
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getDepartment(req, res, next) {
  try {
    const row = await departmentService.getDepartmentById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createDepartment(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['company_id', 'name']);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id es obligatorio'));
    }

    const row = await departmentService.createDepartment({
      company_id,
      name: req.body.name,
      parent_department_id: req.body.parent_department_id || null,
      active: req.body.active !== undefined ? !!req.body.active : true
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function updateDepartment(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, ['company_id', 'name']);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Datos invalidos', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id es obligatorio'));
    }

    const row = await departmentService.updateDepartment({
      id: req.params.id,
      company_id,
      name: req.body.name,
      parent_department_id: req.body.parent_department_id || null,
      active: req.body.active !== undefined ? !!req.body.active : true
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const deleted = await departmentService.deleteDepartment({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!deleted) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Departamento no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};


