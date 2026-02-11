const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const contactsService = require('../services/contactsService');

function getAuthCompanyId(req) {
  return req.user?.companyId || req.user?.company_id || null;
}

function handleServiceError(err, res, next) {
  if (err?.status && err?.code) {
    return res.status(err.status).json(envelopeError(err.code, err.message, err.details || []));
  }
  return next(err);
}

async function listContacts(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { rows, totalItems } = await contactsService.listContacts(req.query, { limit, offset });
    return res.json(envelopeSuccess(rows, buildPaginationMeta(page, limit, totalItems)));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function getContact(req, res, next) {
  try {
    const data = await contactsService.getContact(req.params.id);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function createContact(req, res, next) {
  try {
    const companyId = getAuthCompanyId(req);
    const data = await contactsService.createContact(companyId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function updateContact(req, res, next) {
  try {
    const data = await contactsService.updateContact(req.params.id, req.body);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

async function deleteContact(req, res, next) {
  try {
    await contactsService.deleteContact(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return handleServiceError(err, res, next);
  }
}

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
