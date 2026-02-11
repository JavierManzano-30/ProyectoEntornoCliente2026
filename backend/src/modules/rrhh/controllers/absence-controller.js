const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields } = require('../../../utils/validation');
const absenceService = require('../services/absence-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId,
  validateDateRange
} = require('../services/hr-shared-service');

async function listAbsences(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;

    const { rows, totalItems } = await absenceService.listAbsences({
      companyId,
      employee_id: req.query.employee_id,
      status: req.query.status,
      type: req.query.type,
      start_date_from: req.query.start_date_from,
      end_date_to: req.query.end_date_to,
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getAbsence(req, res, next) {
  try {
    const row = await absenceService.getAbsenceById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createAbsence(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'type',
      'start_date',
      'end_date'
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

    const hasOverlap = await absenceService.hasOverlappingAbsence({
      employee_id: req.body.employee_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    });
    if (hasOverlap) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Ausencia solapada'));
    }

    const row = await absenceService.createAbsence({
      company_id,
      employee_id: req.body.employee_id,
      type: req.body.type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status || 'pending',
      notes: req.body.notes || null
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function updateAbsence(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'type',
      'start_date',
      'end_date'
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

    const hasOverlap = await absenceService.hasOverlappingAbsence({
      employee_id: req.body.employee_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      exclude_id: req.params.id
    });
    if (hasOverlap) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Ausencia solapada'));
    }

    const row = await absenceService.updateAbsence({
      id: req.params.id,
      company_id,
      employee_id: req.body.employee_id,
      type: req.body.type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status || 'pending',
      notes: req.body.notes || null
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function deleteAbsence(req, res, next) {
  try {
    const row = await absenceService.rejectAbsence({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function approveAbsence(req, res, next) {
  try {
    const row = await absenceService.updateAbsenceStatus({
      id: req.params.id,
      companyId: resolveCompanyId(req),
      status: 'approved'
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function rejectAbsence(req, res, next) {
  try {
    const row = await absenceService.updateAbsenceStatus({
      id: req.params.id,
      companyId: resolveCompanyId(req),
      status: 'rejected'
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Ausencia no encontrada'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listAbsences,
  getAbsence,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  approveAbsence,
  rejectAbsence
};


