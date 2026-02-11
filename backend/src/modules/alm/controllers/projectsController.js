const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const projectsService = require('../services/projectsService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listProjects(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await projectsService.listProjects(companyId, req.query, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await projectsService.getProject(companyId, req.params.id);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await projectsService.createProject(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await projectsService.updateProject(companyId, req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteProject(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await projectsService.deleteProject(companyId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function listProjectTasks(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await projectsService.listProjectTasks(companyId, req.params.id, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getProjectStats(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await projectsService.getProjectStats(companyId, req.params.id);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listProjectTasks,
  getProjectStats
};
