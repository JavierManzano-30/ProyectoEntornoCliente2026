const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const customersService = require('../services/customersService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listCustomers(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await customersService.listCustomers(req.query, { limit, offset }, companyId);
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getCustomer(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await customersService.getCustomer(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createCustomer(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await customersService.createCustomer(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await customersService.updateCustomer(req.params.id, req.body, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    await customersService.deleteCustomer(req.params.id, companyId);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function convertCustomer(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await customersService.convertCustomer(req.params.id, companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  convertCustomer
};
