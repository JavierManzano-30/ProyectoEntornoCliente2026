const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const timesService = require('../services/timesService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await timesService.listTimes(companyId, req.query, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await timesService.createTime(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await timesService.updateTime(companyId, req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteTime(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await timesService.deleteTime(companyId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getProjectTimeSummary(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await timesService.getProjectTimeSummary(companyId, req.params.id);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getUserTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await timesService.getUserTimes(companyId, req.params.id, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getTaskTimes(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await timesService.getTaskTimes(companyId, req.params.id, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listTimes,
  createTime,
  updateTime,
  deleteTime,
  getProjectTimeSummary,
  getUserTimes,
  getTaskTimes
};
