const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const biService = require('../services/bi.service');

// Regex más permisiva para UUIDs (acepta también UUIDs dummy para testing)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

function getAuthContext(req) {
  return {
    userId: req.user?.userId || req.user?.id || null,
    companyId: req.user?.companyId || req.user?.company_id || null
  };
}

function requireAuthContext(req, res) {
  const { userId, companyId } = getAuthContext(req);
  if (!userId || !companyId) {
    res.status(403).json(envelopeError('FORBIDDEN', 'Authenticated user context is incomplete'));
    return null;
  }

  const invalidFields = [];
  if (!isUuid(userId)) invalidFields.push({ field: 'userId', message: 'Must be a valid UUID' });
  if (!isUuid(companyId)) invalidFields.push({ field: 'companyId', message: 'Must be a valid UUID' });

  if (invalidFields.length) {
    res
      .status(400)
      .json(envelopeError('VALIDATION_ERROR', 'Invalid token payload context', invalidFields));
    return null;
  }

  return { userId, companyId };
}

async function getKPIs(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await biService.getKPIs(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function listReports(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await biService.listReports(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function createReport(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;

    if (!req.body?.name || !req.body?.queryDefinition) {
      return res.status(400).json(
        envelopeError('VALIDATION_ERROR', 'Missing required fields', [
          { field: 'name' },
          { field: 'queryDefinition' }
        ])
      );
    }

    const data = await biService.createReport(auth.companyId, auth.userId, req.body);
    return res.status(201).json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function runReport(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const reportId = req.params.id;
    if (!isUuid(reportId)) {
      return res.status(400).json(
        envelopeError('VALIDATION_ERROR', 'Invalid report id', [
          { field: 'id', message: 'Must be a valid UUID' }
        ])
      );
    }

    const data = await biService.runReport(auth.companyId, reportId);
    if (!data) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Report not found'));
    }

    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await biService.getDashboard(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function listAlerts(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await biService.listAlerts(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

async function listDatasets(req, res, next) {
  try {
    const auth = requireAuthContext(req, res);
    if (!auth) return;
    const data = await biService.listDatasets(auth.companyId);
    return res.json(envelopeSuccess(data));
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getKPIs,
  listReports,
  createReport,
  runReport,
  getDashboard,
  listAlerts,
  listDatasets
};
