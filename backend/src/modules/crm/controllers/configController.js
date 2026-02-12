const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const configService = require('../services/configService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listPipelines(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.listPipelines(req.query, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getPipeline(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.getPipeline(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createPipeline(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.createPipeline(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updatePipeline(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.updatePipeline(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deletePipeline(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await configService.deletePipeline(req.params.id, companyId);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createStage(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.createStage(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateStage(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await configService.updateStage(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteStage(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await configService.deleteStage(req.params.id, companyId);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline,
  createStage,
  updateStage,
  deleteStage
};
