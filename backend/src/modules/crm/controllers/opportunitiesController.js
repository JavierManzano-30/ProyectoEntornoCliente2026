const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const opportunitiesService = require('../services/opportunitiesService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listOpportunities(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await opportunitiesService.listOpportunities(req.query, { limit, offset }, companyId);
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getOpportunity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await opportunitiesService.getOpportunity(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createOpportunity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await opportunitiesService.createOpportunity(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateOpportunity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await opportunitiesService.updateOpportunity(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteOpportunity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await opportunitiesService.deleteOpportunity(req.params.id, companyId);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateStage(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await opportunitiesService.updateStage(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  updateStage
};
