const { envelopeSuccess, envelopeError } = require('../../../utils/envelope');
const { getPaginationParams, buildPaginationMeta } = require('../../../utils/pagination');
const { validateRequiredFields, validateEnum } = require('../../../utils/validation');
const processService = require('../services/process-service');

function resolveCompanyId(req) {
  return (
    req.user?.companyId ||
    req.user?.company_id ||
    req.headers['x-company-id'] ||
    req.query.companyId ||
    req.body?.companyId ||
    null
  );
}

function mapProcess(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    name: row.name,
    description: row.description,
    version: row.version,
    status: row.status,
    activeInstances: row.active_instances ?? 0,
    flowJson: row.flow_json,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapActivity(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    processId: row.process_id,
    name: row.name,
    description: row.description,
    type: row.type,
    sortOrder: row.sort_order,
    assignedRole: row.assigned_role,
    timeLimitHours: row.time_limit_hours,
    requiredDocs: row.required_docs,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listProcesses(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const { page, limit, offset } = getPaginationParams(req.query);
    const { status, search } = req.query;

    const { rows, totalItems } = await processService.listProcesses(companyId, { limit, offset, status, search });
    const data = rows.map(mapProcess);
    const meta = buildPaginationMeta(page, limit, totalItems);

    return res.json(envelopeSuccess(data, meta));
  } catch (err) {
    return next(err);
  }
}

async function getProcess(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const process = await processService.getProcessById(companyId, req.params.id);
    if (!process) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Process not found'));
    }
    const activities = await processService.listActivities(companyId, req.params.id);
    const mapped = mapProcess(process);
    mapped.activities = activities.map(mapActivity);

    return res.json(envelopeSuccess(mapped));
  } catch (err) {
    return next(err);
  }
}

async function createProcess(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['name', 'status']);
    const statusError = validateEnum(req.body.status, ['active', 'inactive', 'archived']);
    if (statusError) errors.push({ field: 'status', message: statusError });
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await processService.createProcess(companyId, {
      ...req.body,
      createdBy: req.user?.userId || null
    });
    return res.status(201).json(envelopeSuccess(mapProcess(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateProcess(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    if (req.body.status) {
      const statusError = validateEnum(req.body.status, ['active', 'inactive', 'archived']);
      if (statusError) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', statusError));
      }
    }

    const row = await processService.updateProcess(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Process not found'));
    }
    return res.json(envelopeSuccess(mapProcess(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteProcess(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const deleted = await processService.deleteProcess(companyId, req.params.id);
    if (!deleted) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Process not found'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function listActivities(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const rows = await processService.listActivities(companyId, req.params.processId);
    return res.json(envelopeSuccess(rows.map(mapActivity)));
  } catch (err) {
    return next(err);
  }
}

async function createActivity(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    const errors = validateRequiredFields(req.body, ['name', 'type', 'sortOrder']);
    const typeError = validateEnum(req.body.type, ['task', 'decision_gateway', 'event', 'wait']);
    if (typeError) errors.push({ field: 'type', message: typeError });
    if (errors.length) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'Invalid data', errors));
    }

    const row = await processService.createActivity(companyId, req.params.processId, req.body);
    return res.status(201).json(envelopeSuccess(mapActivity(row)));
  } catch (err) {
    return next(err);
  }
}

async function updateActivity(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }

    if (req.body.type) {
      const typeError = validateEnum(req.body.type, ['task', 'decision_gateway', 'event', 'wait']);
      if (typeError) {
        return res.status(400).json(envelopeError('VALIDATION_ERROR', typeError));
      }
    }

    const row = await processService.updateActivity(companyId, req.params.id, req.body);
    if (!row) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }
    return res.json(envelopeSuccess(mapActivity(row)));
  } catch (err) {
    return next(err);
  }
}

async function deleteActivity(req, res, next) {
  try {
    const companyId = resolveCompanyId(req);
    if (!companyId) {
      return res.status(400).json(envelopeError('VALIDATION_ERROR', 'companyId is required'));
    }
    const deleted = await processService.deleteActivity(companyId, req.params.id);
    if (!deleted) {
      return res.status(404).json(envelopeError('RESOURCE_NOT_FOUND', 'Actividad no encontrada'));
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listProcesses,
  getProcess,
  createProcess,
  updateProcess,
  deleteProcess,
  listActivities,
  createActivity,
  updateActivity,
  deleteActivity
};
