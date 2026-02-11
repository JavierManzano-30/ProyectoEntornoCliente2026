const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const employeeService = require('../services/employee-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId
} = require('../services/hr-shared-service');

async function listEmployees(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;

    const { rows, totalItems } = await employeeService.listEmployees({
      companyId,
      department_id: req.query.department_id,
      status: req.query.status,
      search: req.query.search,
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getEmployee(req, res, next) {
  try {
    const row = await employeeService.getEmployeeById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createEmployee(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'first_name',
      'last_name',
      'email',
      'hire_date',
      'department_id'
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

    const row = await employeeService.createEmployee({
      company_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      status: req.body.status || 'active',
      hire_date: req.body.hire_date,
      department_id: req.body.department_id,
      user_id: req.body.user_id || null
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'first_name',
      'last_name',
      'email',
      'hire_date',
      'department_id'
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

    const row = await employeeService.updateEmployee({
      id: req.params.id,
      company_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      status: req.body.status || 'active',
      hire_date: req.body.hire_date,
      department_id: req.body.department_id,
      user_id: req.body.user_id || null
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const row = await employeeService.deactivateEmployee({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function getEmployeeSummary(req, res, next) {
  try {
    const row = await employeeService.getEmployeeSummary({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Empleado no encontrado'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSummary
};


