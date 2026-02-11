const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const tasksService = require('../services/tasksService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listTasks(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await tasksService.listTasks(companyId, req.query, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await tasksService.getTask(companyId, req.params.id);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await tasksService.createTask(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await tasksService.updateTask(companyId, req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await tasksService.deleteTask(companyId, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await tasksService.updateTaskStatus(companyId, req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function assignTask(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await tasksService.assignTask(companyId, req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask
};
