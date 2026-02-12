const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const activitiesService = require('../services/activitiesService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listActivities(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await activitiesService.listActivities(req.query, { limit, offset }, companyId);
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getActivity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await activitiesService.getActivity(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createActivity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await activitiesService.createActivity(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateActivity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await activitiesService.updateActivity(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await activitiesService.deleteActivity(req.params.id, companyId);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function markCompleted(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await activitiesService.markCompleted(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  markCompleted
};
