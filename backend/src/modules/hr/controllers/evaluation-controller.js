const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, isNumber } = require('../../../utils/validation');
const evaluationService = require('../services/evaluation-service');
const {
  resolveCompanyId,
  ensureCompanyMatch,
  ensureCompanyId
} = require('../services/hr-shared-service');

async function listEvaluations(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const companyId = resolveCompanyId(req) || req.query.company_id;

    const { rows, totalItems } = await evaluationService.listEvaluations({
      companyId,
      employee_id: req.query.employee_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      limit,
      offset
    });

    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return next(err);
  }
}

async function getEvaluation(req, res, next) {
  try {
    const row = await evaluationService.getEvaluationById({
      id: req.params.id,
      companyId: resolveCompanyId(req)
    });

    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Evaluation not found'));
    }

    return res.json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

async function createEvaluation(req, res, next) {
  try {
    const requiredErrors = validateRequiredFields(req.body, [
      'company_id',
      'employee_id',
      'score',
      'review_date'
    ]);
    const companyError = ensureCompanyMatch(req, req.body.company_id);
    if (companyError) return res.status(403).json(companyError);

    if (req.body.score !== undefined) {
      if (!isNumber(req.body.score)) {
        requiredErrors.push({ field: 'score', message: 'Must be numeric' });
      } else if (req.body.score < 0 || req.body.score > 100) {
        requiredErrors.push({ field: 'score', message: 'Must be between 0 and 100' });
      }
    }

    if (requiredErrors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', requiredErrors));
    }

    const company_id = ensureCompanyId(req, req.body.company_id);
    if (!company_id) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'company_id is required'));
    }

    const row = await evaluationService.createEvaluation({
      company_id,
      employee_id: req.body.employee_id,
      score: req.body.score,
      review_date: req.body.review_date,
      notes: req.body.notes || null
    });

    return res.status(201).json(envelopeSuccess(row));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEvaluations,
  getEvaluation,
  createEvaluation
};


